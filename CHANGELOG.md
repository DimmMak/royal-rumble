# CHANGELOG — Royal Rumble Hedge Fund System

> **🔬 Pre-alpha notice:** All current versions are `<1.0` — system is in calibration phase. `v1.0.0` will be declared only after 50+ rumbles with measured outcome accuracy (per ROADMAP.md). Historical CHANGELOG entries below pre-date this rebrand; their original `v1.x` / `v3.x` labels are preserved as artifacts of the build timeline but the CURRENT system is `v0.5.0`.

---

## [2026-04-17] — v0.8.0 — Strategy Meeting (Thematic Committee)

**Trigger:** User asked "how do I get investors to debate how to play AI stocks next year and come up with a plan." Manually spawned a subagent with a 3-round meeting prompt. Output was exceptional ("WOW it's beautiful"). Earn-your-features fired — one successful use + clear repeat demand.

### Shipped

**New command: `.strategy [theme] [timeframe] [constraints]`**

Runs a **3-round investment committee meeting** in an isolated subagent:
- Round 1 — 13 independent memos (sealed, blind)
- Round 2 — Debate (3 sharpest disagreements surface)
- Round 3 — Judge synthesis (complete portfolio plan)

Output includes:
- Core / satellite positions with sizing, entry zones, targets, stops
- Hedges + cash reserve
- Quarterly roadmap with check-in triggers
- Invalidation triggers (stop the whole thesis)
- Contrarian anchor (the scenario where plan loses)
- Structured JSON footer for logging

**New log file:** `data/strategy-meetings.json` — every meeting appended.

**Account constraints baked in:** plan sizes every position to fit the account (e.g., $7k IRA = Full ≈ $1,400, max 4-5 positions, long-only).

**Examples:**
```
.strategy AI 12mo $7k-IRA
.strategy "recession hedge" 6mo long-only
.strategy semis 2027 concentrated $10k
```

### Why this matters
Real hedge funds hold thematic committee meetings weekly. Until now, royal-rumble was single-ticker only. `.strategy` is the missing capability — produces PLANS, not verdicts. Reusable. Blind. Auditable.

### First meeting logged
AI 12mo plan for $7k IRA — retroactively logged to data/strategy-meetings.json. Core: MSFT + GOOGL. Satellite: NVDA + AVGO. Hedges: 15% cash minimum. Full plan with Q2-Q1 roadmap and 3 invalidation triggers.

---

## [2026-04-17] — v0.7.2 — Skip-All Flag

**Trigger:** Hypothesis prompt is useful for calibration but intrusive when user just wants a quick rumble. Added explicit bypass.

### Shipped

- `.rumble [TICKER] --skip` (also `--nohype`, `--blind`, trailing `skip`) — bypasses Step 0 entirely, no prompt shown.
- Step 0 prompt now shows tip: "next time add `--skip` to bypass this step."
- Predictions.json logs `"mode": "skipped"` on hypothesis fields for this path.

Three clean modes:
- **Pre-register:** real opinion to measure
- **Answer "skip":** dialog path — still shown the prompt, choose to skip inline
- **`--skip` flag:** fast path — never see the prompt

---

## [2026-04-17] — v0.7.1 — First-Flight Fix

**Trigger:** Pre-flight stress test on v0.7.0 found 4 critical bugs that would break the first real blind rumble. All T1. Fixed before any live run.

### Shipped

**B1 — Date injection**
Child spawns fresh with no session context → didn't know today's date. Fix: parent interpolates `[TODAY_YYYY-MM-DD]` and `[TODAY_YYYY]` into sealed prompt. Child uses these verbatim for searches, freshness tag, rumble header.

**B2 — Agent-tool fallback path**
If Agent tool unavailable or spawn fails, skill used to silently break. Fix: fallback runs single-context with `⚠️ CONTAMINATED MODE` warning banner. Predictions logged with `"mode": "contaminated"` so accuracy tracker can filter them out.

**B3 — Child's tool manifest**
Sealed prompt now explicitly lists tools child should use (WebSearch, Read, Grep, Bash) and forbids Write/Edit. Prevents silent failure if child doesn't know what's available.

**B4 — Structured footer contract**
Child's verdict is verbose prose → parent couldn't reliably parse stances/scores for predictions.json. Fix: child MUST append a `---STRUCTURED-FOOTER-BEGIN---` / `---STRUCTURED-FOOTER-END---` code-fenced JSON block at the end. Parent extracts JSON mechanically, no regex gymnastics.

