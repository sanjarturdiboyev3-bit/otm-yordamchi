// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nSiz tajribali pedagog va fan mutaxassisisiz. Shu mavzu bo'yicha qisqa, mazmunli o'quv materiali yozing: (1) mavzuga kirish va ahamiyati, (2) asosiy ta'rif va tushunchalar, (3) kamida bitta batafsil ishlangan misol, (4) mavzuning amaliy qo'llanilishi. O'zbek tilida, aniq sarlavhalar bilan tuzing.`,
  slayd: (base) => `${base}\n\nShu mavzu bo'yicha taqdimot uchun 9-10 ta slayd rejasini tuzing. Har bir slayd uchun "Slayd N: Sarlavha" va 3-4 ta qisqa bullet fikr yozing. O'zbek tilida yozing.`,
  mashq: (base) => `${base}\n\nShu mavzu bo'yicha 8-10 ta amaliy mashq tuzing: birinchi 3-4 tasi TO'LIQ YECHIMI bilan, qolganlari mustaqil bajarish uchun (faqat javob, yechimsiz). Aniq raqamlab, o'zbek tilida yozing.`,
  test: (base) => `${base}\n\nShu mavzu bo'yicha 14-16 ta ko'p tanlovli test savoli tuzing (A,B,C,D variantlari bilan). Oxirida "Javoblar kaliti:" deb barcha to'g'ri javoblarni bering. O'zbek tilida, ixcham yozing.`,
};

const ALLOWED_DARAJA = ['Maktab', 'Kollej', "OTM (bakalavriat)"];

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const RATE_LIMIT_MAX = 20; // bitta IP uchun 1 soatda maksimal so'rov soni
const RATE_LIMIT_WINDOW_SECONDS = 3600;

async function checkRateLimit(ip) {
  // Agar Redis hali sozlanmagan bo'lsa, xizmatni to'xtatib qo'ymaymiz —
  // lekin bu holatda cheklov ham ishlamaydi (Upstash qadamini bajarish shart).
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return true;
  try {
    const key = `ratelimit:generate:${ip}`;
    const incrRes = await fetch(`${UPSTASH_URL}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const incrData = await incrRes.json();
    const count = Number(incrData.result);
    if (count === 1) {
      await fetch(`${UPSTASH_URL}/expire/${encodeURIComponent(key)}/${RATE_LIMIT_WINDOW_SECONDS}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    }
    return count <= RATE_LIMIT_MAX;
  } catch (e) {
    return true; // Redis vaqtincha ishlamasa, foydalanuvchini jazolamaymiz
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { type, fan, mavzu, daraja, useSearch } = req.body || {};

  // 1) Faqat 4 ta belgilangan turdan biri bo'lishi mumkin
  if (!PROMPT_TEMPLATES[type]) {
    res.status(400).json({ error: "Noto'g'ri material turi" });
    return;
  }
  // 2) Fan/mavzu bo'sh yoki g'ayritabiiy uzun bo'lmasligi kerak
  if (!fan || !mavzu || typeof fan !== 'string' || typeof mavzu !== 'string') {
    res.status(400).json({ error: 'Fan va mavzu kerak' });
    return;
  }
  if (fan.length > 100 || mavzu.length > 200) {
    res.status(400).json({ error: 'Matn juda uzun' });
    return;
  }
  const safeDaraja = ALLOWED_DARAJA.includes(daraja) ? daraja : 'OTM (bakalavriat)';

  // 3) IP bo'yicha cheklov — bitta manbadan haddan tashqari ko'p so'rovni to'sadi
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    res.status(429).json({ error: "Juda ko'p so'rov yuborildi. Iltimos, birozdan keyin qayta urinib ko'ring." });
    return;
  }

  const base = `Fan: ${fan}. Mavzu: ${mavzu}. Ta'lim darajasi: ${safeDaraja}.`;
  const prompt = PROMPT_TEMPLATES[type](base);

  try {
    const requestBody = {
      // Haiku 4.5 - eng arzon va tez model, bu turdagi vazifalar uchun yetarli.
      model: 'claude-haiku-4-5-20251001',
      max_tokens: useSearch ? 1800 : 1200,
      messages: [{ role: 'user', content: prompt }],
    };

    if (useSearch) {
      requestBody.tools = [{ type: 'web_search_20260209', name: 'web_search' }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({ error: 'AI xizmatida xatolik', detail: errText });
      return;
    }

    const data = await response.json();

    let text = '';
    const sources = new Map();
    for (const block of data.content || []) {
      if (block.type === 'text') {
        text += block.text || '';
        for (const c of block.citations || []) {
          if (c.url && !sources.has(c.url)) {
            sources.set(c.url, c.title || c.url);
          }
        }
      }
    }

    if (sources.size > 0) {
      text += '\n\n---\n\n**Manbalar:**\n';
      for (const [url, title] of sources) {
        text += `- [${title}](${url})\n`;
      }
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
