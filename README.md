# Royal Rumble Hedge Fund System

13 legendary investors. Each a domain expert. Each arguing from their exact framework. One Judge synthesizes a weighted championship verdict. You can argue back.

---

## The Concept

Standard stock analysis asks one person one question. This system asks 13 of the greatest investors in history one question each — in their specific domain of expertise. Tom Lee never touches valuation. Klarman never touches timing. The Trend Follower never touches fundamentals. Druckenmiller never touches innovation. Each stays in their lane. The Judge weighs them.

**The result:** A verdict that captures liquidity, macro timing, innovation potential, risk construction, deep value, quant signals, sentiment positioning, options structure, credit risk, price trend, activist catalysts, and commodity/currency exposure — simultaneously.

---

## The 13 Legends (8 Voting + 5 Advisory)

**VOTING LEGENDS (base weights — determine the weighted score):**
| Legend | Pillar | Weight | Core Framework |
|---|---|---|---|
| ⚡ **Stan Druckenmiller** | Tactical Macro & Timing | **20%** | 5-point setup checklist, catalyst calendar, rate cycle, entry asymmetry |
| 👑 **Tom Lee** | Liquidity & Macro Regime | 15% | Fed policy, M2, credit spreads, yield curve, RRP flows |
| 🚀 **Cathie Wood** | Disruptive Innovation | 15% | Wright's Law, S-curve positioning, TAM, 5-platform convergence |
| ⚖️ **Ray Dalio** | Risk & Portfolio Construction | 15% | Debt cycle template, risk parity, Kelly sizing, tail risk |
| 🏛️ **Seth Klarman** | Deep Value & Margin of Safety | 10% | 3-source intrinsic value: liquidation -> EPV -> franchise |
| 📐 **Jim Simons** | Quantitative & Data Edge | 10% | Momentum factor, PEAD, analyst revisions, institutional flow, RSI |
| 🌀 **George Soros** | Sentiment & Narrative | 10% | Reflexivity, boom/bust sequence, consensus positioning |
| 🎯 **The Vol Desk** | Options & Volatility | 5% | IV vs RV, term structure, skew, gamma, max pain, put/call ratio |

**ADVISORY LEGENDS (full analysis shown, no vote until accuracy-validated):**
| Legend | Pillar | Core Framework |
|---|---|---|
| 📚 **Howard Marks** | Credit & Risk Cycles | Second-level thinking, credit cycle, pendulum, lending standards |
| 📈 **Trend Follower** | Pure Price Trend | 200-day MA, Fibonacci, ATR stops, multi-timeframe |
| 🏔️ **Warren Buffett** | Owner Earnings & Compounding | Circle of competence, moat durability, owner earnings, ROIC |
| 🔱 **Bill Ackman** | Activist & Catalyst | ROIC, sum-of-parts, identifiable catalyst, management quality |
| 🌍 **Jim Rogers** | Global Macro & Commodities | Commodity supercycles, EM demand, dollar direction, supply/demand |

**Druckenmiller carries the highest weight (20%)** — timing is the #1 reason good ideas lose money. Advisory legends graduate to voting after 20+ rumbles with accuracy data + user approval.

---

## How to Use

```
# Type /royal-rumble to see the main menu:

⚔️  ROYAL RUMBLE — Main Menu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 🎯 Single ticker deep-dive          .rumble TICKER
2. ⚔️  Head-to-head compare             .compare A vs B
3. 📅 Monday morning theme meeting     .strategy THEME TIMEFRAME
4. 🔄 Check-in on a prior rumble       .checkin TICKER       [stub]
5. 📁 Portfolio review (all holdings)  .portfolio            [stub]
6. 👀 Watchlist scan & rank            .watchlist [list]     [stub]
7. 🗡️  Challenge a legend               .challenge LEGEND
8. 📜 Track record + history           .log
9. ❓ Help / legends / framework       .help
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example commands

```bash
# Single ticker, with hypothesis pre-registration
.rumble NVDA

# Quick rumble, skip hypothesis prompt
.rumble TSLA --skip

# Head-to-head (spawns 2 blind committees in parallel)
.compare CRM vs NOW

# Monday morning thematic meeting — produces a portfolio plan
.strategy AI 12mo $7k-IRA
.strategy "recession hedge" 6mo long-only

