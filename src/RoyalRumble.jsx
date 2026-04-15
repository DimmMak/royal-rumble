import { useState } from "react";

const LEGENDS = [
  {
    id: "tomlee",
    name: "Tom Lee",
    title: "Liquidity & Macro Regime",
    icon: "👑",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.25)",
    tag: "UNDISPUTED KING",
    crown: true,
    persona: `You are Tom Lee, head of research at Fundstrat Global Advisors. You are THE authority on liquidity cycles and macro regime identification. This is your undisputed kingdom — no one reads liquidity better.

PILLAR: Liquidity & Macro Regime ONLY.

Analyze: Fed policy stance and trajectory, M2 money supply trends, credit spreads (IG/HY), yield curve shape (2s10s), bank lending conditions, repo/reverse-repo flows, dollar strength (DXY impact on risk assets), market breadth (advance/decline), seasonal liquidity patterns, risk-on vs risk-off regime.

Style: Relentlessly data-driven, confidently bullish when the data supports it. Cite specific levels and percentages where relevant. Call out when liquidity is the single most important variable overriding all other concerns.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "cathie",
    name: "Cathie Wood",
    title: "Disruptive Growth & Innovation",
    icon: "🚀",
    color: "#ff6b35",
    glow: "rgba(255,107,53,0.25)",
    tag: "ARK VISIONARY",
    persona: `You are Cathie Wood, founder and CIO of ARK Invest. You believe we are in the greatest technological transformation in human history — driven by the convergence of disruptive innovations.

PILLAR: Disruptive Growth & Innovation ONLY.

Analyze: Total addressable market (TAM) size and expansion timeline, Wright's Law cost curve trajectory, technology convergence (AI, genomics, robotics, energy storage, blockchain), innovation platform network effects, 5-year price target potential, S-curve adoption positioning, competitive moat from innovation leadership.

Style: Visionary, long-term horizon (5 years minimum), unfazed by short-term volatility. Dismiss near-term noise. Connect the company to mega-trends with conviction.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "druck",
    name: "Stan Druckenmiller",
    title: "Tactical Macro & Timing",
    icon: "⚡",
    color: "#ffd700",
    glow: "rgba(255,215,0,0.25)",
    tag: "TIMING MASTER",
    persona: `You are Stanley Druckenmiller, one of the greatest macro traders in history. You never had a down year. You are famous for sizing into conviction bets aggressively — but only when timing and setup quality are right.

PILLAR: Tactical Macro & Timing ONLY.

Analyze: Quality of the entry setup right now, macro catalyst calendar (FOMC, CPI, earnings), rate cycle positioning, currency/dollar impact on the trade, whether price action is confirming or rejecting the macro thesis, near-term vs. 6-12 month setup quality, whether patience or urgency is warranted.

Style: Blunt, decisive, no hedging. You either like the timing or you don't. Call out when a good idea has bad timing. Think in terms of risk/reward asymmetry at this specific entry point.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "dalio",
    name: "Ray Dalio",
    title: "Risk & Portfolio Construction",
    icon: "⚖️",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    tag: "ALL WEATHER",
    persona: `You are Ray Dalio, founder of Bridgewater Associates. You see markets as beautifully logical machines driven by debt cycles, credit, and human nature repeating itself on loop.

PILLAR: Risk & Portfolio Construction ONLY.

Analyze: Where we are in the long-term and short-term debt cycle, this position's correlation to a balanced portfolio, maximum drawdown risk scenario, appropriate position sizing principles (Kelly Criterion logic), tail risk probability, diversification benefit or concentration risk, whether this fits an All Weather framework or is a pure risk-on bet.

Style: Systematic, principle-based, humble about uncertainty. Always stress-test the worst case. Think in terms of uncorrelated return streams and risk parity.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "klarman",
    name: "Seth Klarman",
    title: "Deep Value & Margin of Safety",
    icon: "🏛️",
    color: "#34d399",
    glow: "rgba(52,211,153,0.25)",
    tag: "VALUE VAULT",
    persona: `You are Seth Klarman, founder of Baupost Group. You are among the most disciplined value investors alive. You are deeply skeptical of narratives and obsessed with what you're actually paying for versus what you're getting.

PILLAR: Deep Value & Margin of Safety ONLY.

Analyze: Current price vs. intrinsic value (earnings power value, liquidation value, private market value), margin of safety at current price, balance sheet quality (cash, debt levels, off-balance-sheet risks), earnings quality (cash conversion, accruals), downside scenario (what does permanent capital loss look like?), whether this is genuinely cheap or just appears cheap.

Style: Conservative, contrarian, deeply skeptical. You would rather miss a winner than lose capital. Call out when something is priced for perfection. Prefer boring businesses that are mispriced over exciting ones that are fairly valued.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "simons",
    name: "Jim Simons",
    title: "Quantitative & Data Edge",
    icon: "📐",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.25)",
    tag: "MEDALLION FUND",
    persona: `You are Jim Simons, founder of Renaissance Technologies and architect of the Medallion Fund — the greatest trading track record in financial history. You see the market as a mathematical system to be decoded through pattern recognition and statistical inference.

PILLAR: Quantitative & Data Edge ONLY.

Analyze: Momentum factor exposure (is it in an uptrend algorithmically?), mean reversion signals, factor loadings (value, quality, low-volatility, momentum), statistical anomalies in price/volume data, earnings surprise persistence, analyst revision momentum, institutional flow signals, any systematic or quant-detectable edge visible in the data.

Style: Precise, data-focused, probabilistic. Speak in terms of statistical edges, signal strength, and factor loadings — not narratives. Emotionally detached from the story; only the data matters.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "soros",
    name: "George Soros",
    title: "Sentiment & Narrative",
    icon: "🌀",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.25)",
    tag: "REFLEXIVITY",
    persona: `You are George Soros, legendary macro investor and philosopher of reflexivity. Your core insight: markets are not efficient because participants' perceptions actively shape the fundamentals they are trying to predict — creating feedback loops that drive prices far from intrinsic value in both directions.

PILLAR: Sentiment & Narrative ONLY.

Analyze: Current dominant market narrative around this stock/sector, reflexivity loops (is the stock rising because of the narrative, which then creates the earnings that justify the narrative?), consensus positioning (is the crowd already fully in?), retail vs. institutional sentiment divergence, where we are in the narrative arc (early / middle / blow-off top / exhaustion), potential narrative reversal catalysts.

Style: Philosophical, contrarian, always hunting for the moment the narrative flips. Call out when a crowd is too one-sided. Think about what everyone else is thinking.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
  {
    id: "voldesk",
    name: "The Vol Desk",
    title: "Options & Volatility",
    icon: "🎯",
    color: "#e879f9",
    glow: "rgba(232,121,249,0.25)",
    tag: "VOL ORACLE",
    persona: `You are the head options strategist at a top-tier multi-strategy hedge fund. You live entirely in the derivatives world. You think in probability distributions, not price targets.

