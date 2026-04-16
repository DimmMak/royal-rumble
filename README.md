# Royal Rumble Hedge Fund System

13 legendary investors. Each a domain expert. Each arguing from their exact framework. One Judge synthesizes a weighted championship verdict. You can argue back.

---

## The Concept

Standard stock analysis asks one person one question. This system asks 13 of the greatest investors in history one question each — in their specific domain of expertise. Tom Lee never touches valuation. Klarman never touches timing. The Trend Follower never touches fundamentals. Druckenmiller never touches innovation. Each stays in their lane. The Judge weighs them.

**The result:** A verdict that captures liquidity, macro timing, innovation potential, risk construction, deep value, quant signals, sentiment positioning, options structure, credit risk, price trend, activist catalysts, and commodity/currency exposure — simultaneously.

---

## The 13 Legends

| Legend | Pillar | Weight | Core Framework |
|---|---|---|---|
| 👑 **Tom Lee** | Liquidity & Macro Regime | 15% | Fed policy, M2, credit spreads, yield curve, RRP flows |
| 🚀 **Cathie Wood** | Disruptive Innovation | 15% | Wright's Law, S-curve positioning, TAM, 5-platform convergence |
| ⚡ **Stan Druckenmiller** | Tactical Macro & Timing | **20%** | 5-point setup checklist, catalyst calendar, rate cycle, entry asymmetry |
| ⚖️ **Ray Dalio** | Risk & Portfolio Construction | 15% | Debt cycle template, risk parity, Kelly sizing, tail risk |
| 🏛️ **Seth Klarman** | Deep Value & Margin of Safety | 10% | 3-source intrinsic value: liquidation → EPV → franchise |
| 📐 **Jim Simons** | Quantitative & Data Edge | 10% | Momentum factor, PEAD, analyst revisions, institutional flow |
| 🌀 **George Soros** | Sentiment & Narrative | 10% | Reflexivity, boom/bust sequence, consensus positioning |
| 🎯 **The Vol Desk** | Options & Volatility | 5% | IV vs RV, term structure, skew, gamma exposure |

| 📚 **Howard Marks** | Credit & Risk Cycles | 8% | Second-level thinking, credit cycle, pendulum, lending standards |
| 📈 **Trend Follower** | Pure Price Trend | 7% | 200-day MA, breakout systems, trend strength — no fundamentals |
| 🔱 **Bill Ackman** | Activist & Catalyst | 5% | ROIC, sum-of-parts, identifiable catalyst, management quality |
| 🏔️ **Warren Buffett** | Owner Earnings & Compounding | 5% | Circle of competence, moat durability, owner earnings, ROIC, capital allocation |
| 🌍 **Jim Rogers** | Global Macro & Commodities | 5% | Commodity supercycles, EM demand, dollar direction, supply/demand |

**Druckenmiller carries the highest weight (17%)** — timing is the #1 reason good ideas lose money.

---

## How to Use

```
# 1. Open Claude Code
/royal-rumble

# 2. Start a rumble
.rumble NVDA
.rumble META post-earnings dip, considering calls
.rumble AAPL concerned about China revenue risk

# 3. Get the championship verdict
→ All 8 legends analyze from their pillar
→ Judge scores each 1-10 and issues weighted verdict
→ Conviction level: STRONG BUY / BUY / HOLD / SELL / STRONG SELL
→ Position size: Full / Half / Quarter / Starter / Pass

# 4. Argue back (Stage 2)
.challenge klarman The FCF yield is actually 4.2% adjusted for SBC — that's real margin of safety
.challenge druckenmiller The FOMC meeting is in 3 weeks, that's your catalyst
.challenge soros Institutional positioning shows funds are still underweight here

# 5. Watch the verdict update
→ Legend defends their stance or concedes
→ If stance changes, Judge recalculates weighted score
→ Conviction level may change
```

---

## Stage 2 — The Challenge Round

After the rumble, you can argue against any legend. They respond in DEFEND mode:

