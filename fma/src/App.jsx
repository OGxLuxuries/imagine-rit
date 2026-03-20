import { useState } from 'react'
import Kiosk from './kiosk.jsx'
import Leaderboard from './leaderboard.jsx'

function App() {
  const [view, setView] = useState('leaderboard')

return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: '8px' }}>
        <button onClick={() => setView('leaderboard')} style={{ opacity: view === 'leaderboard' ? 1 : 0.5 }}>📊 Leaderboard</button>
        <button onClick={() => setView('kiosk')} style={{ opacity: view === 'kiosk' ? 1 : 0.5 }}>🎮 Kiosk</button>
      </div>
      {view === 'leaderboard' && <Leaderboard />}
      {view === 'kiosk' && <Kiosk />}
    </div>
  )
}

export default App
