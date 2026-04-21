import { useState, useEffect } from 'react'
import Kiosk from './kiosk.jsx'
import Leaderboard from './leaderboard.jsx'

function App() {
  const [view, setView] = useState(() => window.location.hash.replace('#', '') || 'landing')

  useEffect(() => {
    const handlePopState = () => {
      setView(window.location.hash.replace('#', '') || 'landing')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (newView) => {
    setView(newView)
    window.history.pushState(null, '', `#${newView}`)
  }

  return (
    <div id="scroll-container" style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#030608', display: 'flex', flexDirection: 'column' }}>
      {view !== 'landing' && (
        <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end', zIndex: 1000, background: '#030608', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => navigate('landing')} style={{ opacity: 0.5, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>🏠 Home</button>
          <button onClick={() => navigate('leaderboard')} style={{ opacity: view === 'leaderboard' ? 1 : 0.5, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>📊 Leaderboard</button>
          <button onClick={() => navigate('kiosk')} style={{ opacity: view === 'kiosk' ? 1 : 0.5, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>🎮 Kiosk</button>
        </div>
      )}
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {view === 'landing' && (
          <div style={{ 
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            fontFamily: "'DM Mono', monospace", color: '#fff', padding: '20px', boxSizing: 'border-box'
          }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap" rel="stylesheet" />
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(60px, 15vw, 100px)", color: "#fff", marginBottom: "10px", textAlign: "center", lineHeight: 1 }}>
              MARKET<br /><span style={{ color: "#00ff87" }}>ORACLE</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => navigate('leaderboard')} style={{
                background: "transparent", color: "#00ff87", border: "1px solid #00ff87", borderRadius: "4px",
                padding: "16px 32px", fontSize: "16px", fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,135,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                SEE LEADERBOARD
              </button>
              <button onClick={() => navigate('kiosk')} style={{
                background: "#00ff87", color: "#050810", border: "1px solid #00ff87", borderRadius: "4px",
                padding: "16px 32px", fontSize: "16px", fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,135,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
              >
                PLAY GAME
              </button>
            </div>
          </div>
        )}

        {view === 'leaderboard' && <Leaderboard />}
        {view === 'kiosk' && <Kiosk />}
      </div>
    </div>
  )
}

export default App