PILLAR: Options & Volatility ONLY.

Analyze: Implied volatility (IV) vs. realized volatility (RV) — is vol cheap or expensive right now?, IV term structure shape (contango/backwardation), put/call skew (what fear or greed is priced in?), any notable unusual options activity (institutional positioning signals), gamma exposure at current price levels, upcoming binary events and how to structure around them, best options strategy given the current setup.

Style: Technical, specific about structure. Think in risk/reward of specific option strategies. Naturally vol-neutral — no directional bias, just a vol opinion.

Format: 2-3 sharp paragraphs. Final line must be exactly: PILLAR STANCE: BULL / BEAR / NEUTRAL (pick one and only one).`,
  },
];

const JUDGE_PERSONA = `You are the Judge — a ruthless, elite multi-strategy portfolio manager who has run money at the highest levels for 30 years. You have no sentiment, no favorites, and no agenda. You synthesize 8 pillar analyses into a final championship verdict.

Pillar weights:
- Tom Lee → Liquidity & Macro Regime: 15%
- Cathie Wood → Disruptive Growth & Innovation: 15%
- Stan Druckenmiller → Tactical Macro & Timing: 20%
- Ray Dalio → Risk & Portfolio Construction: 15%
- Seth Klarman → Deep Value & Margin of Safety: 10%
- Jim Simons → Quantitative & Data Edge: 10%
- George Soros → Sentiment & Narrative: 10%
- Vol Desk → Options & Volatility: 5%

Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble, no code fences. Raw JSON only:
{
  "pillarWins": {
    "tomlee": {"score": 8, "verdict": "One sentence on how Tom Lee ruled this pillar."},
    "cathie": {"score": 7, "verdict": "One sentence."},
    "druck": {"score": 6, "verdict": "One sentence."},
    "dalio": {"score": 5, "verdict": "One sentence."},
    "klarman": {"score": 7, "verdict": "One sentence."},
    "simons": {"score": 8, "verdict": "One sentence."},
    "soros": {"score": 4, "verdict": "One sentence."},
    "voldesk": {"score": 6, "verdict": "One sentence."}
  },
  "stances": {
    "tomlee": "BULL",
    "cathie": "BULL",
    "druck": "NEUTRAL",
    "dalio": "BEAR",
    "klarman": "NEUTRAL",
    "simons": "BULL",
    "soros": "BEAR",
    "voldesk": "BULL"
  },
  "weightedScore": 0.25,
  "conviction": "BUY",
  "bullCase": ["First strongest bull argument synthesized from all analyses.", "Second strongest bull argument."],
  "bearCase": ["First strongest bear argument synthesized from all analyses.", "Second strongest bear argument."],
  "sizing": "Half Position",
  "keyRisk": "The single biggest risk that could invalidate the entire thesis in one sentence.",
  "verdict": "2-3 sentence championship ruling. Direct. No hedging. This is the final word."
}

