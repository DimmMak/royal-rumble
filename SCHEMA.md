# 📐 Royal Rumble — Schema

**Schema version:** 0.9.3 · **Author:** Danny Makhoul · **Last updated:** 2026-04-19

Every data artifact carries `schema_version` at the top. Bump on any breaking change to field shape. Readers MUST tolerate older versions per `principle_future_proof_by_default`.

---

## 📁 `data/predictions.json` — single-ticker rumble verdicts

Append-only array of verdict objects, one per `.rumble TICKER` invocation.

```json
{
  "schema_version": "0.9.3",
  "rumbles": [
    {
      "id": "2026-04-19-nvda-001",
      "ticker": "NVDA",
      "timestamp_iso": "2026-04-19T15:30:00-04:00",
      "context": "post-earnings dip",
      "data_sources": {
        "price": { "value": 875.42, "as_of": "2026-04-19T15:00:00Z", "source": "price-desk" },
        "fundamentals_pulled": true,
        "technicals_pulled": true
      },
      "stances": [
        {
          "legend": "tom-lee",
          "pillar": "liquidity-macro",
          "weight": 0.15,
          "stance": "BULL | BEAR | NEUTRAL",
          "conviction": 1 | 2 | 3 | 4 | 5,
          "rationale": "short paragraph",
          "score": -5 to +5
        }
      ],
      "judge": {
        "weighted_score": 2.3,
        "direction": "LONG | SHORT | PASS",
        "conviction": "LOW | MED | HIGH",
        "position_size_pct": 3.5,
        "bull_case": "...",
        "bear_case": "...",
        "key_risk": "..."
      },
      "debate_rounds": [
        {
          "round": 1,
          "legend_challenged": "klarman",
          "user_argument": "...",
          "final_position": "MAINTAINED | PARTIALLY_REVISED | CONCEDED",
          "verdict_delta": null
        }
      ]
    }
  ]
}
```

### Required fields per rumble

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case: `YYYY-MM-DD-ticker-NNN` |
| `ticker` | string | Uppercase symbol |
| `timestamp_iso` | ISO-8601 | Timezone-aware |
| `data_sources` | object | Proves data-gate invariant I1 |
| `stances` | array | All 8 voting pillars present (advisory optional) |
| `judge` | object | Must include direction + conviction + sizing |
| `debate_rounds` | array | Empty array if no Stage 2 challenges |

---

## 📁 `data/comparisons.json` — head-to-head pair verdicts

```json
{
  "schema_version": "0.9.3",
  "comparisons": [
    {
      "id": "2026-04-19-nvda-vs-amd-001",
      "tickers": ["NVDA", "AMD"],
      "timestamp_iso": "2026-04-19T16:00:00-04:00",
      "context": "which datacenter GPU leader",
      "per_ticker_rumbles": ["2026-04-19-nvda-001", "2026-04-19-amd-001"],
      "judge": {
        "preference": "NVDA | AMD | EQUAL",
        "conviction": "LOW | MED | HIGH",
        "rationale": "...",
        "position_size_pct_a": 4.0,
        "position_size_pct_b": 2.0
      }
    }
  ]
}
```

---

## 📁 `data/strategy-meetings.json` — portfolio-level strategy

```json
{
  "schema_version": "0.9.3",
  "meetings": [
    {
      "id": "2026-04-19-weekly-001",
      "timestamp_iso": "2026-04-19T17:00:00-04:00",
      "context": "weekly allocation review",
      "tickers_reviewed": ["NVDA", "AAPL", "MSFT"],
      "allocation_delta": {
        "NVDA": { "from": 0.05, "to": 0.07, "reason": "..." }
      }
    }
  ]
}
```

---

## 📁 `notes/rumble-log.md` — narrative log

Append-only markdown. One `## YYYY-MM-DD — TICKER` section per rumble. Contains:
- Context (human-readable)
- Stances summarized in one line each
- Judge verdict summary
- Debate highlights (if any)

No JSON. No schema. Pure prose for future-Danny to re-read. Write after the JSON write; never edit past entries.

---

## 🛡️ Parser contracts

All readers MUST:
1. Accept `schema_version >= 0.9.0` (backward compatibility to v0.9 release family)
2. Skip entries where `schema_version` is missing (log warning, continue)
3. Treat unrecognized fields as pass-through (forward compatibility)
4. Never mutate past entries — all mutations happen via new append

---

## 📋 Migration plan

| From → To | Breaking changes | Migration |
|---|---|---|
| 0.9.3 → 0.10.0 | Add `pillar_weight_override` field in stances | Additive; old readers skip field |
| 0.9.x → 1.0.0 | Finalize string enums, move advisory legends into `stances[]` | Write `scripts/migrate_09_to_10.py`; re-index logs |

---

## 🧬 One-sentence rule

> **Every JSON output carries `schema_version`; every reader tolerates older; every mutation happens by append, never by edit — so 2076-Danny can read 2026 rumbles without a migration script.**

📐🃏
