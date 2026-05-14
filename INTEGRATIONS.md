# royal-rumble — Fleet Integrations

This doc tracks WHICH OTHER SKILLS feed data INTO royal-rumble, and WHICH consume royal-rumble's verdicts. Updated 2026-05-12 after Blue Hill Capital risk-management wave shipped.

## Inputs (skills that feed rumble)

| Skill | What rumble reads | Used by which legend |
|---|---|---|
| `price-desk` | Live price, 52w hi/lo, % from high | All legends (price context) |
| `fundamentals-desk` | Revenue · EPS · margins · cash flow | Klarman · Buffett · Munger |
| `technicals-desk` | RSI · MA crosses · MACD · volume | Druckenmiller · Simons |
| `macro-desk` | Yield curve · VIX · DXY · credit spreads | Tom Lee · Marks · Dalio · Rogers |
| `options-desk` | IV · IV rank · put/call · skew · max pain | Vol Desk (Simons quant pillar) |
| `analyst` | Firm-by-firm upgrades/downgrades + consensus target | Cite-before-rebut pillar |
| `insiders` | Congress PTR + Form 4 insider trades | Smart-money signal |
| `jeremy` | Verbatim Jeremy Lefebvre quotes (historical) | Retail sentiment context |
| `bookkeeper` | Local EDGAR cache (XBRL SEC truth) | Fundamental drill-down |
| `filings-desk` | 10-K · 10-Q · 8-K text | Klarman (margin of safety detail) |
| `earnings-desk` | Earnings call transcripts | Buffett · Munger (management quality) |
| **`position-tracker`** ← NEW 2026-05-12 | Current shares · cost basis · P&L | All legends (sizing context) |
| **`trade-journal`** ← NEW 2026-05-12 | Past trade reasoning + conviction | Druckenmiller (timing pattern) |
| **`tripwire-desk`** ← NEW 2026-05-12 | Hard stops · trim · thesis-kill rules | All legends (locked-rule check) |
| `insights` | Danny's past hypotheses tagged by ticker | All legends (user's evolving thesis) |
| `tax-desk` ← PLACEHOLDER | (future) tax events on the position | Klarman (after-tax margin of safety) |
| `risk-desk` ← PLACEHOLDER | (future) concentration · beta · drawdown | Druckenmiller (sizing) · Marks (cycle) |

## Outputs (skills that consume rumble verdicts)

| Skill | What it does with the verdict |
|---|---|
| `journalist` | Renders verdict as Howard Marks-style memo (PDF/markdown) |
| `accuracy-tracker` | Grades the prediction against actual outcome over time |
| `home` / `.coo` | Surfaces verdict in morning dashboard |
| `trade-journal` | Logs verdict + your trade decision side-by-side |

## Trigger composition (when rumble fires)

`.rumble TICKER` orchestrates this pipeline:

```
1. price-desk      (live anchor — no analysis without it)
2. fundamentals-desk + macro-desk + technicals-desk + options-desk (parallel)
3. analyst + insiders + filings-desk + earnings-desk (parallel context)
4. position-tracker (Danny's current exposure)        ← NEW
5. tripwire-desk   (any rule breaches?)               ← NEW
6. trade-journal   (past trade pattern on this ticker) ← NEW
7. insights        (user's evolving thesis)
8. Legend deliberation (8 voting + 5 advisory)
9. Judge synthesis → conviction + sizing recommendation
10. Append to data/predictions.json
```

## What changed in 2026-05-12 wave

3 new input skills (position-tracker · trade-journal · tripwire-desk) plus 2 placeholders (tax-desk · risk-desk) joined the Blue Hill fleet. The big shift: **the rumble verdict can now reference Danny's actual position state + tripwire rules**, not just market data.

Practical effect: a verdict on NVDA at $217 now reads "Hold (with concentration warning: you're at 36%, past Druckenmiller's line)" rather than just "Hold." The legends gain self-awareness of your portfolio.

## Repo references

| Skill | Repo |
|---|---|
| royal-rumble | https://github.com/DimmMak/royal-rumble |
| position-tracker | https://github.com/DimmMak/position-tracker |
| trade-journal | https://github.com/DimmMak/trade-journal |
| tripwire-desk | https://github.com/DimmMak/tripwire-desk |
| tax-desk (placeholder) | https://github.com/DimmMak/tax-desk |
| risk-desk (placeholder) | https://github.com/DimmMak/risk-desk |