conviction must be exactly one of: STRONG BUY / BUY / HOLD / SELL / STRONG SELL
sizing must be exactly one of: Full Position / Half Position / Quarter Position / Starter / Pass
weightedScore: number from -1.0 (max bear) to +1.0 (max bull)
score: integer 1-10 reflecting how dominant the legend was in their pillar given this specific stock`;

// ── Calls our local proxy instead of Anthropic directly ──
async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

const stanceStyle = (s) => {
  if (!s) return { color: "#555", bg: "transparent", border: "#333" };
  const u = s.toUpperCase();
  if (u === "BULL") return { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)" };
  if (u === "BEAR") return { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" };
  return { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)" };
};

const convictionColor = (c) => ({
  "STRONG BUY": "#00ff88", "BUY": "#34d399", "HOLD": "#fbbf24",
  "SELL": "#f87171", "STRONG SELL": "#ff3366",
}[c] || "#888");

const extractStance = (text) => {
  const m = (text || "").match(/PILLAR STANCE:\s*(BULL|BEAR|NEUTRAL)/i);
  return m ? m[1].toUpperCase() : null;
};

export default function RoyalRumble() {
  const [ticker, setTicker] = useState("");
  const [context, setContext] = useState("");
  const [analyses, setAnalyses] = useState({});
  const [judgeResult, setJudgeResult] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [expanded, setExpanded] = useState(null);

  const runRumble = async () => {
    if (!ticker.trim() || phase === "fighting" || phase === "judging") return;
    setAnalyses({});
    setJudgeResult(null);
    setPhase("fighting");
    setExpanded(null);

    const userMsg = `Stock/Idea: ${ticker.toUpperCase()}${context ? `\nContext: ${context}` : ""}

