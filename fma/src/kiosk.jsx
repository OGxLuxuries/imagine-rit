import { useState } from "react";

// All data sourced from real Q4 2025 / Q1 2026 earnings reports (Jan–Feb 2026)
// Answer = actual stock direction in the 5 trading days following the earnings release
const STOCKS = [
  {
    ticker: "AAPL", name: "Apple Inc.", sector: "Technology", price: 258.08,
    reportDate: "Jan 29, 2026", difficulty: 1, diffLabel: "EASY", answer: "UP",
    pe: 32.3, sectorAvgPe: 28.0,
    earningsSurprise: +6.37,
    headline: "Apple Q1 FY2026: Revenue $143.8B (+16% YoY), EPS $2.84 vs. $2.66 est. All-time records for iPhone and Services. Greater China revenue surged 38% YoY.",
    context: "Supply constraints on 3nm chips are expected to limit Q2 iPhone shipments. Memory cost inflation flagged as a gross margin headwind. Services segment now contributes over 25% of total revenue — a structural shift from hardware dependency.",
    sparkTrend: "up",
  },
  {
    ticker: "META", name: "Meta Platforms Inc.", sector: "Social Media / AI", price: 672.97,
    reportDate: "Jan 28, 2026", difficulty: 2, diffLabel: "EASY", answer: "UP",
    pe: 28.4, sectorAvgPe: 24.0,
    earningsSurprise: +8.42,
    headline: "Meta Q4 2025: EPS $8.88 vs. $8.19 est. Revenue $59.9B (+24% YoY). Daily active users across all platforms reached 3.58 billion (+7% YoY). Ad impressions +18%.",
    context: "2026 capital expenditures guided to $115–$135B — nearly double the $72.2B spent in 2025. Reality Labs posted a $6B operating loss for the quarter. The FTC is appealing its antitrust case loss against Meta, citing Instagram and WhatsApp acquisitions. Operating margin fell from 48% to 41% as expenses rose 40% YoY.",
    sparkTrend: "up",
  },
  {
    ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", price: 252.32,
    reportDate: "Jan 13, 2026", difficulty: 3, diffLabel: "EASY", answer: "UP",
    pe: 13.8, sectorAvgPe: 13.5,
    earningsSurprise: +7.61,
    headline: "JPMorgan Q4 2025: Adj. EPS $5.23 vs. $4.86 est. Revenue $46.77B. Trading revenue +17% YoY. Reported EPS $4.63 due to $2.2B one-time charge for Apple Card portfolio acquisition.",
    context: "The $2.2B charge was pre-announced and tied to acquiring Goldman Sachs's Apple Card book — investors had largely priced it in. CEO Jamie Dimon flagged geopolitical and inflation risks but described the U.S. consumer as 'resilient.' 2026 net interest income guided to ~$103B.",
    sparkTrend: "up",
  },
  {
    ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology / Advertising", price: 196.82,
    reportDate: "Feb 4, 2026", difficulty: 4, diffLabel: "MEDIUM", answer: "DOWN",
    pe: 21.8, sectorAvgPe: 28.0,
    earningsSurprise: +8.05,
    headline: "Alphabet Q4 2025: EPS $2.82 vs. $2.61 est. Revenue $113.8B (+18% YoY). Google Cloud revenue +48% to $17.7B. YouTube ad revenue $11.38B missed the $11.84B estimate.",
    context: "2026 CapEx guidance of $175–$185B — more than double the $91–$93B spent in 2025. The $2.1B stock-based compensation charge related to Waymo's revaluation hit operating expenses. YouTube advertising revenue missed estimates, partly due to tough comparisons from 2024 U.S. election spending. Stock fell as much as 3% in after-hours trading despite the headline beat.",
    sparkTrend: "flat",
  },
  {
    ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive / EV", price: 361.62,
    reportDate: "Jan 28, 2026", difficulty: 5, diffLabel: "MEDIUM", answer: "DOWN",
    pe: 148.2, sectorAvgPe: 15.0,
    earningsSurprise: +25.0,
    headline: "Tesla Q4 2025: EPS $0.50 vs. $0.40 est. (+25%). Gross margin 20.1% — highest in two years. Full-year 2025 vehicle deliveries declined YoY for the second consecutive year.",
    context: "Revenue of $24.9B came in just 0.48% above estimates despite the EPS beat. 2026 CapEx guidance was raised above $20B, raising cash burn concerns. CEO Musk emphasized a pivot to 'physical AI' with Optimus humanoid robot production targeting 1M units/year. Stock fell 3.33% post-earnings. At 148x TTM earnings, valuation leaves minimal room for execution risk.",
    sparkTrend: "volatile",
  },
  {
    ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors / AI", price: 131.38,
    reportDate: "Feb 25, 2026", difficulty: 6, diffLabel: "HARD", answer: "DOWN",
    pe: 38.4, sectorAvgPe: 27.0,
    earningsSurprise: +6.58,
    headline: "NVIDIA Q4 FY2026: EPS $1.62 vs. $1.53 est. Revenue $68.1B vs. $65.8B est. (+73% YoY). Data Center revenue $62.3B (+93% YoY). Q1 FY2027 revenue guidance $78B, well above $72.8B estimate.",
    context: "Despite beating on revenue, EPS, and guidance, the stock fell over 5% the following day. 90% of revenue is concentrated in five hyperscaler customers — Amazon, Google, Microsoft, Oracle, and Alibaba. Gaming revenue of $3.7B missed the $4B estimate. Analysts flagged growing competition from AMD and in-house accelerator programs at Amazon and Google. The stock had already priced in 'perfection,' leaving even strong beats vulnerable to sell-offs.",
    sparkTrend: "volatile",
  },
  {
    ticker: "AMZN", name: "Amazon.com Inc.", sector: "Cloud / E-Commerce", price: 233.46,
    reportDate: "Feb 5, 2026", difficulty: 7, diffLabel: "HARD", answer: "DOWN",
    pe: 27.7, sectorAvgPe: 22.0,
    earningsSurprise: -1.02,
    headline: "Amazon Q4 2025: EPS $1.95 vs. $1.97 est. (narrow miss). Revenue $213.4B (+12% YoY) beat estimates. AWS revenue $35.6B (+24% YoY) — fastest growth in 13 quarters. 2026 CapEx guided to ~$200B.",
    context: "The $200B CapEx plan — up 56% from 2025 and $53B above analyst expectations — dominated investor reaction. Q1 2026 operating income guidance of $16.5–$21.5B missed consensus. Free cash flow margin fell to 7% from 10.4% a year earlier. Amazon announced layoffs of ~16,000 employees days before reporting. Shares fell 8–11% in after-hours trading despite the AWS beat.",
    sparkTrend: "down",
  },
  {
    ticker: "PFE", name: "Pfizer Inc.", sector: "Pharmaceuticals", price: 26.14,
    reportDate: "Feb 3, 2026", difficulty: 8, diffLabel: "HARD", answer: "DOWN",
    pe: 14.9, sectorAvgPe: 18.0,
    earningsSurprise: +13.79,
    headline: "Pfizer Q4 2025: EPS $0.66 vs. $0.58 est. (+13.79%). Revenue $17.6B exceeded forecasts. Full-year 2026 revenue guidance reaffirmed at $59.5–$62.5B — roughly flat YoY.",
    context: "GAAP EPS for Q4 was a loss of $0.29 due to $4.4B in non-cash intangible impairments on deprioritized pipeline assets. COVID product revenue expected to fall ~$1.5B in 2026. Patent expirations on key drugs add another ~$1.5B revenue headwind. Stock had already declined 58% from its 2021 peak ahead of this report. Shares fell 4.54% in pre-market despite the adjusted EPS beat.",
    sparkTrend: "down",
  },
  {
    ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology / Cloud", price: 415.20,
    reportDate: "Jan 28, 2026", difficulty: 9, diffLabel: "EXPERT", answer: "DOWN",
    pe: 25.2, sectorAvgPe: 28.0,
    earningsSurprise: +3.9,
    headline: "Microsoft Q2 FY2026: EPS and revenue beat estimates. Azure cloud grew 31% YoY. Q3 Azure growth guided to 34–35%, below the 35%+ Wall Street had modeled. Intelligent Cloud segment revenue slightly missed.",
    context: "P/E has compressed ~25% from its 3-year average of 33.8x, trading below both its own historical median and the sector average. The Azure deceleration in guidance — even by a fraction of a percentage point — was the focal point for growth investors. Shares declined modestly after hours. Sentiment on the stock had been increasingly cautious entering the print amid broader Mag-7 rotation.",
    sparkTrend: "flat",
  },
  {
    ticker: "SMCI", name: "Super Micro Computer", sector: "AI Infrastructure", price: 29.71,
    reportDate: "Feb 3, 2026", difficulty: 10, diffLabel: "EXPERT", answer: "UP",
    pe: 23.1, sectorAvgPe: 30.0,
    earningsSurprise: +50.0,
    headline: "SMCI Q2 FY2026: EPS $0.69 vs. $0.46 est. (+50%). Revenue $12.7B crushed $10.4B est. (+21.88% beat). Revenue grew 123% YoY. Full-year revenue guidance raised to minimum $40B.",
    context: "Gross margins fell from 9.5% to 6.4% — decade lows, now 10 consecutive quarters of compression. Over 63% of revenue is concentrated in a single customer. The DOJ opened a formal inquiry into the company's accounting practices following a Hindenburg Research short-seller report. The stock was trading near its 52-week low of $27.60 ahead of the report. Goldman Sachs holds a Sell rating with a $26 price target. Consensus analyst rating: Hold.",
    sparkTrend: "volatile",
  },
];