1. **Acknowledge** your strongest point (they're honest)
2. **Counter** using their specific framework (they stay in their lane)
3. **Declare**: STANCE MAINTAINED / PARTIALLY REVISED / CONCEDED

If they revise → Judge recalculates → Verdict may change.

This is the most powerful feature. It forces each legend to expose their reasoning, not just their conclusion. If Klarman can't defend against your FCF argument, the system reveals a genuine weakness in the bear case.

---

## Conviction Override Rules

The Judge doesn't just average stances — specific legends have veto power:

| Rule | Effect |
|---|---|
| Druckenmiller BEAR | Conviction drops one level |
| Tom Lee + Dalio both BEAR | Conviction drops two levels |
| Klarman BULL | Conviction upgrades one level (value guy buying = real margin of safety) |
| Simons BULL + Soros BEAR | Flag: "sentiment exhaustion risk — momentum window may be closing" |
| Dalio flags high tail risk | Position size reduced one level |
| Howard Marks + Dalio both BEAR | Flag: "credit cycle warning — balance sheet risk elevated" |
| Trend Follower BEAR | Flag: "price trend broken — regardless of fundamental thesis" |
| Ackman + Klarman both BULL | Conviction upgrades one level (value + catalyst alignment) |

---

## File Structure

```
royal-rumble/
├── README.md
├── CHANGELOG.md
├── SOURCES.md                  ← full citation map: every framework element traced to primary sources
├── DESIGN-DECISIONS.md         ← design rationale + responses to external critiques (Grok review, etc.)
├── SKILL.md                    ← master orchestrator (used by Claude Code .skill)
├── royal-rumble-orchestrator.md ← flow documentation
├── scorecard.html              ← visual scorecard template (dark theme, auto-generated per rumble)
├── notes/
│   └── rumble-log.md           ← history of every rumble
└── skills/
    ├── RUMBLE-ENGINE.md        ← consolidated engine: all 8 legends + Judge in one file (token-optimized)
    ├── tomlee/SKILL.md         ← Tom Lee: Liquidity & Macro Regime (original, kept as backup)
    ├── cathiewood/SKILL.md     ← Cathie Wood: Disruptive Innovation
    ├── druckenmiller/SKILL.md  ← Druckenmiller: Tactical Macro & Timing
    ├── dalio/SKILL.md          ← Ray Dalio: Risk & Portfolio Construction
    ├── klarman/SKILL.md        ← Seth Klarman: Deep Value & Margin of Safety
    ├── simons/SKILL.md         ← Jim Simons: Quantitative & Data Edge
    ├── soros/SKILL.md          ← George Soros: Sentiment & Narrative
    ├── voldesk/SKILL.md        ← The Vol Desk: Options & Volatility
    └── judge/SKILL.md          ← The Judge: Championship Verdict
```

---

## What Makes Each Legend Authentic

Each SKILL.md encodes the legend's **actual decision framework** from primary sources — not just their personality. Examples:

- **Klarman**: The three-source intrinsic value hierarchy from *Margin of Safety* (liquidation -> EPV -> franchise). He won't pay for franchise value unless the other two are solid first.
- **Dalio**: The debt cycle template from *Principles* + All Weather's four-environment asset map. He always knows where in the cycle we are.
- **Druckenmiller**: His 5-point timing checklist. His famous line: "I never use valuation to time the market" encoded as a rule.
- **Soros**: The full reflexivity boom/bust sequence (7 stages) from *The Alchemy of Finance*. He maps every stock to a stage in the sequence.
- **Simons**: PEAD (post-earnings announcement drift), analyst revision momentum, factor loadings — the publicly documented signals that RenTech is known to exploit.

**Every framework element is cited.** See [SOURCES.md](SOURCES.md) for the full citation map. For design rationale and responses to external critiques, see [DESIGN-DECISIONS.md](DESIGN-DECISIONS.md).

**Why Klarman over Buffett?** This is the most common question. Short answer: Buffett's framework is too broad — he'd overlap with 4 other legends. Klarman is a sharper, non-overlapping signal for pure deep value. Full argument in [DESIGN-DECISIONS.md](DESIGN-DECISIONS.md). — each rule, formula, and analytical checklist traced back to the book, paper, or public statement it came from. Primary sources include *Margin of Safety* (Klarman, 1991), *The New Market Wizards* (Schwager, 1992), *Principles for Navigating Big Debt Crises* (Dalio, 2018), *The Alchemy of Finance* (Soros, 1987), *The Man Who Solved the Market* (Zuckerman, 2019), and peer-reviewed academic papers (Jegadeesh & Titman 1993, Bernard & Thomas 1989, Fama & French 1993).

---

## Combining with Stock Analyzer

For maximum depth:
1. Run `python3 scripts/fetch_data.py TICKER` + `technicals.py` + `quant.py` from the stock-analyzer
2. Run `/stock-analyzer` → `.fundamentals` + `.quant` for the hard data
3. Run `/royal-rumble` → `.rumble TICKER` for the legendary investor debate
4. The two systems complement: stock-analyzer = data, royal-rumble = wisdom