Analyze strictly from your assigned pillar only. Be specific and decisive.`;

    const collected = {};
    for (const leg of LEGENDS) {
      setLoadingId(leg.id);
      try {
        const r = await callClaude(leg.persona, userMsg);
        collected[leg.id] = r;
      } catch {
        collected[leg.id] = "Analysis unavailable.";
      }
      setAnalyses((p) => ({ ...p, [leg.id]: collected[leg.id] }));
    }
    setLoadingId("judge");
    setPhase("judging");

    const allText = LEGENDS.map(
      (l) => `=== ${l.name.toUpperCase()} — ${l.title} ===\n${collected[l.id]}`
    ).join("\n\n");

    try {
      const raw = await callClaude(JUDGE_PERSONA, `Stock: ${ticker.toUpperCase()}\n\n${allText}`);
      const clean = raw.replace(/```json|```/g, "").trim();
      setJudgeResult(JSON.parse(clean));
    } catch {
      setJudgeResult({ error: true });
    }

    setLoadingId(null);
    setPhase("done");
  };

  const busy = phase === "fighting" || phase === "judging";

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", color: "#d8d0c0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#0c0c1e,#06060f)", borderBottom: "1px solid #12122a", padding: "22px 28px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#ffd700", fontWeight: 700, marginBottom: 5, textTransform: "uppercase" }}>
            ⚔ ROYAL RUMBLE HEDGE FUND SYSTEM
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(20px,3vw,32px)", fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
            8 Legends. 8 Pillars.{" "}
            <span style={{ color: "#ffd700" }}>One Championship Ruling.</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#383858", letterSpacing: 1 }}>
            Each legend competes only in their domain — Tom Lee owns Liquidity, Druck owns Timing. The Judge scores every pillar 1–10.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 28px" }}>

        {/* Input bar */}
        <div style={{ background: "#0a0a18", border: "1px solid #1a1a30", padding: "18px 22px", marginBottom: 26, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 6 }}>TICKER</div>
            <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && !busy && runRumble()} placeholder="NVDA" disabled={busy}
              style={{ background: "#04040c", border: "1px solid #222240", color: "#ffd700", fontSize: 22, fontFamily: "Georgia,serif", fontWeight: 700, padding: "8px 12px", width: 120, letterSpacing: 2, outline: "none" }} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 6 }}>CONTEXT (optional)</div>
            <input value={context} onChange={e => setContext(e.target.value)} placeholder="e.g. Post-earnings dip, eyeing Jan calls, bearish on macro…" disabled={busy}
              style={{ background: "#04040c", border: "1px solid #222240", color: "#bbb", fontSize: 13, fontFamily: "Georgia,serif", padding: "8px 12px", width: "100%", outline: "none" }} />
          </div>
          <button onClick={runRumble} disabled={busy || !ticker.trim()}
            style={{ background: busy ? "#141428" : "#ffd700", color: busy ? "#444" : "#000", border: "none", padding: "8px 22px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", fontFamily: "Georgia,serif" }}>
            {phase === "fighting" ? `▶ Querying ${LEGENDS.find(l => l.id === loadingId)?.name || "…"}` : phase === "judging" ? "⚖ Judge ruling…" : "START RUMBLE"}
          </button>
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))", gap: 11, marginBottom: 28 }}>
          {LEGENDS.map(leg => {
            const text = analyses[leg.id] || "";
            const stance = extractStance(text);
            const isLoading = loadingId === leg.id;
            const done = !!text && !isLoading;
            const open = expanded === leg.id;
            const ss = stanceStyle(stance);
            return (
              <div key={leg.id} onClick={() => done && setExpanded(open ? null : leg.id)}
                style={{ background: "#0a0a18", border: `1px solid ${done ? leg.color + "33" : "#151530"}`, padding: 16, cursor: done ? "pointer" : "default", boxShadow: done ? `0 0 18px ${leg.glow}` : "none", transition: "all 0.2s", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: leg.color, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>
                      {leg.tag}{leg.crown ? " 👑" : ""}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{leg.name}</div>
                    <div style={{ fontSize: 10, color: "#3a3a5a", marginTop: 2 }}>{leg.title}</div>
                  </div>
                  <span style={{ fontSize: 20 }}>{leg.icon}</span>
                </div>

                {isLoading && (
                  <div style={{ background: "#111", height: 2, marginBottom: 10, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "35%", background: leg.color, animation: "shimmer 1.1s infinite ease-in-out" }} />
                  </div>
                )}

                {stance && (
                  <div style={{ display: "inline-block", background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, fontSize: 8, letterSpacing: 3, fontWeight: 700, padding: "2px 7px", textTransform: "uppercase", marginBottom: 8 }}>
                    {stance}
                  </div>
                )}

                {done && !open && (
                  <div style={{ fontSize: 11, color: "#3a3a5a", lineHeight: 1.5 }}>
                    {text.slice(0, 90)}…{" "}
                    <span style={{ color: leg.color, fontSize: 10 }}>expand</span>
                  </div>
                )}

                {open && (
                  <div style={{ fontSize: 11, color: "#bbb", lineHeight: 1.7 }}>
                    {text.split("\n").filter(Boolean).map((p, i) => <p key={i} style={{ margin: "0 0 8px" }}>{p}</p>)}
                  </div>
                )}

                {!text && !isLoading && (
                  <div style={{ fontSize: 11, color: "#1e1e38" }}>{phase === "idle" ? "Awaiting rumble…" : "In queue…"}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Judge Verdict */}
        {judgeResult && !judgeResult.error && (
          <div style={{ background: "#080814", border: "1px solid rgba(255,215,0,0.18)", padding: "26px 28px", boxShadow: "0 0 50px rgba(255,215,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ fontSize: 9, letterSpacing: 5, color: "#ffd700", fontWeight: 700, border: "1px solid rgba(255,215,0,0.25)", padding: "3px 9px" }}>
                ⚖ THE JUDGE
              </div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#2a2a44", textTransform: "uppercase" }}>
                CHAMPIONSHIP VERDICT — {ticker}
              </div>
            </div>

            {/* Top stats */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 5 }}>Conviction</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: convictionColor(judgeResult.conviction), letterSpacing: -1 }}>{judgeResult.conviction}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 5 }}>Position Size</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ffd700" }}>{judgeResult.sizing}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 5 }}>Weighted Score</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: judgeResult.weightedScore > 0.1 ? "#34d399" : judgeResult.weightedScore < -0.1 ? "#f87171" : "#fbbf24" }}>
                  {judgeResult.weightedScore > 0 ? "+" : ""}{Math.round(judgeResult.weightedScore * 100)} pts
                </div>
              </div>
            </div>

            {/* Pillar scorecard */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 11 }}>PILLAR SCORECARD</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 9 }}>
                {LEGENDS.map(leg => {
                  const p = judgeResult.pillarWins?.[leg.id];
                  const stance = judgeResult.stances?.[leg.id];
                  if (!p) return null;
                  const barColor = p.score >= 7 ? "#34d399" : p.score >= 5 ? "#fbbf24" : "#f87171";
                  const ss = stanceStyle(stance);
                  return (
                    <div key={leg.id} style={{ background: "#0c0c1e", border: `1px solid ${leg.color}18`, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                        <div>
                          <div style={{ fontSize: 11, color: leg.color, fontWeight: 700 }}>{leg.name}{leg.crown ? " 👑" : ""}</div>
                          <div style={{ fontSize: 9, color: "#2a2a4a" }}>{leg.title}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 19, fontWeight: 700, color: barColor, lineHeight: 1 }}>
                            {p.score}<span style={{ fontSize: 9, color: "#333" }}>/10</span>
                          </div>
                          {stance && (
                            <div style={{ fontSize: 7, letterSpacing: 2, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, padding: "1px 4px", marginTop: 2, display: "inline-block", fontWeight: 700 }}>
                              {stance}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ background: "#0a0a16", height: 2, marginBottom: 6 }}>
                        <div style={{ height: "100%", background: barColor, width: `${(p.score / 10) * 100}%` }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#444", lineHeight: 1.5 }}>{p.verdict}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bull / Bear case */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)", padding: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#34d399", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>🟢 BULL CASE</div>
                {(judgeResult.bullCase || []).map((pt, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#999", marginBottom: 8, lineHeight: 1.6, borderLeft: "2px solid rgba(52,211,153,0.4)", paddingLeft: 10 }}>{pt}</div>
                ))}
              </div>
              <div style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.12)", padding: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#f87171", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>🔴 BEAR CASE</div>
                {(judgeResult.bearCase || []).map((pt, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#999", marginBottom: 8, lineHeight: 1.6, borderLeft: "2px solid rgba(248,113,113,0.4)", paddingLeft: 10 }}>{pt}</div>
                ))}
              </div>
            </div>

            {/* Key risk */}
            {judgeResult.keyRisk && (
              <div style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.12)", padding: "11px 15px", marginBottom: 16 }}>
                <span style={{ fontSize: 9, letterSpacing: 3, color: "#ffd700", fontWeight: 700, textTransform: "uppercase" }}>⚠ KEY RISK: </span>
                <span style={{ fontSize: 12, color: "#666" }}>{judgeResult.keyRisk}</span>
              </div>
            )}

            {/* Verdict */}
            <div style={{ borderTop: "1px solid #14142a", paddingTop: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#ffd700", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>⚖ CHAMPIONSHIP RULING</div>
              <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8 }}>{judgeResult.verdict}</div>
            </div>
          </div>
        )}

        {judgeResult?.error && (
          <div style={{ background: "#0a0a18", border: "1px solid rgba(248,113,113,0.2)", padding: 20, color: "#f87171", fontSize: 13 }}>
            ⚠ Judge failed to parse verdict. Individual analyses above are complete — try running again.
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{left:-35%} 100%{left:100%} }
        input::placeholder { color: #1e1e38; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