# Argue back against a single legend
.challenge klarman The FCF yield is actually 4.2% adjusted for SBC
```

### What each command returns

- **`.rumble`** → 13-legend analysis + Judge verdict + YOUR call vs committee
- **`.compare`** → 2 parallel rumbles + head-to-head table + clear winner
- **`.strategy`** → 3-round committee meeting + full portfolio plan with sizing
- **`.challenge`** → 1 legend defends; Judge re-scores if stance changes

---

## Stage 2 — The Challenge Round

After the rumble, you can argue against any legend. They respond in DEFEND mode:

1. **Acknowledge** your strongest point (they're honest)
2. **Counter** using their specific framework (they stay in their lane)
3. **Declare**: STANCE MAINTAINED / PARTIALLY REVISED / CONCEDED

If they revise → Judge recalculates → Verdict may change.

This is the most powerful feature. It forces each legend to expose their reasoning, not just their conclusion. If Klarman can't defend against your FCF argument, the system reveals a genuine weakness in the bear case.

---

## v3 Judge System — What Makes This Different

The Judge doesn't just average stances. Seven optimizations make the scoring system smarter:

### 1. Five-Point Stance Scale
Legends don't just say BULL/BEAR/NEUTRAL. They declare STRONG BULL (+1.0), BULL (+0.5), NEUTRAL (0), BEAR (-0.5), or STRONG BEAR (-1.0). This lets the Judge distinguish between high-conviction calls and framework defaults.

### 2. Conviction Modifier (1-10)
Each legend reports how confident they are. A BULL with 9/10 conviction contributes 3x more than a BULL with 3/10 conviction. Prevents low-information calls from polluting the score.

### 3. ABSTAIN Option
If a legend's framework doesn't apply (e.g., Howard Marks on a net-cash company), they abstain. Their weight gets redistributed to legends who DO have a signal. No more forced noise.

### 4. Dual Timeframe Verdicts
The Judge produces TWO verdicts: SHORT-TERM (0-6 months) using Druck, Tom Lee, Simons, Soros, Trend, Vol Desk — and LONG-TERM (1-5 years) using Cathie, Dalio, Marks, Klarman, Buffett, Ackman, Rogers. A stock can be a short-term SELL and a long-term BUY simultaneously.

### 5. Sector-Adjusted Weights
Weights shift based on stock type. High-growth tech? Cathie gets +3%, Klarman gets -2%. Heavy debt? Marks gets +4%. Founder-controlled? Ackman gets -3%. The system adapts to what matters for THIS stock.

### 6. Conflict Map
The most valuable output. When Cathie says STRONG BULL and Klarman says STRONG BEAR, the Judge doesn't just average them — it identifies WHAT they disagree about and frames the bet: "If robotaxi TAM materializes, Cathie is right. If it doesn't, Klarman is right."

### 7. Flip Conditions
Every legend states what would change their mind. Makes Stage 2 challenges more targeted and gives the feedback loop testable predictions.

### Override Rules (unchanged)
| Rule | Effect |
|---|---|
| Druckenmiller STRONG BEAR | Conviction drops one level |
| Tom Lee + Dalio both BEAR+ | Conviction drops two levels |
| Klarman BULL+ | Conviction upgrades one level |
| Simons BULL + Soros BEAR | Flag: "sentiment exhaustion risk" |
| Marks BEAR + Dalio BEAR | Flag: "credit cycle warning" |
| Trend Follower BEAR+ | Flag: "price trend broken" |
| Ackman BULL + Klarman BULL | Upgrade one level |
| Buffett BULL + Klarman BULL | Upgrade one level |
| Buffett STRONG BEAR | Flag: "20-year lens says no" |

---

## File Structure

```
royal-rumble/
├── README.md
├── CHANGELOG.md
├── SOURCES.md                  ← full citation map: every framework element traced to primary sources
├── CLAUDE-GROK-COLLAB-DEBATE.md ← full Claude x Grok debate: how Buffett became #13
├── SKILL.md                    ← master orchestrator (used by Claude Code .skill)
├── royal-rumble-orchestrator.md ← flow documentation
├── scorecard.html              ← visual scorecard template (dark theme, auto-generated per rumble)
├── notes/
│   └── rumble-log.md           ← history of every rumble
└── skills/
    └── RUMBLE-ENGINE.md        ← consolidated engine: all 13 legends + Judge (incl. Fabrication Guard) in one file — the ONLY source of truth
```

(Individual legend SKILL.md files and judge/SKILL.md were consolidated into RUMBLE-ENGINE.md in v0.3 to eliminate drift. See CHANGELOG.)

---

## What Makes Each Legend Authentic

Each SKILL.md encodes the legend's **actual decision framework** from primary sources — not just their personality. Examples:

- **Klarman**: The three-source intrinsic value hierarchy from *Margin of Safety* (liquidation -> EPV -> franchise). He won't pay for franchise value unless the other two are solid first.
- **Dalio**: The debt cycle template from *Principles* + All Weather's four-environment asset map. He always knows where in the cycle we are.
- **Druckenmiller**: His 5-point timing checklist. His famous line: "I never use valuation to time the market" encoded as a rule.
- **Soros**: The full reflexivity boom/bust sequence (7 stages) from *The Alchemy of Finance*. He maps every stock to a stage in the sequence.
- **Simons**: PEAD (post-earnings announcement drift), analyst revision momentum, factor loadings — the publicly documented signals that RenTech is known to exploit.

**Every framework element is cited.** See [SOURCES.md](SOURCES.md) for the full citation map. For the full Claude x Grok collaboration debate (how Buffett became #13), see [CLAUDE-GROK-COLLAB-DEBATE.md](CLAUDE-GROK-COLLAB-DEBATE.md).

**Why Klarman over Buffett?** This is the most common question. Short answer: Buffett's framework is too broad — he'd overlap with 4 other legends. Klarman is a sharper, non-overlapping signal for pure deep value. Full argument in [CLAUDE-GROK-COLLAB-DEBATE.md](CLAUDE-GROK-COLLAB-DEBATE.md). — each rule, formula, and analytical checklist traced back to the book, paper, or public statement it came from. Primary sources include *Margin of Safety* (Klarman, 1991), *The New Market Wizards* (Schwager, 1992), *Principles for Navigating Big Debt Crises* (Dalio, 2018), *The Alchemy of Finance* (Soros, 1987), *The Man Who Solved the Market* (Zuckerman, 2019), and peer-reviewed academic papers (Jegadeesh & Titman 1993, Bernard & Thomas 1989, Fama & French 1993).

---

## Combining with Stock Analyzer

For maximum depth:
1. Run `python3 scripts/fetch_data.py TICKER` + `technicals.py` + `quant.py` from the stock-analyzer
2. Run `/stock-analyzer` → `.fundamentals` + `.quant` for the hard data
3. Run `/royal-rumble` → `.rumble TICKER` for the legendary investor debate
4. The two systems complement: stock-analyzer = data, royal-rumble = wisdom