### Deferred to Tier 2 (watch after first rumble)
- B5: Challenge Stage 2 still single-context (by design — conversational)
- B6: Token-limit risk on large 13-legend output
- B7: Child unauthorized Write/Edit (now forbidden in prompt)
- B8: In-session hypothesis persistence (rare edge case)

### Ready for first real rumble
v0.7.1 is the first version that should be trusted with a live `.rumble TSLA` call. Blind committee architecture + date injection + structured footer + fallback path = no known pre-flight bugs.

---

## [2026-04-17] — v0.7.0 — Blind Committee (Subagent Isolation) 🔒

**Trigger:** User caught the v0.6.0 bias bug: hypothesis captured in the same session context as the legends would contaminate their role-play. No amount of "please ignore this" instructions could solve it — the LLM reads the whole context when playing each legend. Fix requires physical isolation.

### The architectural shift

**BEFORE (v0.6):** One context, Claude plays all 13 roles + Judge in sequence. User's hypothesis lives in the same scrollback → contamination inevitable.

**AFTER (v0.7):** Parent session captures hypothesis → spawns ISOLATED SUBAGENT via the Agent tool → subagent runs the full 13-legend + Judge rumble with ZERO access to parent's context → returns verdict → parent appends comparison.

The subagent has its own fresh context. It literally cannot see the hypothesis. Blindness is physical, not discipline-based.

### Shipped

**Stage 1 completely restructured into 5 parent-session steps:**
1. Hypothesis capture (parent-only, sealed)
2. Spawn blind committee subagent with purpose-built sealed prompt
3. Relay child verdict + append Your Call vs The Judge comparison
4. Log to rumble-log.md + predictions.json
5. Close

**Subagent prompt hardened:**
- No reference to "hypothesis," "user prediction," "expected direction"
- Explicit instruction: "⚠️ YOU HAVE NOT BEEN GIVEN ANY USER HYPOTHESIS"
- Full orchestration embedded (5 searches, 13 legends, Judge steps 0-12, output format)

**Why this unlocks everything:**
- Fixes the bias bug (physically, not rhetorically)
- Gateway to parallel legend execution (v0.8)
- Gateway to compressed verdicts (v0.9)
- Gateway to multi-ticker portfolio rumbles (v0.11)
- Gateway to blind accuracy audits (v0.10)
- Gateway to historical backtesting (v0.13)

### The meta-insight
Subagent isolation isn't a feature, it's the foundation. Every downstream capability in Phases 2-4 of the ROADMAP depends on context-isolated children. This is the single most significant architectural change royal-rumble will ever get.

---

## [2026-04-17] — v0.6.0 — Your Call First (Pre-Registration) ⚠️ DEPRECATED

**⚠️ Architecture replaced in v0.7.0.** The Step 0 hypothesis capture lived in the same session as the legends, causing contamination. Preserved in CHANGELOG as a historical artifact. See v0.7.0 for the fixed architecture.

---

## [2026-04-17] — v0.6.0 (original entry) — Your Call First (Pre-Registration)

**Trigger:** Recognized that system accuracy ≠ user calibration. Royal Rumble was measuring the Judge's track record but not the USER's. After celebrating the pending-rumbles.md pre-registration move, user asked to hardwire this into every rumble.

### Shipped

**Step 0 — Pre-Rumble Hypothesis**
- Before ANY searches or legend analysis, `.rumble [TICKER]` now prompts the user for their locked-in call:
  1. Direction (BULL / BEAR / NEUTRAL / skip)
  2. Conviction (LOW / MED / HIGH / skip)
  3. One-line why
  4. Falsification condition (optional)
- Rumble WAITS for the user's reply before proceeding — forces commitment before external data can anchor the view.
- "skip" is always valid — some rumbles are cold research, not hypothesis tests.

**Your Call vs The Judge — end-of-verdict comparison**
- After the championship ruling, a new block compares the user's pre-registered call to the Judge's verdict.
- Divergence scale: AGREE / MILD / MODERATE / STRONG.
- Surfaces the learning question: *"what do you see that the opposing legend missed?"* — trains the user's edge over time.

**predictions.json schema extended**
- Added `user_hypothesis` object: direction, conviction, why, wrong_if, locked_at timestamp.
- Enables future tracking: user hit-rate vs system hit-rate, user's edge per sector, blind spots.

