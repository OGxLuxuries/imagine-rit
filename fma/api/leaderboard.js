import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const board = await kv.get('fma-leaderboard') || [];
      return res.status(200).json(board);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newEntry = req.body;
      let board = await kv.get('fma-leaderboard') || [];
      
      board.push({
        name: newEntry.name,
        points: newEntry.points,
        correct: newEntry.correct,
        time: Date.now()
      });
      
      board.sort((a, b) => b.points - a.points);
      const top20 = board.slice(0, 20);
      
      await kv.set('fma-leaderboard', top20);
      return res.status(200).json(top20);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await kv.set('fma-leaderboard', []);
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
  
  res.status(405).send('Method Not Allowed');
}
