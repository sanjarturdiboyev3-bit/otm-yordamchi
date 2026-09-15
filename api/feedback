// Foydalanuvchilar (o'qituvchilar) platforma haqida umumiy taklif/tavsiya
// yuborishi uchun endpoint. api/report-issue.js dan farqi: bu aniq bir
// generatsiya xatosiga bog'liq emas — umumiy fikr, yangi funksiya g'oyasi,
// interfeys haqidagi mulohaza va h.k. uchun.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const SUGGESTIONS_KEY = 'platform-suggestions';
const MAX_TEXT_LEN = 1000;
const MAX_CONTACT_LEN = 120;

// Oddiy IP-asoslangan tezlik cheklovi — bitta odam bir daqiqada bir nechta
// marta yubormasin (spam/xato bosishning oldini olish).
const RATE_WINDOW_SECONDS = 60;

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

async function isRateLimited(ip) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const key = `feedback-rate:${ip}`;
    const res = await fetch(`${UPSTASH_URL}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    const count = Number(data.result || 0);
    if (count === 1) {
      await fetch(`${UPSTASH_URL}/expire/${encodeURIComponent(key)}/${RATE_WINDOW_SECONDS}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    }
    return count > 3; // bir daqiqada 3 tadan ortiq bo'lsa cheklanadi
  } catch (e) {
    return false; // Redis muammosi bo'lsa, cheklovsiz o'tkazib yuboramiz
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text, contact } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: "Taklif matni bo'sh bo'lmasligi kerak" });
    return;
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip)) {
    res.status(429).json({ error: "Juda ko'p so'rov. Biroz kuting va qayta urinib ko'ring." });
    return;
  }

  const entry = {
    text: text.trim().slice(0, MAX_TEXT_LEN),
    contact: String(contact || '').trim().slice(0, MAX_CONTACT_LEN),
    at: new Date().toISOString(),
  };

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    res.status(200).json({ ok: true, stored: false });
    return;
  }

  try {
    await fetch(
      `${UPSTASH_URL}/lpush/${encodeURIComponent(SUGGESTIONS_KEY)}/${encodeURIComponent(JSON.stringify(entry))}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
    );
    res.status(200).json({ ok: true, stored: true });
  } catch (e) {
    res.status(200).json({ ok: true, stored: false });
  }
}