### Why it matters
- Builds YOUR track record from rumble #1, not just the system's.
- Measures user calibration honestly — no hindsight bias, no "I knew it all along."
- Turns every rumble into a self-improvement rep.

### Deferred
- v0.7: Focus Modes (--technical / --fundamental / --exit / --macro) — next ship
- v0.8+: CIO Router (natural-language query → focus mode routing) — after 10 rumbles

---

## [2026-04-17] — v0.5.0 — Consistency Pass

**Trigger:** 2-round stress test on v0.4.0 surfaced 4 inconsistencies. All T1 (low/no risk, active bugs). Shipped together.

### Shipped (4 T1 items)

**R1.1 — Fixed search count contradiction** 🔴 HIGH
- SKILL.md had "3 SEARCHES MAX" / "EXACTLY 3" / "Run 3 web searches" in 3 places, but 5 searches are defined and Rule #6 says "5 searches max."
- Cite-or-Abstain tags `[SRC: S1]`-`[SRC: S5]` would have broken if legends followed the "3" instruction.
- All references now say 5, with explicit pointer to S1-S5 naming.

**R2.1 — Cleaned README file structure**
- Removed stale references to 8 individual legend folders + `judge/SKILL.md` (deleted in v0.3).
- Now shows only `RUMBLE-ENGINE.md` with pointer to CHANGELOG for history.

**R2.2 — Updated SKILL.md Rule #8**
- Was: "Fabrication Guard is active in Judge STAGE 0" (stale; renamed to PRE-STEP in v0.3).
- Now: "active in Judge PRE-STEP AND Stage 2 Defend" with pointer to pattern library.

**R2.3 — Explicit Guard invocation in Stage 2 Defend pipeline**
- PRE-STEP policy said "runs on EVERY challenge defend response," but the Stage 2 Defend Mode steps (1-4) never invoked it.
- Added Step 5: "RUN FABRICATION GUARD" with explicit scan + output format.
- Closes silent-skip risk — policy now enforced, not just stated.

### Deferred to Tier 2
- R2.4 (resolve `royal-rumble-orchestrator.md` status) — minor drift source, wait for real confusion.

---

## [2026-04-17] — v0.4.0 — Cite or Abstain

**Trigger:** Accuracy stress test on NVDA found Guard catches only ~30% of real fabrication vectors. Core failure modes: analyst price targets, technical levels (200-day MA, Fib), macro prints (M2, credit spreads, RRP), TAM, intrinsic value anchors — all plausibly invented when searches don't surface them. Legends fill gaps instead of abstaining.

### Shipped (3 Tier 1 items)

**AG2 + AFP3 — Expanded Fabrication Guard pattern library**
- Added 8 new flagged patterns: unsourced analyst targets, moving averages, macro prints, TAM figures, intrinsic value anchors, Fibonacci/support/resistance, max-pain/put-call/OI, forward-quarter deliveries.
- Guard catch-rate estimated to lift from ~30% → ~75%.

**AG1 + AFP2 — Cite-or-abstain rule**
- Every specific number in an analysis MUST carry one tag: `[SRC: S_]`, `[REPORTED — Q_ YYYY]`, `[ESTIMATE]`, or `[UNVERIFIED]`.
- If a legend's framework requires a number that can't be tagged, the legend MUST abstain or mark insufficient data — no plausibility-filling.
- Examples of correct vs incorrect claims documented in RUMBLE-ENGINE.md.

**AG4 — Tom Lee data-gap rule**
- Old framework said "ALL 5 mandatory — never skip." When RRP or credit spread data wasn't in searches, this invited fabrication.
- New rule: if 2+ indicators missing → NEUTRAL (or ABSTAIN if 3+) with a "⚠️ Insufficient liquidity data" note.

### Deferred to Tier 2
- AFP1 (per-claim inline source tags everywhere) — heavy formatting burden; revisit after v0.4 proves in practice
- AG5 (extra search budget for Cathie/Klarman) — violates "5 searches max"; wait for pain
- AC1 (unify fabrication pattern lists) — cleanup; do after v0.4 settles

### Deferred to Tier 3
- AG3 (standalone fact-ledger file) — overkill; inline tags solve it

---

## [2026-04-17] — v0.3.0 — Single Engine

**Trigger:** Second stress test (v0.2.0) surfaced a dual-source-of-truth bug: Fabrication Guard lived ONLY in `skills/judge/SKILL.md`, but rule #5 says "Read RUMBLE-ENGINE.md ONCE. Do NOT read individual legend SKILL.md files." Guard was orphaned — may have silently not run.

