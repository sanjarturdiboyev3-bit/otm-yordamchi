// Bosh sahifadagi "N marta yaratildi" statistika paneli uchun ochiq
// (parolsiz) endpoint — faqat sonlarni qaytaradi, hech qanday shaxsiy
// ma'lumot yo'q.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const TYPES = ['material', 'slayd', 'mashq', 'test'];

async function getCount(type) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return 0;
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent('stats:' + type)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await r.json();
    return Number(data && data.result) || 0;
  } catch (e) {
    return 0;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const [material, slayd, mashq, test] = await Promise.all(TYPES.map(getCount));
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.status(200).json({ material, slayd, mashq, test });
  } catch (e) {
    res.status(200).json({ material: 0, slayd: 0, mashq: 0, test: 0 });
  }
}
