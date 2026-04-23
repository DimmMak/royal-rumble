#!/usr/bin/env python3
"""
validate_rumble_math.py — post-rumble math validator (v1.0.0, 2026-04-23)

Catches two common failure modes that the blind-committee subagent produces
because LLMs can label math wrong while the rest of the prose stays coherent:

  1. ATR multiplier mislabel — e.g. "stop $405 (2×ATR above)" when the stop
     is actually 0.5×ATR above (Druck's TSLA 2026-04-23 bug).
  2. R/R arithmetic mismatch — e.g. claiming "R/R ≈ 6:1" when the entry /
     stop / targets produce a different ratio.

Usage:
  python3 validate_rumble_math.py <archive.md>
  python3 validate_rumble_math.py <archive.md> --strict   (exit 1 on any flag)

Output: per-legend table of findings. Clean legends are ✅. Flagged legends
show the discrepancy between stated and computed values.

Thresholds:
  - ATR multiplier: flag if |stated_N - computed_N| / computed_N > 0.15
  - R/R ratio:      flag if |stated - computed| / computed > 0.20
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple


ATR_MULT_TOLERANCE = 0.15    # 15% tolerance on ATR multiplier claims
RR_TOLERANCE = 0.20          # 20% tolerance on R/R ratio claims

# Legend header patterns — same convention used in rumble archives
LEGEND_HEADERS = [
    r"TOM LEE", r"CATHIE WOOD", r"DRUCKENMILLER", r"RAY DALIO", r"SETH KLARMAN",
    r"JIM SIMONS", r"GEORGE SOROS", r"VOL DESK", r"HOWARD MARKS", r"TREND FOLLOWER",
    r"BILL ACKMAN", r"JIM ROGERS", r"WARREN BUFFETT",
]


def extract_snapshot_values(text: str) -> Dict[str, Optional[float]]:
    """Pull global reference values from the top-level data snapshot."""
    out = {"price": None, "atr": None}

    # Price: look for "PRICE: $387.51" or "Price: $387.51" or "CURRENT PRICE:    $387.51"
    m = re.search(r"(?:current\s+)?price\s*:?\s*\$?(\d+(?:\.\d+)?)", text, re.IGNORECASE)
    if m:
        out["price"] = float(m.group(1))

    # ATR: "ATR(14): $16.12" or "ATR 16.12" or "ATR(14) = $16.12"
    m = re.search(r"atr\s*(?:\(\d+\))?\s*[:=]?\s*\$?(\d+(?:\.\d+)?)", text, re.IGNORECASE)
    if m:
        out["atr"] = float(m.group(1))

    return out


def extract_legend_sections(text: str) -> Dict[str, str]:
    """Split rumble text by legend headers."""
    sections: Dict[str, str] = {}
    for header in LEGEND_HEADERS:
        # Match H2 or H3 with the header, capture until next H2/H3 or end
        pattern = rf"##\s*[^\n]*\b{header}\b[^\n]*\n(.*?)(?=\n##\s|\Z)"
        m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if m:
            key = header.lower().replace(" ", "_")
            sections[key] = m.group(1)
    return sections


def find_price_numbers(s: str) -> List[float]:
    """Extract all dollar-amount floats from a string."""
    matches = re.findall(r"\$(\d+(?:\.\d+)?)", s)
    return [float(m) for m in matches]


def find_atr_multiplier_claims(section: str) -> List[Tuple[str, float, List[float]]]:
    """Find statements like 'stop $405 (2×ATR above)' in a legend section.

    Returns list of (sentence, stated_multiplier, dollar_values_nearby).
    """
    claims = []
    # Sentences containing N×ATR or NxATR (case insensitive)
    # Capture a wider window — up to 200 chars of context
    pattern = r"([^.!?\n]*?(\d+(?:\.\d+)?)\s*[×x]\s*ATR[^.!?\n]*[.!?]?)"
    for m in re.finditer(pattern, section, re.IGNORECASE):
        sentence = m.group(1).strip()
        multiplier = float(m.group(2))
        prices = find_price_numbers(sentence)
        if prices:
            claims.append((sentence, multiplier, prices))
    return claims


def find_rr_claims(section: str) -> List[Tuple[str, float]]:
    """Find statements like 'R/R ≈ 6:1' or 'R/R ~ 3.5:1'."""
    claims = []
    pattern = r"((?:R/R|risk[- ](?:to[- ])?reward|R[\/:]R)\s*[≈~=:]*\s*(\d+(?:\.\d+)?)\s*:\s*1)"
    for m in re.finditer(pattern, section, re.IGNORECASE):
        claims.append((m.group(1).strip(), float(m.group(2))))
    return claims


def find_entry_stop_targets(section: str) -> Dict[str, List[float]]:
    """Heuristic extraction of entry / stop / target prices in a legend section."""
    out = {"entries": [], "stops": [], "targets": []}

    # Entry: "entry $395-$400" or "entry zone $395-$400" or "entry: $395" (catch both)
    for m in re.finditer(
        r"entry[\s\w]{0,30}?\$?(\d+(?:\.\d+)?)\s*(?:-|to|–)\s*\$?(\d+(?:\.\d+)?)",
        section, re.IGNORECASE,
    ):
        lo, hi = float(m.group(1)), float(m.group(2))
        out["entries"].append((lo + hi) / 2)  # midpoint
    for m in re.finditer(r"entry[\s\w]{0,15}?\$(\d+(?:\.\d+)?)\b(?!\s*(?:-|to|–))",
                         section, re.IGNORECASE):
        out["entries"].append(float(m.group(1)))

    # Stop: "stop $402" or "stop-loss $182.40" or "stop: $405"
    for m in re.finditer(r"stop(?:[- ]loss)?[\s\w]{0,15}?\$(\d+(?:\.\d+)?)",
                         section, re.IGNORECASE):
        out["stops"].append(float(m.group(1)))

    # Target: "target $371" / "T1 $382" / "targets $382/$371/$341"
    for m in re.finditer(r"target(?:s)?[\s\w]{0,20}?\$(\d+(?:\.\d+)?)", section, re.IGNORECASE):
        out["targets"].append(float(m.group(1)))
    for m in re.finditer(r"T[123][:\s]*\$(\d+(?:\.\d+)?)", section):
        out["targets"].append(float(m.group(1)))

    return out


def validate_atr_claim(claim_sentence: str, stated_mult: float, prices_in_sentence: List[float],
                       global_price: Optional[float], global_atr: Optional[float]) -> Optional[Dict]:
    """Check if 'stop $X (N×ATR above)' holds: |stop - entry| / atr ≈ N."""
    if global_atr is None or not prices_in_sentence:
        return None

    # Heuristic: the prices in sentence are entry and stop. Use global price as reference for entry.
    # If sentence has 2+ prices, assume first = entry context, last = stop (or vice versa).
    # If only 1 price, assume it's the stop and compute against global_price.
    entry: Optional[float] = None
    stop: Optional[float] = None

    if len(prices_in_sentence) == 1 and global_price is not None:
        stop = prices_in_sentence[0]
        entry = global_price
    elif len(prices_in_sentence) >= 2:
        # The stop is typically mentioned RIGHT before/after "N×ATR"
        # Fallback: use first two prices as entry/stop
        entry, stop = prices_in_sentence[0], prices_in_sentence[1]

    if entry is None or stop is None:
        return None

    actual_distance = abs(stop - entry)
    computed_mult = actual_distance / global_atr
    deviation = abs(computed_mult - stated_mult) / max(stated_mult, 0.01)

    if deviation > ATR_MULT_TOLERANCE:
        return {
            "kind": "ATR_MULTIPLIER_MISMATCH",
            "sentence": claim_sentence[:160] + ("…" if len(claim_sentence) > 160 else ""),
            "stated": f"{stated_mult}×ATR",
            "computed": f"{computed_mult:.2f}×ATR",
            "entry": entry,
            "stop": stop,
            "atr": global_atr,
            "deviation_pct": round(deviation * 100, 1),
        }
    return None


def validate_rr_claim(claim_sentence: str, stated_rr: float,
                      entries: List[float], stops: List[float],
                      targets: List[float]) -> Optional[Dict]:
    """Check if R/R = |target - entry| / |stop - entry| matches stated."""
    if not entries or not stops or not targets:
        return None

    entry = sum(entries) / len(entries)
    stop = stops[0] if len(stops) == 1 else min(stops, key=lambda s: abs(s - entry))

    # Use average of targets as the reward baseline (matches Trend Follower's blended-R/R style)
    avg_target = sum(targets) / len(targets)

    risk = abs(stop - entry)
    reward = abs(avg_target - entry)
    if risk < 0.01:
        return None

    computed_rr = reward / risk
    deviation = abs(computed_rr - stated_rr) / max(stated_rr, 0.01)

    if deviation > RR_TOLERANCE:
        return {
            "kind": "RR_MISMATCH",
            "claim": claim_sentence,
            "stated": f"{stated_rr}:1",
            "computed": f"{computed_rr:.2f}:1",
            "entry_avg": round(entry, 2),
            "stop": round(stop, 2),
            "target_avg": round(avg_target, 2),
            "deviation_pct": round(deviation * 100, 1),
        }
    return None


def validate_archive(archive_path: Path) -> Dict:
    text = archive_path.read_text()
    snapshot = extract_snapshot_values(text)
    sections = extract_legend_sections(text)

    results: Dict[str, List[Dict]] = {}
    for legend, section in sections.items():
        flags: List[Dict] = []

        # ATR multiplier checks
        for sentence, mult, prices in find_atr_multiplier_claims(section):
            flag = validate_atr_claim(sentence, mult, prices, snapshot["price"], snapshot["atr"])
            if flag:
                flags.append(flag)

        # R/R checks
        est = find_entry_stop_targets(section)
        for sentence, stated_rr in find_rr_claims(section):
            flag = validate_rr_claim(sentence, stated_rr, est["entries"], est["stops"], est["targets"])
            if flag:
                flags.append(flag)

        results[legend] = flags

    return {
        "archive": str(archive_path),
        "snapshot": snapshot,
        "sections_found": list(sections.keys()),
        "flags": results,
        "total_flags": sum(len(v) for v in results.values()),
    }


def print_report(report: Dict) -> None:
    print(f"\n📐 RUMBLE MATH VALIDATOR — {Path(report['archive']).name}")
    print(f"   Snapshot price: ${report['snapshot']['price']}    ATR: ${report['snapshot']['atr']}")
    print(f"   Sections found: {len(report['sections_found'])}")
    print(f"   Total flags:    {report['total_flags']}")
    print("=" * 72)

    clean_count = 0
    for legend, flags in report["flags"].items():
        if not flags:
            clean_count += 1
            continue
        print(f"\n🚩 {legend.upper().replace('_', ' ')}")
        for f in flags:
            print(f"   [{f['kind']}] deviation {f['deviation_pct']}%")
            if f["kind"] == "ATR_MULTIPLIER_MISMATCH":
                print(f"      stated:    {f['stated']}")
                print(f"      computed:  {f['computed']}  (entry ${f['entry']} → stop ${f['stop']} = ${abs(f['stop']-f['entry']):.2f} ≈ {f['computed']})")
                print(f"      context:   \"{f['sentence']}\"")
            elif f["kind"] == "RR_MISMATCH":
                print(f"      stated:    R/R {f['stated']}")
                print(f"      computed:  R/R {f['computed']}")
                print(f"      (entry avg ${f['entry_avg']}, stop ${f['stop']}, target avg ${f['target_avg']})")
                print(f"      claim:     \"{f['claim']}\"")

    print(f"\n✅ Clean legends: {clean_count}/{len(report['flags'])}")


def main():
    parser = argparse.ArgumentParser(description="Validate math claims in a rumble archive")
    parser.add_argument("archive", help="Path to rumble archive .md file")
    parser.add_argument("--strict", action="store_true", help="Exit 1 if any flags found")
    parser.add_argument("--json", action="store_true", help="Output JSON report instead of formatted text")
    args = parser.parse_args()

    path = Path(args.archive)
    if not path.exists():
        print(f"Error: archive not found: {path}", file=sys.stderr)
        sys.exit(2)

    report = validate_archive(path)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print_report(report)

    if args.strict and report["total_flags"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
