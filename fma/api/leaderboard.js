import Redis from 'ioredis';

// Connect to the Redis integration the user created using their provided URL variable
const redis = process.env.KV_REDIS_URL ? new Redis(process.env.KV_REDIS_URL) : null;

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ error: "KV_REDIS_URL is not defined in environment variables" });
  }

  if (req.method === 'GET') {
    try {
      const data = await redis.get('fma-leaderboard');
      const board = data ? JSON.parse(data) : [];
      return res.status(200).json(board);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newEntry = req.body;
      const data = await redis.get('fma-leaderboard');
      let board = data ? JSON.parse(data) : [];
      
      board.push({
        name: newEntry.name,
        points: newEntry.points,
        correct: newEntry.correct,
        time: Date.now()
      });
      
      board.sort((a, b) => b.points - a.points);
      const top20 = board.slice(0, 20);
      
      await redis.set('fma-leaderboard', JSON.stringify(top20));
      return res.status(200).json(top20);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await redis.set('fma-leaderboard', JSON.stringify([]));
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
  
  res.status(405).send('Method Not Allowed');
}
