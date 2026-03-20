# Gamemaster Documentation

Non-technical setup and operation guide for Market Oracle at your event.

## What You Need Before Starting

### Hardware

- **Computer** (Windows, Mac, or Linux)
- **Display/Monitor** for the leaderboard (recommended: large screen, 1080p+)
- **Interactive Station(s)** for players (can be the same computer, separate devices, or kiosk terminals)
- **Network connection** (optional, for multiple stations — only needed if syncing across devices)

### Software to Install

1. **Node.js**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (green button)
   - Click through the installer, choose all defaults
   - Verify it worked: Open Command Prompt/Terminal and type `node --version`

That's it! Everything else is included.

---

## Setup (First Time Only)

### Step 1: Get the Code
1. Download the repository ZIP from GitHub
2. Extract to a folder (e.g., `C:\imagine-rit\fma` or `~/Desktop/fma`)
3. Open Command Prompt/Terminal in that folder

### Step 2: Install Dependencies
Run this command **once**:
```bash
npm install
```
This downloads all necessary libraries (~500MB). Takes 2-5 minutes.

### Step 3: Start the Game
Run:
```bash
npm run dev
```

You should see:
```
VITE v8.0.1  ready in 135 ms
➜  Local:   http://localhost:5174/
```

---

## Running the Game

### Option A: Single Machine (Simplest)
1. Open the URL shown above (e.g., `http://localhost:5174/`)
2. One window shows **LEADERBOARD** (leave running on display)
3. Switch to **KIOSK** view when a player wants to play
4. After the player finishes, their score appears on the leaderboard

### Option B: Two Displays (Recommended)
**Display 1 (Large Screen - Leaderboard):**
- Open `http://localhost:5174/` in full-screen kiosk mode
- Click the "📊 Leaderboard" button (top-right)
- Leave running

**Display 2 (Kiosk Station):**
- Open `http://localhost:5174/` on a separate computer/device (same network)
- Click the "🎮 Kiosk" button
- Players use this to play the game

---

## How the Game Works (For Your Event)

1. **Player arrives** at the kiosk station
2. **Enters their name**
3. **Sees 10 stocks** with real earnings data (Q4 2025 / Q1 2026)
4. **Predicts UP or DOWN** for each stock (how it moved in 5 days post-earnings)
5. **Gets a score** based on correct predictions
6. **Score appears on the leaderboard** in real-time

Scoring:
- 1,000 points per correct prediction
- Bonus: +3,000 for perfect 10/10, +1,500 for 9/10, +500 for 8/10

---

## Troubleshooting

### "Port 5174 is already in use"
**Solution:** Close the game and run again:
```bash
npm run dev
```
Vite will auto-pick a new port (5175, 5176, etc.)

### "Game won't load / blank page"
**Solution:**
1. Check the terminal for error messages
2. Try: Ctrl+Shift+R (hard refresh)
3. Try a different browser (Chrome, Firefox, Safari)

### "Leaderboard not updating"
**Solution:**
1. Play a game on the kiosk
2. Wait 3 seconds for auto-refresh
3. Check: Are both stations on the same machine? (They should be if using Option A)

### "I want to reset all scores"
**Solution:**
1. Open browser DevTools: F12 or Cmd+Option+I
2. Go to: **Application** → **Local Storage**
3. Find `fmc-leaderboard` and delete it
4. Reload the page

---

## Tips for Event Day

✅ **Do This:**
- Test the game the day before with at least 3 practice plays
- Keep the leaderboard display visible and engaging
- Have someone explain the game to arriving players
- Leave the terminal/command window running in the background

❌ **Avoid:**
- Closing the terminal window (this stops the game)
- Navigating away from `localhost:5174` (bookmarks the URL)
- Using the game without explaining stock terminology (provide context)

---

## Need More Help?

See [Developer Docs](./DEVELOPER.md) for technical details or development troubleshooting.

Have fun at your event! 🚀📈
