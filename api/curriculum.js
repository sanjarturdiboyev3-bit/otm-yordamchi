// Bosh sahifadagi "Fan" va "Mavzu" tanlash ro'yxatlari (dropdown) uchun
// ochiq (parolsiz) endpoint — faqat O'QISH, hech qanday maxfiy ma'lumot yo'q.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const CURRICULUM_KEY = 'curriculum-map';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    res.status(200).json({ curriculum: {} });
    return;
  }

  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(CURRICULUM_KEY)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await r.json();
    const curriculum = data && data.result ? JSON.parse(data.result) : {};
    // Foydalanuvchiga kesh sarlavhasi bilan qaytaramiz — ro'yxat tez-tez
    // o'zgarmaydi, brauzer bir necha daqiqa keshlab qo'yishi mumkin.
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json({ curriculum });
  } catch (e) {
    res.status(200).json({ curriculum: {} });
  }
}
