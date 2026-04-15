# Royal Rumble — Master Orchestrator (Reference)

This file documents how the royal-rumble.skill orchestrates all agents.
The actual skill logic lives in the .skill file.

---

## The Full Flow

```
User drops a ticker (+ optional context)
              ↓
   ┌──────────────────────────────────────┐
   │         STAGE 1 — THE RUMBLE        │
   └──────────────────────────────────────┘
              ↓
   .tomlee    → Liquidity & Macro Regime
   .cathiewood → Disruptive Innovation
   .druckenmiller → Tactical Macro & Timing   ← 20% weight
   .dalio     → Risk & Portfolio Construction
   .klarman   → Deep Value & Margin of Safety
   .simons    → Quantitative & Data Edge
   .soros     → Sentiment & Narrative
   .voldesk   → Options & Volatility
              ↓
   .judge     → Weighted verdict (conviction + sizing + ruling)
              ↓
   ┌──────────────────────────────────────┐
   │       STAGE 2 — CHALLENGE ROUND     │
   │  (optional — user triggers)         │
   └──────────────────────────────────────┘
              ↓
   User challenges specific legend:
   "I disagree with [legend] because [argument]"
              ↓
   Legend enters DEFEND MODE:
   - Acknowledges strongest point
   - Invokes their framework
   - Maintains / partially revises / concedes
              ↓
   If stance changed → .judge recalculates weighted score
   Updated verdict issued
```

---

## Pillar Weight Summary

| Legend | Weight | Override Power |
|---|---|---|
| Druckenmiller | 20% | BEAR → drops conviction one level |
| Tom Lee | 15% | BEAR (+ Dalio BEAR) → drops two levels |
| Cathie Wood | 15% | — |
| Ray Dalio | 15% | High tail risk flag → reduce sizing |
| Klarman | 10% | BULL → upgrades conviction one level |
| Simons | 10% | — |
| Soros | 10% | — |
| Vol Desk | 5% | High IV → note hedging cost elevated |

---

## Commands

| Command | What happens |
|---|---|
| `.rumble [TICKER]` | Start Stage 1 — all 8 legends + Judge |
| `.rumble [TICKER] [context]` | Start with additional context |
| `.challenge [legend]` | Trigger Stage 2 for that legend |
| `.verdict` | Re-show the Judge's current ruling |
| `.log` | Show rumble history from notes/rumble-log.md |
| `.help` | Show this command reference |
