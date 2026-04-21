import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'server-data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function getLeaderboard() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLeaderboard(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

app.get('/api/leaderboard', (req, res) => {
  res.json(getLeaderboard());
});

app.post('/api/leaderboard', (req, res) => {
  const newEntry = req.body;
  const board = getLeaderboard();
  
  board.push({
    name: newEntry.name,
    points: newEntry.points,
    correct: newEntry.correct,
    time: Date.now()
  });
  
  // Sort descending by points
  board.sort((a, b) => b.points - a.points);
  
  // Keep only top 20
  const top20 = board.slice(0, 20);
  
  saveLeaderboard(top20);
  res.json(top20);
});

app.delete('/api/leaderboard', (req, res) => {
  saveLeaderboard([]);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
