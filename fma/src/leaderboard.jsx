import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "fmc-leaderboard";

function useLeaderboard() {
  const [board, setBoard] = useState([]);
  const prevBoard = useRef([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, true);
        if (result) {
          const data = JSON.parse(result.value);
          setBoard(data);
          prevBoard.current = data;
        }
      } catch (e) {
        // No data yet
      }
    };
    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, []);

  return board;
}

function Ticker() {
  const stocks = ["AAPL $227.48 ▲2.3%", "NVDA $131.38 ▼1.1%", "TSLA $285.17 ▲4.7%", "JPM $239.54 ▲0.8%", "AMZN $209.89 ▼0.5%", "MSFT $388.12 ▲1.9%"];
  return (
    <div style={{
      overflow: "hidden", whiteSpace: "nowrap", borderTop: "1px solid rgba(0,255,135,0.15)",
      borderBottom: "1px solid rgba(0,255,135,0.15)", padding: "10px 0",
      background: "rgba(0,255,135,0.03)",
    }}>
      <div style={{
        display: "inline-block",
        animation: "ticker 24s linear infinite",
        fontSize: "12px", letterSpacing: "3px", color: "#00ff87",
      }}>
        {[...stocks, ...stocks].map((s, i) => (
          <span key={i} style={{ marginRight: "60px" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Bar({ pct, rank }) {
  const colors = ["#00ff87", "#a8ff78", "#78ffd6"];
  const color = rank <= 3 ? colors[rank - 1] : "rgba(255,255,255,0.15)";
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0,
      width: `${pct}%`, height: "100%",
      background: `linear-gradient(90deg, ${color}22, ${color}08)`,
      borderRight: `2px solid ${color}`,
      transition: "width 1s ease",
    }} />
  );
}

export default function Leaderboard() {
  const board = useLeaderboard();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const maxPts = board.length > 0 ? board[0].points : 6200;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030608",
      fontFamily: "'DM Mono', monospace",
      color: "#f0f0f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: "100%",
      margin: 0,
      padding: 0,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Grid BG */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,135,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Top glow */}
      <div style={{
        position: "fixed", top: "-300px", left: "50%", transform: "translateX(-50%)",
        width: "900px", height: "600px",
        background: "radial-gradient(ellipse, rgba(0,255,135,0.06) 0%, transparent 65%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ padding: "40px 64px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "5px", color: "#00ff87", marginBottom: "10px" }}>
              RIT FINANCIAL MANAGEMENT ASSOCIATION — IMAGINE RIT 2025
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 1, color: "#fff" }}>
              MARKET ORACLE<br />
              <span style={{ color: "#00ff87" }}>LEADERBOARD</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#333", letterSpacing: "3px", marginBottom: "8px" }}>LIVE RANKINGS</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: "#555" }}>
              {new Date(now).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end", marginTop: "8px"
            }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ff87", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#00ff87", letterSpacing: "2px" }}>LIVE</span>
            </div>
          </div>
        </div>

        <Ticker />

        {/* Board */}
        <div style={{ flex: 1, padding: "32px 64px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {board.length === 0 && (
            <div style={{ textAlign: "center", color: "#222", fontSize: "14px", letterSpacing: "3px", marginTop: "80px" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", marginBottom: "12px" }}>NO PLAYERS YET</div>
              <div>BE THE FIRST TO MAKE YOUR PICKS →</div>
            </div>
          )}

          {board.slice(0, 10).map((entry, i) => {
            const rank = i + 1;
            const pct = (entry.points / maxPts) * 100;
            const isTop3 = rank <= 3;
            const accent = rank === 1 ? "#00ff87" : rank === 2 ? "#a8ff78" : rank === 3 ? "#78ffd6" : "rgba(255,255,255,0.2)";

            return (
              <div key={`${entry.name}-${entry.time}`} style={{
                position: "relative", overflow: "hidden",
                border: `1px solid ${isTop3 ? accent + "44" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "4px",
                padding: "18px 28px",
                display: "flex", alignItems: "center", gap: "28px",
                animation: "slideIn 0.5s ease",
                animationDelay: `${i * 0.05}s`,
                animationFillMode: "both",
                background: isTop3 ? `rgba(0,255,135,0.02)` : "transparent",
              }}>
                <Bar pct={pct} rank={rank} />

                {/* Rank */}
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: isTop3 ? "32px" : "24px",
                  color: isTop3 ? accent : "#333",
                  minWidth: "48px", textAlign: "center",
                  position: "relative",
                }}>
                  {isTop3 ? medals[rank - 1] : `#${rank}`}
                </div>

                {/* Name */}
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: isTop3 ? "28px" : "22px",
                    color: isTop3 ? "#fff" : "#aaa",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}>
                    {entry.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "2px", letterSpacing: "2px" }}>
                    {entry.correct}/6 CORRECT · {new Date(entry.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: "right", position: "relative" }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: isTop3 ? "36px" : "28px",
                    color: isTop3 ? accent : "#555",
                    lineHeight: 1,
                  }}>
                    {entry.points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "10px", color: "#333", letterSpacing: "3px" }}>POINTS</div>
                </div>

                {/* Top badge */}
                {rank === 1 && (
                  <div style={{
                    position: "absolute", top: "8px", right: "12px",
                    fontSize: "9px", letterSpacing: "3px", color: "#00ff87",
                    padding: "3px 10px", border: "1px solid rgba(0,255,135,0.3)",
                    borderRadius: "2px", background: "rgba(0,255,135,0.08)",
                  }}>
                    LEADING
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: "24px 64px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontSize: "11px", color: "#333", letterSpacing: "3px" }}>
            {board.length} PLAYER{board.length !== 1 ? "S" : ""} COMPETED TODAY
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", color: "#555", letterSpacing: "3px"
          }}>
            PLAY AT THE KIOSK → CAN YOU BEAT THE TOP?
          </div>
          <div style={{ fontSize: "11px", color: "#333", letterSpacing: "3px" }}>
            RIT FMA · IMAGINE RIT
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
