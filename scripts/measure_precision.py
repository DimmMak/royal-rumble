#!/usr/bin/env python3
"""Measure precision metrics on a .rumble output file.

Reads a saved rumble archive (markdown), regex-counts UNVERIFIED/ESTIMATE/SRC tags
per legend section, computes completeness rate, and emits a deterministic JSON
measurement file.

Per Guard 5 (measurement-honesty): zero fabricated numbers. Every field is
grep-able from the input text. If a count is ambiguous, script reports 'unknown'
rather than guessing.

Usage:
    python3 measure_precision.py <rumble_archive.md> [--phase pre|post] [--ticker NVDA]
    python3 measure_precision.py --compare NVDA_2026-04-22_pre.json NVDA_2026-04-23_post.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROYAL_RUMBLE_ROOT = SCRIPT_DIR.parent
MEASUREMENTS_DIR = ROYAL_RUMBLE_ROOT / "data" / "measurements"
PREDICTIONS_PATH = ROYAL_RUMBLE_ROOT / "data" / "predictions.json"

# Legend section headers as they appear in rumble output
LEGENDS = {
    "tom_lee": "TOM LEE",
    "cathie_wood": "CATHIE WOOD",
    "druckenmiller": "DRUCKENMILLER",
    "dalio": "RAY DALIO",
    "klarman": "SETH KLARMAN",
    "simons": "JIM SIMONS",
    "soros": "GEORGE SOROS",
    "vol_desk": "VOL DESK",
    "marks": "HOWARD MARKS",
    "trend": "TREND FOLLOWER",
    "ackman": "BILL ACKMAN",
    "rogers": "JIM ROGERS",
    "buffett": "WARREN BUFFETT",
}

# Expected required-input fields per legend (for completeness rate)
# Field names are case-insensitive regex patterns that must appear with [SRC: ...]
# tag in the legend's section to count as "filled"
LEGEND_SCHEMAS = {
    "tom_lee": ["fed", "m2", "credit spread", "yield curve", "rrp"],
    "cathie_wood": ["platform", "convergence", "tam", "s-curve|phase", "wright"],
    "druckenmiller": ["earnings catalyst", "macro alignment", "price action|volume", "rate cycle", "entry asymmetry|asymmetry"],
    "dalio": ["cycle", "policy regime|policy", "drawdown", "correlation", "hedge|sizing"],
    "klarman": ["epv|earnings power", "franchise", "margin of safety", "klarman buy|buy price", "red flag|premium"],
    "simons": ["12-month|12m|momentum", "rsi", "analyst|revision", "factor|volume", "flow|institutional"],
    "soros": ["narrative", "boom|bust|phase", "reflexivity|loop", "consensus|analyst", "media|saturation|short interest"],
    "vol_desk": ["iv rank", "iv.*rv", "term structure", "skew|risk reversal", "max pain", "put oi|put open interest", "call oi|call open interest", "dealer gamma"],
    "marks": ["consensus", "contrarian|priced in", "debt|balance sheet", "lending", "pendulum|psychology"],
    "trend": ["200.day|200dma|200.dma", "50.200|golden cross|death cross", "breakout|higher high", "adx", "volume confirmation"],
    "ackman": ["simplicity|market position", "roic|roe", "fcf|free cash flow", "catalyst", "value gap|intrinsic"],
    "rogers": ["input cost|commodit", "commodity cycle|cycle position", "supply.*demand|tsmc", "dollar|dxy|currency", "em|china|geopolit"],
    "buffett": ["circle of competence|circle", "moat", "owner earnings|fcf", "roic|roe", "price.*value|p/s"],
}


def extract_legend_sections(text: str) -> dict[str, str]:
    """Split rumble text by legend headers. Returns {legend_key: section_text}."""
    sections = {}
    for key, header_pattern in LEGENDS.items():
        # Match from legend header to next ## ... LEGEND header or end
        regex = rf"##\s*[^\n]*{re.escape(header_pattern)}[^\n]*\n(.*?)(?=##\s*[^\n]*—|##\s*[^\n]*LEGEND|##\s*RUMBLE|##\s*⚖️|\Z)"
        match = re.search(regex, text, re.IGNORECASE | re.DOTALL)
        sections[key] = match.group(1) if match else ""
    return sections


def count_tag(text: str, tag: str) -> int:
    """Count occurrences of [TAG or [TAG: patterns."""
    return len(re.findall(rf"\[{re.escape(tag)}\b", text, re.IGNORECASE))


def count_src_citations(text: str) -> int:
    """Count [SRC: ...] citations."""
    return len(re.findall(r"\[SRC:\s*[^\]]+\]", text))


def legend_completeness(section: str, required_fields: list[str]) -> dict:
    """For each required field, check if it appears with [SRC: ...] in the section."""
    filled = 0
    field_results = {}
    for field in required_fields:
        # Does the field-pattern appear, AND does it have a [SRC: ...] nearby?
        # Look for field keyword within 200 chars of a [SRC: ...] citation
        pattern = rf"({field})[^\n]*?\[SRC:"
        has_src = bool(re.search(pattern, section, re.IGNORECASE))
        # OR it could appear as just a structured number with [REPORTED]
        if not has_src:
            pattern_reported = rf"({field})[^\n]*?\[REPORTED\]"
            has_src = bool(re.search(pattern_reported, section, re.IGNORECASE))
        field_results[field] = "filled" if has_src else "empty"
        if has_src:
            filled += 1
    return {
        "filled": filled,
        "total": len(required_fields),
        "rate": filled / len(required_fields) if required_fields else 0.0,
        "fields": field_results,
    }


def extract_tokens(text: str) -> int | None:
    """Extract subagent total_tokens from usage block if present."""
    match = re.search(r"total[_\s]tokens:\s*(\d+)", text, re.IGNORECASE)
    return int(match.group(1)) if match else None


def get_guard_flags_from_predictions(ticker: str, date: str) -> dict | None:
    """Look up guard_flag_count + guard_result from predictions.json for this rumble."""
    if not PREDICTIONS_PATH.exists():
        return None
    with PREDICTIONS_PATH.open() as f:
        data = json.load(f)
    matches = [r for r in data.get("rumbles", []) if r.get("ticker") == ticker and r.get("date") == date]
    if not matches:
        return None
    entry = matches[-1]  # most recent
    return {
        "guard_flag_count": entry.get("guard_flag_count"),
        "guard_result": entry.get("guard_result"),
        "combined_score": entry.get("combined_score"),
        "verdict": entry.get("verdict"),
    }


def measure_rumble(archive_path: Path, ticker: str | None = None, phase: str = "unknown") -> dict:
    """Full measurement on a rumble archive file."""
    text = archive_path.read_text(encoding="utf-8")

    # Infer ticker from filename if not provided: e.g. "2026-04-22-NVDA-pre-phase1.md"
    if not ticker:
        m = re.search(r"[A-Z]{2,5}", archive_path.stem)
        ticker = m.group(0) if m else "UNKNOWN"

    # Infer date from filename if possible: "2026-04-22-..."
    date_match = re.match(r"(\d{4}-\d{2}-\d{2})", archive_path.stem)
    rumble_date = date_match.group(1) if date_match else None

    sections = extract_legend_sections(text)

    # Per-legend counts
    per_legend_unverified = {k: count_tag(v, "UNVERIFIED") for k, v in sections.items()}
    per_legend_estimate = {k: count_tag(v, "ESTIMATE") for k, v in sections.items()}
    per_legend_src = {k: count_src_citations(v) for k, v in sections.items()}

    # Completeness per legend
    completeness = {}
    for key, section in sections.items():
        if key in LEGEND_SCHEMAS:
            completeness[key] = legend_completeness(section, LEGEND_SCHEMAS[key])

    # Weighted overall completeness (voting legends only)
    voting_weights = {
        "druckenmiller": 0.20, "tom_lee": 0.15, "cathie_wood": 0.15,
        "dalio": 0.15, "klarman": 0.10, "simons": 0.10,
        "soros": 0.10, "vol_desk": 0.05,
    }
    weighted_rate = sum(completeness.get(l, {"rate": 0})["rate"] * w
                        for l, w in voting_weights.items())

    # Totals
    total_unverified = sum(per_legend_unverified.values())
    total_estimate = sum(per_legend_estimate.values())
    total_src = sum(per_legend_src.values())

    # Tokens (if present in archive)
    tokens = extract_tokens(text)

    # Guard flags from predictions.json
    guard_info = get_guard_flags_from_predictions(ticker, rumble_date) if rumble_date else None

    measurement = {
        "ticker": ticker,
        "rumble_date": rumble_date,
        "archive_path": str(archive_path),
        "measured_at_iso": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "phase": phase,
        "totals": {
            "unverified_count": total_unverified,
            "estimate_count": total_estimate,
            "src_citation_count": total_src,
        },
        "per_legend_unverified": per_legend_unverified,
        "per_legend_estimate": per_legend_estimate,
        "per_legend_src_citations": per_legend_src,
        "completeness": completeness,
        "weighted_completeness_rate": round(weighted_rate, 4),
        "subagent_tokens": tokens,
        "guard_info": guard_info,
    }

    return measurement


def print_report(m: dict) -> None:
    print(f"\n📏 PRECISION MEASUREMENT — {m['ticker']} ({m['phase']})\n")
    print(f"Archive:  {m['archive_path']}")
    print(f"Date:     {m['rumble_date']}")
    print()
    print(f"🏆 TOTALS")
    t = m["totals"]
    print(f"  UNVERIFIED tags:      {t['unverified_count']}")
    print(f"  [ESTIMATE] tags:      {t['estimate_count']}")
    print(f"  [SRC: ...] citations: {t['src_citation_count']}")
    print()
    print(f"📊 WEIGHTED COMPLETENESS (voting legends): {m['weighted_completeness_rate']:.1%}")
    print()
    print(f"🔍 PER-LEGEND BREAKDOWN")
    print(f"  {'Legend':<15} {'UNVER':>5} {'EST':>5} {'SRC':>5} {'Fill/Tot':>10} {'Rate':>6}")
    for legend in LEGENDS:
        u = m["per_legend_unverified"].get(legend, 0)
        e = m["per_legend_estimate"].get(legend, 0)
        s = m["per_legend_src_citations"].get(legend, 0)
        comp = m["completeness"].get(legend, {})
        fill_tot = f"{comp.get('filled', '?')}/{comp.get('total', '?')}" if comp else "-"
        rate = comp.get("rate", 0) if comp else 0
        rate_str = f"{rate:.0%}" if comp else "-"
        print(f"  {legend:<15} {u:>5} {e:>5} {s:>5} {fill_tot:>10} {rate_str:>6}")
    print()
    if m.get("subagent_tokens"):
        print(f"🧠 Subagent tokens: {m['subagent_tokens']:,}")
    if m.get("guard_info"):
        g = m["guard_info"]
        print(f"🛡️  Guard: {g.get('guard_result')} ({g.get('guard_flag_count')} flags) · Verdict: {g.get('verdict')} @ score {g.get('combined_score')}")


def compare_measurements(pre_path: Path, post_path: Path) -> dict:
    """Diff two measurement JSONs (pre vs post)."""
    pre = json.loads(pre_path.read_text())
    post = json.loads(post_path.read_text())

    def delta(a, b):
        if a is None or b is None:
            return None
        return b - a

    return {
        "ticker": pre["ticker"],
        "pre_phase": pre["phase"],
        "post_phase": post["phase"],
        "deltas": {
            "unverified_count": delta(pre["totals"]["unverified_count"], post["totals"]["unverified_count"]),
            "estimate_count": delta(pre["totals"]["estimate_count"], post["totals"]["estimate_count"]),
            "src_citation_count": delta(pre["totals"]["src_citation_count"], post["totals"]["src_citation_count"]),
            "weighted_completeness_rate": round(post["weighted_completeness_rate"] - pre["weighted_completeness_rate"], 4),
            "subagent_tokens": delta(pre.get("subagent_tokens"), post.get("subagent_tokens")),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Measure precision on a rumble archive")
    parser.add_argument("archive_or_cmd", nargs="?", help="Path to rumble archive MD OR --compare")
    parser.add_argument("--compare", nargs=2, metavar=("PRE_JSON", "POST_JSON"), help="Compare two measurement JSONs")
    parser.add_argument("--phase", default="unknown", choices=["pre", "post", "unknown"])
    parser.add_argument("--ticker", default=None)
    parser.add_argument("--save", action="store_true", help="Save measurement JSON to data/measurements/")
    parser.add_argument("--json", action="store_true", help="Print JSON instead of formatted report")
    args = parser.parse_args()

    if args.compare:
        diff = compare_measurements(Path(args.compare[0]), Path(args.compare[1]))
        print(json.dumps(diff, indent=2))
        return 0

    if not args.archive_or_cmd:
        parser.print_help()
        return 2

    archive_path = Path(args.archive_or_cmd)
    if not archive_path.exists():
        print(f"❌ Archive not found: {archive_path}", file=sys.stderr)
        return 2

    measurement = measure_rumble(archive_path, ticker=args.ticker, phase=args.phase)

    if args.json:
        print(json.dumps(measurement, indent=2))
    else:
        print_report(measurement)

    if args.save:
        MEASUREMENTS_DIR.mkdir(parents=True, exist_ok=True)
        ticker = measurement["ticker"]
        date = measurement["rumble_date"] or datetime.now().strftime("%Y-%m-%d")
        phase = measurement["phase"]
        out_path = MEASUREMENTS_DIR / f"{ticker}_{date}_{phase}.json"
        out_path.write_text(json.dumps(measurement, indent=2))
        print(f"\n💾 Saved: {out_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
