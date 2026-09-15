// Faqat parol (ADMIN_PASSWORD) to'g'ri kiritilganda ishlaydigan endpoint.
// api/report-issue.js (materialdagi xatolar) va api/feedback.js (umumiy
// takliflar) orqali Upstash Redis'ga yig'ilgan ro'yxatlarni qaytaradi.
//
// MUHIM: Vercel loyihasi sozlamalarida (Settings -> Environment Variables)
// ADMIN_PASSWORD nomli o'zgaruvchini albatta qo'shing — aks holda bu
// endpoint hech qachon ishlamaydi (xavfsizlik uchun ataylab shunday).

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const REPORTS_KEY = 'quality-reports';
const SUGGESTIONS_KEY = 'platform-suggestions';
const MAX_ITEMS = 300;

async function lrangeAll(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return [];
  try {
    const res = await fetch(`${UPSTASH_URL}/lrange/${encodeURIComponent(key)}/0/${MAX_ITEMS - 1}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    const raw = Array.isArray(data.result) ? data.result : [];
    return raw
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

// Doimiy vaqt taqqoslash - parolni belgi-ma-belgi solishtirishda vaqt
// farqidan foydalanib topishning (timing attack) oldini oladi.
function safeEqual(a, b) {
  const strA = String(a || '');
  const strB = String(b || '');
  if (strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i++) {
    diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }
  return diff === 0;
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
    // Xato xabari ataylab umumiy qilib qoldirilgan — "parol xato" yoki
    // "bunday foydalanuvchi yo'q" kabi farqlarni oshkor qilmaymiz.
    res.status(401).json({ error: 'Kirish rad etildi' });
    return;
  }

  const [reports, suggestions] = await Promise.all([
    lrangeAll(REPORTS_KEY),
    lrangeAll(SUGGESTIONS_KEY),
  ]);

  res.status(200).json({ reports, suggestions });
}
