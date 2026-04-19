# 🏛️ Royal Rumble — Architecture

**Author:** Danny Makhoul · **Status:** v0.10.0 · **Last audit:** 2026-04-19

---

## 🎯 What this is

Royal Rumble is the **Investment Committee** layer of Blue Hill Capital. It answers one question in one pass: _"What should we do with ticker X?"_ — from 13 legendary investor perspectives, synthesized by a Judge into a single weighted verdict with conviction level and position sizing.

Unlike a single-model stock tool, Royal Rumble is a **multi-persona ensemble** with blind isolation (each legend writes before seeing others' analyses) and explicit domain ownership (Tom Lee = liquidity, Druckenmiller = timing, Klarman = value, etc.). The Judge applies the weighted scorecard.

---

## 🌳 Tree structure

Per `principle_tree_structure_always`, Royal Rumble is a **parent skill with sub-skills** — a legitimate exception to the flat canonical layout. The `skills/` and `notes/` subdirs are NOT non-canonical bugs; they are structural features that encode the committee model.

```
royal-rumble/
├── SKILL.md                         # Master orchestrator — the front door
├── ARCHITECTURE.md                  # THIS FILE — design doc
├── SCHEMA.md                        # Data contracts (predictions.json, comparisons.json, etc.)
├── README.md                        # Public-facing overview
├── CHANGELOG.md                     # Version log
├── ROADMAP.md                       # Planned iterations
├── SOURCES.md                       # Citations for each legend's framework
├── CLAUDE-GROK-COLLAB-DEBATE.md     # Session artifact — the Grok collaboration
├── royal-rumble-orchestrator.md     # Long-form orchestrator rationale
├── scorecard.html                   # Visual scorecard renderer
│
├── skills/                          # Sub-skills — one framework per legend
│   └── RUMBLE-ENGINE.md             # Consolidated: all 13 legends + Judge in ONE file
│
├── data/                            # Append-only prediction + comparison logs
│   ├── predictions.json             # Single-ticker rumble verdicts
│   ├── comparisons.json             # Head-to-head pair verdicts
│   └── strategy-meetings.json       # Multi-ticker strategy sessions
│
├── notes/                           # Append-only narrative log
│   └── rumble-log.md                # Every rumble's timeline, stances, debate rounds
│
└── scripts/
    └── install.sh                   # Symlink into ~/.claude/skills/royal-rumble/
```

**Why the unusual subdirs exist:**

| 🟣 Dir | 🟣 Purpose | 🟣 Why not canonical |
|---|---|---|
| `skills/` | RUMBLE-ENGINE.md — the 13-legend + Judge playbook | Canonical skill has `scripts/` for executables and `prompts/` for LLM behavior. Royal Rumble's "scripts" are framework markdown for a persona ensemble — `skills/` is semantically truer than `prompts/`. |
| `notes/` | `rumble-log.md` — chronological narrative of every rumble | Canonical `logs/` holds JSONL machine output. `notes/` is the human-readable companion. Keeping them separate avoids JSONL conventions polluting narrative prose. |
| `data/` | JSON data files (predictions, comparisons) | `logs/` implies JSONL append-only. `data/` allows JSON with lookups. Distinct storage semantic. |

---

## 🎮 The 4-stage lifecycle

### Stage 1 — `.rumble TICKER`
1. Fetch live price (price-desk) + fundamentals (fundamentals-desk) + technicals (technicals-desk). **Hard gate:** no committee input without a fresh data pull.
2. Dispatch the ticker to each of the 8 voting legends + 5 advisory legends in **blind isolation** — each writes their pillar analysis without seeing others.
3. Judge aggregates all 13 stances, applies weighted scorecard, produces verdict: direction (LONG / SHORT / PASS) + conviction (LOW / MED / HIGH) + position sizing.
4. Write to `data/predictions.json` (machine) + `notes/rumble-log.md` (narrative).

### Stage 2 — `.challenge [legend] [argument]`
1. User argues back at any legend with new evidence.
2. Legend re-evaluates their stance → MAINTAIN / PARTIAL REVISE / CONCEDE.
3. Judge re-scores if any stance moved.
4. Update both logs.

### Stage 3 — `.compare A B [context]`
Head-to-head: run Stage 1 on both tickers, then the Judge delivers a pair verdict (prefer A / prefer B / no clear winner). Writes to `data/comparisons.json`.

### Stage 4 — `.strategy`
Multi-ticker strategy meeting: portfolio-level allocation across current holdings + watchlist.

---

## 🏛️ The 8 voting pillars + weights

| Pillar | Legend | Weight | What they own |
|---|---|---|---|
| Liquidity / macro regime | Tom Lee | 15% | Fed rate path, M2 flows |
| Disruptive innovation | Cathie Wood | 15% | Growth curves, S-curves |
| **Timing** | **Druckenmiller** | **20%** (highest) | Cycle position, entry point |
| Risk + portfolio construction | Ray Dalio | 15% | Correlation, drawdown |
| Deep value / margin of safety | Seth Klarman | 10% | DCF, downside floor |
| Quant + data edge | Jim Simons | 10% | Statistical anomalies |
| Sentiment / narrative | George Soros | 10% | Reflexivity, crowd psych |
| Options + volatility | The Vol Desk | 5% | Implied vol, skew |

**Druckenmiller holds the highest single weight (20%) because timing is the biggest kill-switch.** If he says the cycle is wrong, no amount of value/quality fixes that. The Judge enforces this: if Drucker is bearish on timing, conviction drops one full level regardless of other stances.

---

## 🛡️ Invariants

| I# | Invariant | Enforcement |
|---|---|---|
| I1 | No trade decision without a live price pull | `price-desk` gate in Stage 1 |
| I2 | Each legend stays in their pillar | Judge rejects cross-pillar commentary |
| I3 | Blind isolation in Stage 1 | Orchestrator sequential call, no shared scratch |
| I4 | Judge's verdict weighted-not-average | 20/15/15/15/10/10/10/5 % breakdown |
| I5 | Every rumble logged (`predictions.json` + `rumble-log.md`) | Double-write on verdict |
| I6 | Append-only logs | Never mutate past verdicts |
| I7 | Challenge is optional, not fire-and-forget | User explicitly invokes Stage 2 |

---

## 🔗 Composable with (cross-skill contracts)

| Skill | Contract |
|---|---|
| `price-desk` | MUST fire before any rumble. Blocking dependency. |
| `fundamentals-desk` | Fires on value / earnings pillars. Skipped for leveraged ETFs. |
| `technicals-desk` | Fires on timing / quant pillars. |
| `journalist` | Consumes verdicts from `data/predictions.json` → writes Howard Marks-style memos |
| `accuracy-tracker` | Consumes verdicts → scores prediction hit-rate over time |
| `chief-of-staff` | Consumes verdicts → P0-P3 attention ranking |

---

## 📊 Half-life projection

Per `principle_future_proof_by_default`:
- **Tree axis:** 0.95 (intentionally-non-canonical layout — docs in ARCHITECTURE.md absorb the audit finding)
- **Plugin axis:** 0.98 (clear capabilities + no-send-style safety gates)
- **Unix axis:** 0.98 (stable `schema_version: 0.9.3` on all JSON outputs)
- **Year-1 survival:** 0.95 × 0.98 × 0.98 = **91.2%**
- **Half-life:** ln(0.5) / ln(0.912) = **~7.5 years**

Lower than `.gmail`'s 13.8 years primarily because the tree axis is penalized by the non-canonical layout. The layout is architecturally justified (documented above), but it's still a future-proofing tax. Alternative: flatten `skills/RUMBLE-ENGINE.md` into `prompts/rumble-engine.md` in a future v0.11.

---

## 📋 Non-goals

See SKILL.md "Non-Goals" section. The short list:

- **NOT** for P0-P3 attention ranking or briefings (use `.chief`)
- **NOT** for risk × reward tiering of arbitrary items (use `.tier`)
- **NOT** for Howard Marks memo writeups of a verdict (use `.journalist`)
- **NOT** for hit-rate scoring of past predictions (use `.accuracy`)
- **NOT** for long-running backtests (separate tooling)
- **NOT** for executing trades (humans only)

---

## 🧬 One-sentence architecture

> **Royal Rumble is a 13-legend ensemble with blind isolation, weighted Judge aggregation, and append-only logs — its non-canonical `skills/` and `notes/` subdirs are architectural features, not bugs, because the committee model doesn't fit the flat canonical layout.**

🏛️🃏