const STORAGE_KEY = "fmc-leaderboard";

const DIFF_STYLES = {
  EASY:   { border: "rgba(180,180,180,0.35)", text: "#888" },
  MEDIUM: { border: "rgba(180,180,180,0.35)", text: "#888" },
  HARD:   { border: "rgba(180,180,180,0.35)", text: "#888" },
  EXPERT: { border: "rgba(180,180,180,0.35)", text: "#888" },
};

function generateSparkline(trend) {
  let val = 100;
  const bias = { up: 0.56, down: 0.42, flat: 0.50, volatile: 0.50 }[trend] ?? 0.5;
  const vol  = { up: 2.2, down: 2.2, flat: 1.2, volatile: 6.0 }[trend] ?? 3;
  return Array.from({ length: 32 }, () => {
    val += (Math.random() > bias ? -1 : 1) * (Math.random() * vol);
    return Math.max(70, Math.min(140, val));
  });
}

function Sparkline({ data }) {
  const min = Math.min(...data), max = Math.max(...data);
  const W = 160, H = 48;
  const pt = (v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * H}`;
  const pts = data.map(pt).join(" ");
  const fill = `0,${H} ${pts} ${W},${H}`;
  const lastY = H - ((data[data.length - 1] - min) / (max - min || 1)) * H;
  return (
    <svg width={W} height={H}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#666" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#666" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke="#555" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={W} cy={lastY} r="3.5" fill="#666" />
    </svg>
  );
}

function DataRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "12px",
    }}>
      <span style={{ color: "#444", letterSpacing: "1px", fontSize: "10px", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: "#bbb", fontWeight: "500" }}>{value}</span>
    </div>
  );
}

export default function Kiosk() {
  const [screen, setScreen]     = useState("intro");
  const [nameInput, setNameInput] = useState("");
  const [name, setName]         = useState("");
  const [picks, setPicks]       = useState({});
  const [idx, setIdx]           = useState(0);
  const [animIn, setAnimIn]     = useState(true);
  const [score, setScore]       = useState(null);
  const [sparks] = useState(() =>
    Object.fromEntries(STOCKS.map(s => [s.ticker, generateSparkline(s.sparkTrend)]))
  );

  const stock = STOCKS[idx];
  const sparkData = stock ? sparks[stock.ticker] : [];
  const ds = stock ? DIFF_STYLES[stock.diffLabel] : DIFF_STYLES.EASY;

  const handlePick = async (dir) => {
    const newPicks = { ...picks, [stock.ticker]: dir };
    setPicks(newPicks);
    setAnimIn(false);
    await new Promise(r => setTimeout(r, 280));
    if (idx < STOCKS.length - 1) {
      setIdx(idx + 1);
      setAnimIn(true);
    } else {
      let correct = 0;
      STOCKS.forEach(s => { if (newPicks[s.ticker] === s.answer) correct++; });
      const bonus  = correct === 10 ? 3000 : correct >= 9 ? 1500 : correct >= 8 ? 500 : 0;
      const points = correct * 1000 + bonus + Math.floor(Math.random() * 100);
      setScore({ correct, total: STOCKS.length, points, picks: newPicks });
      try {
        const ex = await window.storage.get(STORAGE_KEY, true);
        const board = ex ? JSON.parse(ex.value) : [];
        board.push({ name, points, correct, time: Date.now() });
        board.sort((a, b) => b.points - a.points);
        await window.storage.set(STORAGE_KEY, JSON.stringify(board.slice(0, 20)), true);
      } catch (e) { console.error(e); }
      setScreen("result");
    }
  };

  const reset = () => {
    setScreen("intro"); setNameInput(""); setName("");
    setPicks({}); setScore(null); setIdx(0); setAnimIn(true);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050810",
      fontFamily: "'DM Mono', monospace", color: "#f0f0f0",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,135,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,0.022) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "fixed", top: "-220px", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: "radial-gradient(ellipse,rgba(0,255,135,0.05) 0%,transparent 68%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "580px", padding: "24px" }}>

        {/* ── INTRO ── */}
        {screen === "intro" && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
            <div style={{ fontSize: "10px", letterSpacing: "5px", color: "#00ff87", marginBottom: "14px" }}>
              RIT FINANCIAL MANAGEMENT ASSOCIATION
            </div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(56px,14vw,86px)", lineHeight: 0.92, color: "#fff", marginBottom: "18px" }}>
              MARKET<br /><span style={{ color: "#00ff87" }}>ORACLE</span>
            </div>
            <div style={{ color: "#3a3a3a", fontSize: "11px", letterSpacing: "2px", marginBottom: "36px" }}>
              10 REAL STOCKS · REAL Q4 2025 / Q1 2026 DATA · PICK UP OR DOWN
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
              {["EASY","MEDIUM","HARD","EXPERT"].map(lbl => (
                <div key={lbl} style={{
                  padding: "5px 12px", borderRadius: "2px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "9px", letterSpacing: "2px", color: "#666",
                }}>{lbl}</div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px", padding: "20px", marginBottom: "32px", textAlign: "left",
            }}>
              {[
                "All data sourced from real Q4 2025 & Q1 2026 earnings reports",
                "Predict how each stock moved in the 5 days after reporting",
                "1,000 pts per correct pick — bonus points for near-perfect scores",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i < 2 ? "12px" : 0, fontSize: "12px", color: "#555" }}>
                  <span style={{ color: "#00ff87", fontSize: "9px", marginTop: "3px", flexShrink: 0 }}>▶</span>{t}
                </div>
              ))}
            </div>

            <button onClick={() => setScreen("name")} style={{
              background: "#00ff87", color: "#050810", border: "none", borderRadius: "2px",
              padding: "16px 52px", fontSize: "12px", fontFamily: "'DM Mono', monospace",
              fontWeight: "500", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 0 40px rgba(0,255,135,0.25)", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 56px rgba(0,255,135,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,135,0.25)"; }}
            >ENTER THE MARKET</button>
          </div>
        )}

        {/* ── NAME ── */}
        {screen === "name" && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "48px", color: "#fff", marginBottom: "8px" }}>WHO ARE YOU?</div>
            <div style={{ color: "#3a3a3a", fontSize: "11px", letterSpacing: "3px", marginBottom: "40px" }}>YOUR NAME GOES ON THE BIG BOARD</div>
            <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && nameInput.trim().length >= 2 && (setName(nameInput.trim()), setScreen("game"))}
              placeholder="ENTER YOUR NAME" maxLength={20}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,135,0.3)",
                borderRadius: "2px", padding: "16px 20px", color: "#00ff87",
                fontSize: "20px", fontFamily: "'DM Mono', monospace", letterSpacing: "4px",
                textAlign: "center", outline: "none", marginBottom: "24px", textTransform: "uppercase",
              }}
            />
            <button
              onClick={() => { if (nameInput.trim().length >= 2) { setName(nameInput.trim()); setScreen("game"); } }}
              disabled={nameInput.trim().length < 2}
              style={{
                background: nameInput.trim().length >= 2 ? "#00ff87" : "#111",
                color: nameInput.trim().length >= 2 ? "#050810" : "#333",
                border: "none", borderRadius: "2px", padding: "16px 48px",
                fontSize: "12px", fontFamily: "'DM Mono', monospace", letterSpacing: "3px",
                textTransform: "uppercase", cursor: nameInput.trim().length >= 2 ? "pointer" : "default",
                transition: "all 0.2s",
              }}>LET'S TRADE →</button>
          </div>
        )}

        {/* ── GAME ── */}
        {screen === "game" && stock && (
          <div style={{
            opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "18px" }}>
              {STOCKS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: i < idx ? "rgba(255,255,255,0.5)" : i === idx ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", color: "#333", letterSpacing: "3px" }}>
                STOCK {idx + 1} OF {STOCKS.length}
              </div>
              <div style={{
                padding: "4px 14px", borderRadius: "2px",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${ds.border}`,
                fontSize: "9px", letterSpacing: "2px", color: ds.text,
              }}>{stock.diffLabel}</div>
            </div>

            {/* Card */}
            <div style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px", padding: "20px", marginBottom: "14px",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: "50px", color: "#fff", lineHeight: 1 }}>{stock.ticker}</div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{stock.name}</div>
                  <div style={{
                    display: "inline-block", marginTop: "6px", padding: "3px 10px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "2px", fontSize: "9px", color: "#555", letterSpacing: "2px",
                  }}>{stock.sector}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", color: "#fff" }}>${stock.price.toFixed(2)}</div>
                  <div style={{ fontSize: "9px", color: "#333", marginBottom: "8px", letterSpacing: "1px" }}>AT REPORT DATE</div>
                  <Sparkline data={sparkData} />
                  <div style={{ fontSize: "9px", color: "#333", marginTop: "4px", letterSpacing: "1px" }}>30-DAY CHART</div>
                </div>
              </div>

              {/* Data table */}
              <div style={{ marginBottom: "14px" }}>
                <DataRow label="Report Date"             value={stock.reportDate} />
                <DataRow label="P/E Ratio (TTM)"        value={`${stock.pe}x`} />
                <DataRow label="Sector Avg P/E"          value={`${stock.sectorAvgPe}x`} />
                <DataRow label="EPS Surprise"            value={`${stock.earningsSurprise > 0 ? "+" : ""}${stock.earningsSurprise.toFixed(2)}%`} />
              </div>

              {/* Headline */}
              <div style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "3px solid rgba(255,255,255,0.18)",
                borderRadius: "2px", marginBottom: "12px",
              }}>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3a3a3a", marginBottom: "6px", textTransform: "uppercase" }}>
                  Earnings Summary
                </div>
                <div style={{ fontSize: "11px", color: "#bbb", lineHeight: 1.65 }}>{stock.headline}</div>
              </div>

              {/* Context */}
              <div style={{
                fontSize: "11px", color: "#404040", lineHeight: 1.7,
                paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.04)",
              }}>
                {stock.context}
              </div>
            </div>

            {/* Pick buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[["UP", "▲"], ["DOWN", "▼"]].map(([dir, arrow]) => (
                <button key={dir} onClick={() => handlePick(dir)} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px", padding: "22px 12px", cursor: "pointer",
                  fontFamily: "'Bebas Neue'", fontSize: "28px", color: "#777",
                  letterSpacing: "2px", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#777"; e.currentTarget.style.transform = ""; }}
                >{arrow} {dir}</button>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "10px", color: "#222", letterSpacing: "1px" }}>
              How did the stock move in the 5 trading days after the report?
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && score && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#333", marginBottom: "8px" }}>
              YOUR RESULTS, {name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "80px", color: "#00ff87", lineHeight: 1 }}>
              {score.points.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "#444", letterSpacing: "3px", marginBottom: "6px" }}>POINTS</div>
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "30px" }}>
              {score.correct === 10 ? "🏆 Perfect 10 — you belong on a trading floor." :
               score.correct >= 9  ? "🔥 Near-perfect. Elite trader instincts." :
               score.correct >= 8  ? "📈 Expert level. Well above the crowd." :
               score.correct >= 6  ? "📊 Solid — you know how to read a print." :
               score.correct >= 5  ? "📉 Coin-flip territory. Markets are humbling." :
               "The market won this round. It usually does."}
            </div>

            {/* Breakdown */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px", padding: "18px", marginBottom: "28px", textAlign: "left",
            }}>
              {STOCKS.map(s => {
                const userPick = score.picks[s.ticker];
                const correct  = userPick === s.answer;
                return (
                  <div key={s.ticker} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "11px",
                  }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: "17px", color: "#fff", minWidth: "52px" }}>{s.ticker}</span>
                    <span style={{ color: "#2a2a2a", fontSize: "9px", letterSpacing: "1px", minWidth: "48px" }}>{s.diffLabel}</span>
                    <span style={{ color: "#444", flex: 1 }}>
                      You: <span style={{ color: "#aaa" }}>{userPick}</span>
                      {" · "}
                      Actual: <span style={{ color: "#aaa" }}>{s.answer}</span>
                    </span>
                    <span style={{ fontSize: "15px", color: correct ? "#00ff87" : "#ff4d6d" }}>{correct ? "✓" : "✗"}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: "10px", color: "#00ff87", letterSpacing: "2px", marginBottom: "24px", opacity: 0.45 }}>
              CHECK THE BIG SCREEN FOR YOUR LEADERBOARD RANK ↑
            </div>

            <button onClick={reset} style={{
              background: "transparent", color: "#444",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px", padding: "12px 36px",
              fontSize: "11px", fontFamily: "'DM Mono', monospace",
              letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >PLAY AGAIN</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