### Shipped (3 Tier 1 items)

**B3 — Fixed stale legend count in frontmatter**
- Description said "8 legendary investors." Body has said "13 legends" since advisory panel was added.
- Now reads "13 legendary investors (8 voting + 5 advisory)."

**C1 + B1 + B2 — Merged `judge/SKILL.md` into `RUMBLE-ENGINE.md`**
- Fabrication Guard now lives as `PRE-STEP — FABRICATION GUARD` in RUMBLE-ENGINE, immediately before STEP 0 (sector weights). Guaranteed to run on every rumble.
- Deleted `skills/judge/` folder entirely.
- `RUMBLE-ENGINE.md` is now the ONE source of truth for Judge logic — no sidecar files.
- Kills 2 bugs (orphaned Guard + dual source of truth) in one move.

**FP1 — Version-stamped RUMBLE-ENGINE.md**
- Added `version: 0.3.0` + `last-updated` + CHANGELOG pointer as HTML comments at top.
- Parallel to the pattern already on SKILL.md. Now every file that encodes logic carries a traceable version.

### Deferred to Tier 2
- B4 + C2 (single accepted-names roster) — real bug but hasn't fired yet
- FP3 (schema_version on predictions.json) — nothing parses it yet

### Deferred to Tier 3
- C3 (split rules out of SKILL.md) — aesthetic, current structure works
- FP2 (framework_valid_as_of per legend) — speculative; wait for first framework rot

---

## [2026-04-17] — v0.2.0 — Tier 1 Conservative Ship (3 items)

**Trigger:** Stress test surfaced 7 bugs + 4 consolidations + 6 future-proofing gaps. Tier-listed by risk/reward. Shipping the 3 lowest-risk items now; rest deferred.

### Shipped

