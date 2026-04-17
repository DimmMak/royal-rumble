# 🗺️ Royal Rumble — ROADMAP to Full-Fledged Hedge Fund

> How to keep honing this into a real financial research tool.
> Tiered by **"actually helps me research stocks better right now"** — not "what a real HF does."
>
> **Rule:** nothing moves up a tier until EARNED by real use.
> **Rule:** every shipped item gets a CHANGELOG entry + version bump.
> **Rule:** every stress test → tier-list → T1-only ship (current discipline).

---

## 📊 Current state (as of 2026-04-17, v0.5.0)

- 13 legends (8 voting + 5 advisory) + Judge with Fabrication Guard
- Cite-or-Abstain rule enforced in PRE-STEP + Stage 2
- 5-search data budget, Guard ~75% estimated catch-rate
- Versioning discipline: 5 clean versions shipped in one day
- **What's MISSING:** real outcome data. No rumble has been measured against actual price movement yet.

System is correct in structure. Next frontier: **calibration**.

---

## 🥇 TIER 1 — Build / Do in the next 2-4 weeks (calibration phase)

### T1.1 — Do 10 real rumbles on stocks I'm actually watching
**What:** Run `.rumble TICKER` on 10 different stocks over the next 2-4 weeks.
**Why earned:** Zero outcome data. Can't validate anything without it.
**Trigger:** already earned. Start this week.
**Cost:** ~20 min per rumble. 10 = ~3 hours of real analysis time.
**Output:** populates `data/predictions.json` for the accuracy tracker.

### T1.2 — Accuracy tracker script
**What:** Script that reads `data/predictions.json`, fetches current price for each predicted ticker, computes: directional accuracy (did BULL call go up?), size accuracy (did STRONG BUY outperform BUY?), time-weighted: 7d / 30d / 60d / 90d.
**Why earned:** T1.1 generates the data. Without a tracker, data rots.
**Trigger:** after 5+ rumbles logged.
**Cost:** ~40 lines of Python, one function per check window.

### T1.3 — Flip Guard from WARN → BLOCK (after ~10 rumbles)
**What:** PRE-STEP Guard currently warns but publishes. Once 10 calibrated rumbles show the pattern library catches what it should and doesn't over-flag, flip to BLOCK mode for CRITICAL fabrications.
**Why earned:** Guard exists but has never been proven in production.
**Trigger:** 10 rumbles with Guard flags reviewed.
**Cost:** ~5 lines in RUMBLE-ENGINE.md PRE-STEP.

### T1.4 — Weekly retro
**What:** Every Sunday, review the week's rumbles. Which calls were right? Which legends drove the right calls? What fabrications slipped past the Guard?
**Why earned:** Improvement requires reflection. Without a retro, data accumulates without insight.
**Trigger:** already earned. First retro after week 1.
**Cost:** 15 min per week. Log to `notes/weekly-retro.md`.

---

## 🥈 TIER 2 — Build when outcome data warrants (~6-10 weeks out)

### T2.1 — Graduate or kill advisory legends
**What:** After 20+ rumbles with outcome data, check each of the 5 advisory legends (Marks, Trend, Buffett, Ackman, Rogers). Does their signal predict something the 8 voting legends miss? If yes → graduate to voting. If no → retire them.
**Why:** Current advisory system is a hypothesis. Data will prove or kill each one.
**Trigger:** 20+ rumbles logged + accuracy data per legend.
**Cost:** ~1 hr analysis + weight rebalance in RUMBLE-ENGINE.md.

### T2.2 — Sector-specific weight validation
**What:** STEP 0 (sector-adjusted weights) is currently labeled "HYPOTHESES, not proven." Validate per-sector weights against accuracy data (did tech rumbles score better with Cathie over-weighted? Did financials score better with Marks over-weighted?). Keep what works, kill what doesn't.
**Trigger:** 20+ rumbles across 3+ sectors.
**Cost:** ~2 hrs analysis. Update STEP 0.

### T2.3 — Watchlist + weekly auto-rumble
**What:** A text file `data/watchlist.md` with 10-20 tickers I actually care about. A weekly cron (or manual trigger) re-rumbles each one, compares to prior verdict, flags any stance changes.
**Why:** Tracks my real universe without manual work.
**Trigger:** 10+ tickers I'm actively following.
**Cost:** ~50 lines. One script, one cron.

### T2.4 — Head-to-head: `.rumble TICKER_A vs TICKER_B`
**What:** Run both rumbles, then synthesize a 14th "Capital Allocator" legend who decides which to own at the margin.
**Why:** Real portfolio decisions are relative, not absolute.
**Trigger:** After 20 solo rumbles prove the base system works.
**Cost:** ~new SKILL section + orchestration changes.

