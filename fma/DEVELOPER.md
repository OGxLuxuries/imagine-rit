# Developer Documentation

Complete setup and development guide for Market Oracle.

## Prerequisites

### Required Installations

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for version control)
   - Download: https://git-scm.com/

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd imagine-rit/fma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   - Local: http://localhost:5174
   - Your app will automatically reload on file changes (HMR)

## Project Structure

```
fma/
├── src/
│   ├── App.jsx                 # Main app container with view switcher
│   ├── leaderboard.jsx         # Real-time rankings display
│   ├── kiosk.jsx               # Stock prediction game
│   ├── main.jsx                # Entry point (includes storage mock)
│   ├── index.css               # Global styles
│   ├── App.css                 # App-specific styles
│   └── assets/                 # Images and static files
├── index.html                  # HTML template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## Key Technologies

- **React** — UI library
- **Vite** — Build tool & dev server
- **localStorage** — Local data persistence (mocked as `window.storage`)

## Development Workflow

### Toggle Between Views
Two testable components:
- **Leaderboard** — Displays top scores, updates every 3 seconds
- **Kiosk** — Interactive game where users make predictions

Use the buttons in the top-right corner to switch between views.

### Testing the Full Flow
1. Open browser DevTools → Application → Local Storage
2. Play a game on the Kiosk view
3. Switch to Leaderboard view to see your score appear
4. Open a second browser window at the same URL to simulate multiple kiosks

### Storage Mock
The app simulates the Imagine RIT `window.storage` API using browser `localStorage`:
- All scores persist across page reloads
- Multiple browser windows/tabs share the same storage

## Build for Production

```bash
npm run build
```
- Creates optimized build in `dist/` folder
- Ready to deploy on any static host

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5174 already in use | Vite will auto-increment (5175, 5176, etc.) |
| Styles not loading | Clear browser cache: Ctrl+Shift+Del (Chrome) or Cmd+Shift+Delete (Mac) |
| Storage not persisting | Check DevTools → Application → Local Storage for stored data |
| HMR not working | Ensure browser is connected to dev server; check console for errors |

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "description"`
3. Push: `git push origin feature/your-feature`
4. Open a pull request

---

Need help? Check the [Gamemaster Docs](./GAMEMASTER.md) for installation and runtime guidance.
