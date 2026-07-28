// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
//
// Har bir shablon javobni ikki qismga bo'lishni so'raydi:
// "## QISQACHA" — bosh oynada ko'rsatiladigan qisqa, kuchli xulosa
// "## TO'LIQ" — faqat PDF/Word yuklab olishda beriladigan to'liq, ilmiy asoslangan matn
const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nSiz tajribali pedagog va fan mutaxassisisiz. Javobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMavzuning eng muhim mag'zini 3-4 ta jumlada, kuchli va ixcham qilib bering.\n\n## TO'LIQ\nTo'liq, keng qamrovli va ilmiy asoslangan o'quv materiali yozing: (1) mavzuga kirish va ahamiyati, (2) asosiy ta'rif va tushunchalar, (3) kamida ikkita batafsil ishlangan misol, (4) amaliy qo'llanilishi, (5) chuqurroq tushunish uchun qo'shimcha izohlar. Aniq sarlavhalar bilan, batafsil yozing. O'zbek tilida.`,
  slayd: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTaqdimotning 3-4 ta asosiy bo'lim nomini ro'yxat qilib bering (tafsilotsiz).\n\n## TO'LIQ\n9-10 ta slayd rejasini to'liq tuzing. Har bir slayd uchun "Slayd N: Sarlavha" va 3-4 ta qisqa bullet fikr yozing. O'zbek tilida.`,
  mashq: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMashqlar mavzusi haqida 2-3 jumlali umumiy ta'rif bering va namuna sifatida FAQAT bitta oddiy mashq (yechimisiz, faqat savol matni) ko'rsating.\n\n## TO'LIQ\n8-10 ta amaliy mashq tuzing: birinchi 3-4 tasi TO'LIQ YECHIMI bilan, qolganlari mustaqil bajarish uchun (faqat javob, yechimsiz). Aniq raqamlab yozing. O'zbek tilida.`,
  test: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTest mavzusi haqida qisqa umumiy ma'lumot bering va namuna sifatida FAQAT bitta test savolini (A,B,C,D variantlari bilan, javobsiz) ko'rsating.\n\n## TO'LIQ\n14-16 ta ko'p tanlovli test savoli tuzing (A,B,C,D variantlari bilan). Oxirida "Javoblar kaliti:" deb barcha to'g'ri javoblarni bering. O'zbek tilida, ixcham.`,
};

// Modelning javobini "## QISQACHA" va "## TO'LIQ" belgilari bo'yicha ikkiga ajratamiz.
function splitSummaryAndFull(text) {
  const fullMarker = /##\s*TO'LIQ/i;
  const summaryMarker = /##\s*QISQACHA/i;
  const idx = text.search(fullMarker);
  if (idx === -1) {
    // Model belgilangan formatga rioya qilmasa ham, xizmat ishlashda davom etsin —
    // shu holatda boshidan qisqa parcha xulosa sifatida ishlatiladi.
    const plain = text.replace(summaryMarker, '').trim();
    const short = plain.length > 350 ? plain.slice(0, 350).trim() + '…' : plain;
    return { summary: short, full: plain };
  }
  const summary = text.slice(0, idx).replace(summaryMarker, '').trim();
  const full = text.slice(idx).replace(fullMarker, '').trim();
  return { summary, full };
}

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

// Bepul urinishlar hisobi: har bir IP birinchi FREE_QUOTA marta materialni
// to'lovsiz yaratishi va yuklab olishi mumkin, undan keyingilari uchun
// to'lov darvozasi (Click) ko'rsatiladi.
const FREE_QUOTA = 2;
const FREE_QUOTA_TTL_SECONDS = 31536000; // 1 yil — hisoblagich abadiy saqlanib qolmasin

async function registerUseAndCheckFree(ip) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return true; // Redis yo'q bo'lsa, hammasi bepul hisoblanadi
  try {
    const key = `freeuses:${ip}`;
    const incrRes = await fetch(`${UPSTASH_URL}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const incrData = await incrRes.json();
    const count = Number(incrData.result);
    if (count === 1) {
      await fetch(`${UPSTASH_URL}/expire/${encodeURIComponent(key)}/${FREE_QUOTA_TTL_SECONDS}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    }
    return count <= FREE_QUOTA;
  } catch (e) {
    return true;
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
      max_tokens: useSearch ? 2800 : 2200,
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

    const { summary, full } = splitSummaryAndFull(text);
    const isFree = await registerUseAndCheckFree(ip);
    res.status(200).json({ summary, full, isFree });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
