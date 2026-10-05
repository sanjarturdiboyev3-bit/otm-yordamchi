// Admin panel uchun: so'nggi N kunlik foydalanish statistikasini (har bir
// material turi bo'yicha kunlik son) va jami sonlarni qaytaradi. Grafik
// admin.html tomonida chiziladi.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TYPES = ['material', 'slayd', 'mashq', 'test'];
const DAYS = 30;

export const maxDuration = 30;

function safeEqual(a, b) {
  const strA = String(a || '');
  const strB = String(b || '');
  if (strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i++) diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  return diff === 0;
}

async function redisGet(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return 0;
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await r.json();
    return Number(data && data.result) || 0;
  } catch (e) {
    return 0;
  }
}

function lastNDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "Server sozlanmagan: ADMIN_PASSWORD o'rnatilmagan" });
    return;
  }
  const { password } = req.body || {};
  if (!safeEqual(password, ADMIN_PASSWORD)) {
    res.status(401).json({ error: 'Kirish rad etildi' });
    return;
  }

  try {
    const days = lastNDays(DAYS);

    // Jami sonlar — barchasi bir vaqtda (parallel)
    const totalValues = await Promise.all(TYPES.map((t) => redisGet('stats:' + t)));
    const totals = {};
    TYPES.forEach((t, i) => { totals[t] = totalValues[i]; });

    // Kunlik sonlar — 30 kun x 4 tur = 120 ta so'rov, HAMMASI bir vaqtda
    // (ketma-ket emas) — aks holda javob qaytishi sekin bo'lib ketardi.
    const pairs = [];
    for (const day of days) for (const t of TYPES) pairs.push({ day, t });
    const values = await Promise.all(pairs.map((p) => redisGet(`stats-daily:${p.t}:${p.day}`)));

    const byDay = {};
    for (const day of days) byDay[day] = { day };
    pairs.forEach((p, i) => { byDay[p.day][p.t] = values[i]; });
    const daily = days.map((day) => byDay[day]);

    res.status(200).json({ totals, daily, types: TYPES });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi: ' + (e.message || '') });
  }
}
