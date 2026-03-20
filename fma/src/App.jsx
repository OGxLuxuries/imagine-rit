import { useState } from 'react'
import Kiosk from './kiosk.jsx'
import Leaderboard from './leaderboard.jsx'

function App() {
  const [view, setView] = useState('leaderboard')

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {view === 'leaderboard' && <Leaderboard />}
      {view === 'kiosk' && <Kiosk />}
    </div>
  )
}

export default App