**Consolidation #1 — Deleted 8 unused legend folders**
- `RUMBLE-ENGINE.md` has been source of truth since v3.3 (rule #5: "Do NOT read individual legend SKILL.md files").
- Deleted: `skills/cathiewood/`, `dalio/`, `druckenmiller/`, `klarman/`, `simons/`, `soros/`, `tomlee/`, `voldesk/`.
- Remaining in `skills/`: `RUMBLE-ENGINE.md` + `judge/SKILL.md`.
- Zero risk — files already unused. Eliminates future drift.

**FP #1 — Version-stamped skill (v0.2.0)**
- Added `version: 0.2.0` field to SKILL.md frontmatter.
- Added Rule #10: "Bump on every material logic change and log to CHANGELOG.md."
- Enables tracing when behavior changed across years of evolution. Nearly free.

**FP #2 — Data-freshness expiration warning**
- Added `⏳ Freshness:` field to rumble header: FRESH (<7d) | STALE (7-30d) | EXPIRED (>30d).
- Added Rule #9: forces re-running searches when snapshot is stale.
- Prevents a 98-day-old rumble from being silently trusted.

### Deferred (not yet earned)
- Bug #1 (Guard in Challenge mode), Bug #3 (honest timestamp labels), Bug #5 (Guard self-test canary) — shipping next pass.
- Consolidations #2-4, FP #3-6 — earn-your-features; no pain yet.

---

## [2026-04-15] — v3.3 — Mechanical Judge Rubric (Grok suggestion #2)

**Trigger:** Grok suggested making the Judge "dumber and stricter" — a fixed mechanical rubric instead of subjective 1-10 scoring. This was her best suggestion. Implemented with modifications.

### What Changed

**Replaced subjective 1-10 score with fixed 100-point rubric:**
- Pillar Discipline (30 pts) — did they stay in their lane?
- Evidence Citation (25 pts) — did they cite specific numbers?
- Logical Consistency (20 pts) — does the reasoning follow?
- Format Compliance (15 pts) — did they fill all required fields?
- Flip Condition Quality (10 pts) — is it specific and testable?
- Max 95, mandatory one-sentence explanation per deduction.

**Removed conviction modifier (1-10) entirely:**
- Old formula: `stance x weight x (conviction/10)` — hidden weight suppression
- New formula: `stance x weight` — clean, no dampening
- The 5-point stance scale (STRONG BULL to STRONG BEAR) already captures conviction through stance intensity. Having both was double-counting.
- Conviction field removed from all 13 legend output templates.

**Key principle:** The rubric scores DISCIPLINE, not agreement. Klarman saying BEAR on a growth stock with perfect framework execution gets 90+. The Judge's opinion about whether BEAR is correct is irrelevant to the rubric score.

**Credit:** Grok proposed the mechanical rubric concept. We modified the criteria (replaced "Original Insight" with "Flip Condition Quality", adjusted evidence definition) and removed the conviction modifier as a consequence of making the rubric work cleanly.

---

## [2026-04-15] — v3.2 — Weight Restoration & Anti-Drift Guardrails

**Trigger:** Realized that between v1.0 and v3.1, we had introduced compounding bias through three layers of untested weight changes — while simultaneously warning about the exact same failure mode in a hypothetical Implementer agent. We became the Implementer.

### The Problem We Caught

In one session, with zero rumble outcome data:
- Dalio lost 40% of his voice (15% -> 9%) to make room for new legends
- Klarman lost 30% (10% -> 7%)
- Sector adjustments could further suppress bearish voices by 2-3% per stock
- Conviction modifier could dampen low-confidence calls toward zero
- These three layers stacked: a voting legend could go from 10% effective weight to ~2%

All biases pushed in the same direction — suppressing bearish voices on growth stocks. The exact stocks users will rumble most often.

### What Changed

**v1.0 weights restored for all 8 original voting legends:**
| Legend | v3.1 (diluted) | v3.2 (restored) |
|---|---|---|
| Druckenmiller | 17% | **20%** |
| Tom Lee | 11% | **15%** |
| Cathie Wood | 12% | **15%** |
| Dalio | 9% | **15%** |
| Klarman | 7% | **10%** |
| Simons | 6% | **10%** |
| Soros | 6% | **10%** |
| Vol Desk | 4% | **5%** |

**5 new legends reclassified as ADVISORY:**
- Howard Marks, Trend Follower, Buffett, Ackman, Rogers
- Still present their full analysis in every rumble
- Still shown in the scorecard
- Do NOT vote in the weighted score
- Graduate to VOTING only after 20+ rumbles with accuracy data + user approval

**Sector adjustments marked as SESSION-LEVEL HYPOTHESES:**
- Still applied per rumble for context
- Marked as unvalidated — will be proven or removed after accuracy tracking
- Adjustment magnitudes reduced (e.g., Cathie +3% -> +2%)

**New guardrails:**
- Minimum weight floor: no voting legend can drop below 50% of base weight
- Contrarian anchor: Judge MUST present the strongest bear case at full weight regardless of bull consensus
- Advisory dissent flag: if 3+ advisory legends disagree with the combined verdict, it's flagged as a warning

**Conviction mapping ranges restored to v1.0** (+/- 0.6/0.2 thresholds, not the tightened v3.0 ranges that were never tested)

### The Lesson

Every change we made between v2.0 and v3.1 was individually reasonable. Sector adjustments made logical sense. Conviction modifiers made logical sense. Weight rebalancing made logical sense. But stacked together with zero validation data, they compounded into systematic suppression of bearish voices — the exact failure mode we designed the system to prevent.

The PERMANENT DNA of each legend's framework was never touched. The weights — which determine how much each voice matters — were changed four times in one session based on vibes, not data. That's the lesson: frameworks are permanent, weights are earned.

---

## [2026-04-15] — v3.1 — Technical Analysis Tightened

**Trigger:** TA audit found that no legend produced specific price levels. The system told you WHAT to do but not WHERE.

### Changes
- Druckenmiller: support/resistance with $ prices, volume ratio, relative perf quantified, asymmetry anchored to levels
- Simons: RSI, VWAP, OBV, cross-asset momentum check added
- Trend Follower: multi-timeframe, sector confirmation, Fibonacci levels with $ prices, ATR stops
- Vol Desk: put/call ratio, max pain, OI concentration, strike selection logic
- Judge: KEY LEVELS table synthesizing price levels from all TA legends into entry zones + stops

---

## [2026-04-15] — v3.0 — 7 Judge Optimizations (TSLA Stress Test)

**Trigger:** Stress-tested the system against TSLA ($349, P/E 317x). Found 7 architectural weaknesses where legends produced noise instead of signal. All 7 fixed.

### 1. Five-Point Stance Scale
- **Old:** BULL / BEAR / NEUTRAL (3 states)
- **New:** STRONG BULL (+1.0) / BULL (+0.5) / NEUTRAL (0) / BEAR (-0.5) / STRONG BEAR (-1.0)
- **Why:** Cathie always said BULL on growth stocks, Klarman always said BEAR. They canceled each other out every time. The 5-point scale distinguishes high-conviction calls from framework defaults.

### 2. ABSTAIN Option
- Legends can abstain when their framework doesn't apply (e.g., Marks on net-cash, Ackman on founder-controlled).
- Abstained weight redistributed proportionally to remaining legends.
- **Why:** Forcing a stance from an irrelevant framework produces noise.

### 3. Dual Timeframe Verdicts
- Judge produces THREE scores: Combined, Short-Term (0-6mo), Long-Term (1-5yr).
- SHORT: Druck, Tom Lee, Simons, Soros, Trend, Vol Desk.
- LONG: Cathie, Dalio, Marks, Klarman, Buffett, Ackman, Rogers.
- **Why:** A stock can be a short-term SELL and long-term BUY simultaneously. One number hid this.

### 4. Conflict Map
- Judge identifies the 2-3 most important disagreements and frames each as a bet.
- Format: "If X happens, Legend A is right. If Y happens, Legend B is right."
- **Why:** The disagreement pattern is the most valuable analytical signal in an IC. The old system averaged disagreements away instead of surfacing them.

### 5. Flip Conditions
- Every legend states what would change their stance.
- Added to all 13 output templates.
- **Why:** Makes Stage 2 challenges targeted. Gives future feedback loop testable predictions.

### 6. Conviction Modifier (1-10)
- Score formula: `stance_value x weight x (conviction/10)`
- High-conviction calls contribute up to 3x more than low-confidence framework defaults.
- **Why:** Tom Lee BULL with 9/10 conviction is not the same signal as Rogers BULL with 3/10 conviction.

### 7. Sector-Adjusted Weights
- Base weights shift based on stock characteristics before scoring.
- High-growth tech: Cathie +3%, Klarman -2%. Heavy debt: Marks +4%. Founder-controlled: Ackman -3%. Etc.
- All adjustments renormalized to 100%.
- **Why:** Static weights treated Tesla the same as a utility company. Now the system adapts.

### Technical Changes
- Judge scoring expanded from Steps 1-8 to Steps 0-11
- Conviction mapping ranges tightened (+/-0.4 for STRONG, +/-0.15 for BUY/SELL) to account for conviction dampening
- Orchestrator scorecard updated with Conviction and Flip columns
- README updated with full v3 system description

---

## [2026-04-15] — v2.1 — Buffett #13, Claude x Grok Collab Debate

**Trigger:** Grok AI reviewed the system. Two-round debate produced the 13th legend.

### Warren Buffett — Legend #13
- **Pillar:** Owner Earnings & Long-Term Compounding (5%)
- **Framework:** Circle of competence, durable moat, owner earnings, ROIC, capital allocation, 20-year holding lens
- **Distinct from Klarman:** Klarman = "am I overpaying?" (defensive). Buffett = "will this compound for 20 years?" (offensive).
- **Citations added:** Berkshire Hathaway annual letters (1965-present), Hagstrom, Cunningham

### New Override Rules
- Buffett BULL + Klarman BULL = upgrade one conviction level
- Buffett STRONG BEAR = flag "20-year lens says no"

### The Grok Debate (documented in CLAUDE-GROK-COLLAB-DEBATE.md)
- **Round 1:** Grok scored system 8.5/10 but got 3/4 critiques factually wrong (misread roster, hallucinated Peter Lynch). Claude scored Grok's critique 4/10.
- **Round 2:** Grok self-corrected to 2.5/10. Proposed Buffett as 13th legend with distinct pillar. Adopted in full.
- **Credit:** Grok identified the Buffett gap. Claude built the solution. User orchestrated both AIs.

---

## [2026-04-15] — v2.0 — 12 Pillars, Token Optimization, Citation Map, Scorecard

**Trigger:** First NVDA rumble audited. 5 errors found and fixed. System expanded.

### Expanded from 8 to 12 Legends
| New Legend | Pillar | Primary Source |
|---|---|---|
| Howard Marks | Credit & Risk Cycles | *The Most Important Thing* (2011) |
| Trend Follower (Richard Dennis / AQR) | Pure Price Trend | *Way of the Turtle* (Faith, 2007) |
| Bill Ackman | Activist & Catalyst | Pershing Square letters |
| Jim Rogers | Global Macro & Commodities | *Hot Commodities* (2004) |

### Token Optimization (~45% reduction)
- 9 separate SKILL.md files consolidated into single `RUMBLE-ENGINE.md` (one read vs nine)
- Web searches reduced from 5-6 to 3-4 parallel batches
- Each legend's framework slimmed from ~80-100 lines to ~30-40 lines

### New Output Format — PowerPoint-Style Bullets
- All legends changed from paragraph format to structured bullet-point sections
- Bold keywords, scannable headers, data-driven fields
- Druckenmiller has ✅/❌ checklist, Klarman has $/share math, etc.

### Rumble Scorecard
- Summary table output after all legends, before Judge verdict
- `scorecard.html` — dark-theme visual template (minimalist hedge fund aesthetic)

### Audit Fixes from NVDA Rumble Review
| Issue | Fix |
|---|---|
| Vol Desk said BULL when it should be NEUTRAL | NEUTRAL default enforced — cheap IV does not equal BULL |
| Simons missed mean reversion signal on 10-day streak | Mandatory mean reversion check for 5+/7+/10+ day streaks |
| Tom Lee skipped RRP indicator | All 5 indicators mandatory with "DO NOT SKIP" flag |
| Judge double-reduced position sizing | "AT MOST one net adjustment" rule with sizing ladder documented |
| Judge scored position as Starter instead of Quarter | Sizing example added: "BUY -> Half -> [modifier] -> Quarter" |

### SOURCES.md — Full Citation Map
- Every framework element traced to primary source
- 12 legends, 15+ academic papers, 10+ books cited
- Verification instructions included

---

## [2026-04-15] — v1.0 — Initial Build

### The System
- 8 legendary investors with authentic decision frameworks from primary sources
- Weighted scoring with conviction override rules
- Stage 2 challenge mechanism for adversarial debate
- Judge produces championship verdict with position sizing

### The 8 Original Legends
1. Tom Lee — Liquidity & Macro Regime (15%)
2. Cathie Wood — Disruptive Innovation & Growth (15%)
3. Stanley Druckenmiller — Tactical Macro & Timing (20%)
4. Ray Dalio — Risk & Portfolio Construction (15%)
5. Seth Klarman — Deep Value & Margin of Safety (10%)
6. Jim Simons — Quantitative & Data Edge (10%)
7. George Soros — Sentiment & Narrative (10%)
8. The Vol Desk — Options & Volatility (5%)

### Architecture Decisions
1. **Domain isolation** — each legend stays in their lane. Tom Lee never touches valuation. Klarman never touches timing.
2. **Primary source encoding** — frameworks from actual books, papers, and public statements (not personality prompts)
3. **Druckenmiller at highest weight** — timing is the #1 reason good ideas lose money
4. **Stage 2 DEFEND mode** — legends can be challenged, must acknowledge/counter/declare
5. **Judge re-scoring** — PARTIALLY REVISED moves stance halfway, CONCEDED flips fully

### First Rumble: NVDA (April 15, 2026, $195.88)
- Verdict: BUY (weighted score +0.35)
- Bulls: Tom Lee, Cathie Wood, Simons, Vol Desk
- Bears: Klarman
- Neutrals: Druckenmiller, Dalio, Soros
- Key insight: Druckenmiller loved the setup (4/5 green) but hated the entry — asymmetry was 1:2 after a 19% vertical rip

---

## Version Summary

| Version | Legends | Voting | Key Addition |
|---|---|---|---|
| v1.0 | 8 | 8 | Original system — weights set by reasoning about pillar importance |
| v2.0 | 12 | 12 | +4 legends, token optimization, citation map, scorecard, audit fixes |
| v2.1 | 13 | 13 | +Buffett (from Grok collab), debate documented |
| v3.0 | 13 | 13 | 7 Judge optimizations: 5-point scale, ABSTAIN, dual verdicts, conflict map, flip conditions, conviction modifier, sector weights |
| v3.1 | 13 | 13 | TA tightened: specific price levels, RSI, Fibonacci, ATR stops, Key Levels table |
| v3.2 | 13 | 8 | Weight restoration: v1.0 weights for original 8, new 5 become advisory. Anti-drift guardrails. |
| **v3.3** | **13** | **8** | **Mechanical Judge rubric (/100), conviction modifier removed, formula simplified to stance x weight. The Judge is now a robot with a clipboard.** |