### T2.5 — Portfolio view
**What:** Aggregate current open rumbles into a virtual portfolio (position sizing × conviction). Track P&L of "what I would have done if I traded every STRONG BUY at Full size."
**Why:** Connects individual research to portfolio outcomes.
**Trigger:** 15+ active STRONG BUY / STRONG SELL positions tracked.
**Cost:** ~60 lines Python + a scorecard HTML update.

---

## 🥉 TIER 3 — Hedge-fund-grade (3-6 months, earn each one)

### T3.1 — Backtesting
**What:** Replay rumble logic on historical price + macro data. "What would v0.5 have said about NVDA in Jan 2023?"
**Why:** Validates that the framework works across regimes (bull markets, bear markets, rate cycles).
**Trigger:** Accuracy tracker shows genuine signal (not random). ~3 months of live data.
**Cost:** LARGE. Requires historical data pipeline. Don't build before earning.

### T3.2 — Kelly-based position sizing from measured accuracy
**What:** Replace the hardcoded "STRONG BUY = Full Position" table with a dynamic Kelly formula using measured win rate and payoff. If the system's STRONG BUY calls win 65% of the time with 2:1 average payoff, size accordingly.
**Trigger:** 50+ rumbles with outcome data.
**Cost:** ~30 lines + rewrite Step 8 in RUMBLE-ENGINE.md.

### T3.3 — Scenario testing
**What:** `.rumble NVDA scenario: Fed cuts 50bps` — re-runs the rumble with a conditional macro assumption. Shows how conviction shifts.
**Why:** Real PMs stress-test positions against macro scenarios.
**Trigger:** After T3.1 backtesting exists to validate scenario logic.
**Cost:** LARGE. Extension to orchestrator.

### T3.4 — Auto-challenge bot
**What:** After a rumble, an automated adversary runs `.challenge` on the 2 highest-conviction legends with a pre-trained skeptic prompt. Tests whether stances hold under adversarial scrutiny.
**Trigger:** After base system has 50+ rumbles and accuracy data.
**Cost:** ~new skill. Moderate.

### T3.5 — Cross-asset extension
**What:** Extend beyond stocks. Bonds (duration, credit), commodities (gold, oil), crypto (BTC/ETH), FX.
**Trigger:** Stock system has 50+ rumbles and proven > random accuracy.
**Cost:** LARGE. Whole new legend framework tuning per asset class.

---

## 💀 TIER 4 — Overkill / never build for solo use

```
Real-time broker API / auto-execution
Multi-user SaaS dashboard
Real-money auto-trading
News-sentiment scraper (adds noise, not signal)
Options P&L live tracker
AI-generated additional legends beyond 13
High-frequency tick data
Real-time alert system (email/SMS/Slack)
Custom ML models trained on rumble outcomes (premature)
```

**Why never:** These solve problems a solo researcher doesn't have. If Royal Rumble ever became a team tool or a product, revisit. Until then, they are infrastructure tax with no payoff.

---

## 🔁 Promotion rules

- **T4 → T3:** pain hit at solo scale (extremely unlikely by design)
- **T3 → T2:** prerequisite data materialized (e.g., 50+ rumbles logged)
- **T2 → T1:** outcome data confirms real value of the item
- **T1 → SHIPPED:** stress-tested → tier-listed → T1-only shipped → CHANGELOG'd

**Items move BACKWARD (demoted) when:**
- Built too early, problem never materialized
- A simpler path emerged
- Usage reveals it's actually T4 overkill

---

## 📜 ROADMAP CHANGELOG

### 2026-04-17 — Initial roadmap (post-v0.5.0)
- 4-tier structure established
- T1: calibration phase (4 items) — next 2-4 weeks
- T2: 5 items gated by outcome data
- T3: 5 items gated by measurable signal
- T4: explicitly killed list
- System correct in structure; next frontier is calibration, not feature-building.

---

## 🧬 Principles this roadmap follows

1. **Earn your features** — no item ships until pain is real
2. **Measure before building** — outcome data gates most upgrades
3. **Risk × Reward matrix on every item** — matches the pinned principle
4. **Tier-list + T1-only ship** — the discipline that got us to v0.5
5. **Future-proof by default** — every item must survive 12 months of drift
6. **Stress test every 2-3 rumbles** — not every change; avoid paralysis
7. **Retire what doesn't earn** — advisory legends graduate or die based on data
8. **Speed × discipline > exhaustive analysis** — a real PM can't spend 2 hrs per name

---

## 🎯 The only thing that matters in the next 30 days

**Do 10 real rumbles on stocks I'm watching.** Everything else is premature without that data.

⚔️🃏
