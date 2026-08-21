// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
//
// Har bir shablon javobni ikki qismga bo'lishni so'raydi:
// "## QISQACHA" — bosh oynada ko'rsatiladigan qisqa, kuchli xulosa
// "## TO'LIQ" — faqat PDF/Word yuklab olishda beriladigan to'liq, ilmiy asoslangan matn
const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nSiz tajribali pedagog va fan mutaxassisisiz. Javobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMavzuning eng muhim mag'zini 3-4 ta jumlada, kuchli va ixcham qilib bering.\n\n## TO'LIQ\nTo'liq, keng qamrovli va ilmiy asoslangan o'quv materiali yozing: (1) mavzuga kirish va ahamiyati, (2) asosiy ta'rif va tushunchalar, (3) kamida ikkita batafsil ishlangan misol, (4) amaliy qo'llanilishi, (5) chuqurroq tushunish uchun qo'shimcha izohlar. Aniq sarlavhalar bilan, batafsil yozing. O'zbek tilida.`,
  slayd: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTaqdimotning 3-4 ta asosiy bo'lim nomini ro'yxat qilib bering (tafsilotsiz).\n\n## TO'LIQ\nShu yerga FAQAT JSON obyekt yozing, boshqa hech qanday matn, izoh yoki markdown belgisi qo'shmang.\n\nTuzilma quyidagicha bo'lsin:\n1) "reja" — mavzuni TO'LIQ yorituvchi 5 ta reja bandi (qisqa sarlavha ko'rinishida, mantiqiy ketma-ketlikda: umumiydan xususiyga).\n2) "slides" — har bir reja bandi uchun ANIQ 3 tadan slayd, ya'ni jami 15 ta slayd. Har bir slaydda "section" (reja bandi tartib raqami, 1 dan boshlanadi), "title" (shu slaydning o'z sarlavhasi), "bullets" va "key" bo'lsin.\n\n"key" — shu slaydning eng muhim mag'zi: bitta yodda qoladigan, kuchli jumla (12-20 so'z). U bulletlardagi jumlani AYNAN takrorlamasin, balki ularni umumlashtirsin.\n\nMUHIM talablar:\n- Har bir slaydda 5-6 ta bullet bo'lsin va har bir bullet TO'LIQ, mazmunli jumla bo'lsin (30-45 so'z) — quruq bir-ikki so'zli ibora emas. Slayd matni to'yingan va mazmunga boy bo'lishi shart.\n- Bulletlar nazariy jihatdan asosli bo'lsin: ta'riflar, sabab-oqibat, tasnif, muhim sana/raqamlar, olimlar nomi, formulalar yoki aniq misollar bilan to'ldirilsin.\n- Bir reja bandiga tegishli 3 ta slayd bir-birini takrorlamasin: masalan 1-slayd tushuncha va ta'rif, 2-slayd tuzilishi/tasnifi yoki mexanizmi, 3-slayd misol va amaliy ahamiyati.\n\nFormat aniq shunday bo'lsin:\n{"reja":["Birinchi reja bandi","Ikkinchi reja bandi"],"slides":[{"section":1,"title":"Slayd sarlavhasi","key":"Eng muhim mag'zi bitta jumlada","bullets":["to'liq jumla 1","to'liq jumla 2","to'liq jumla 3","to'liq jumla 4"]}]}\n\nBarchasi o'zbek tilida yozilsin.`,
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
// ==== DEMO REJIMI ====
// true bo'lsa: to'lov so'ralmaydi, hamma material bepul yuklab olinadi.
// Namoyish tugagach, buni false ga o'zgartiring — to'lov tizimi qayta ishlaydi.
const DEMO_MODE = true;

const RATE_LIMIT_MAX = 40; // bitta IP uchun 1 soatda maksimal so'rov soni
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

// Internet qidiruvi bilan javob sekinroq keladi — standart 10 soniya yetmasligi mumkin.
export const maxDuration = 60;

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

  // Sinov/rivojlantirish uchun: ADMIN_BYPASS_IPS ro'yxatidagi IP manzillar
  // rate-limit va bepul-urinish cheklovidan mustasno. Bu FAQAT serverda
  // saqlanadi (Vercel environment variable) — brauzer kodida hech qachon
  // ko'rinmaydi, shuning uchun uni topib, to'lovni chetlab o'tib bo'lmaydi.
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const adminIps = String(process.env.ADMIN_BYPASS_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
  const isAdmin = adminIps.includes(ip);

  // 3) IP bo'yicha cheklov — bitta manbadan haddan tashqari ko'p so'rovni to'sadi
  if (!isAdmin) {
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      res.status(429).json({ error: "Juda ko'p so'rov yuborildi. Iltimos, birozdan keyin qayta urinib ko'ring." });
      return;
    }
  }

  const base = `Fan: ${fan}. Mavzu: ${mavzu}. Ta'lim darajasi: ${safeDaraja}.`;
  const prompt = PROMPT_TEMPLATES[type](base);

  try {
    const requestBody = {
      // Haiku 4.5 - eng arzon va tez model, bu turdagi vazifalar uchun yetarli.
      model: 'claude-haiku-4-5-20251001',
      max_tokens: type === 'slayd' ? 8000 : (useSearch ? 2800 : 2200),
      messages: [{ role: 'user', content: prompt }],
    };

    if (useSearch) {
      // web_search_20250305 — mustaqil ishlaydigan versiya.
      // (Yangiroq web_search_20260209 o'zi bilan birga code_execution talab qiladi,
      //  shuning uchun bu yerda ishlatilmaydi.)
      // max_uses — qidiruvlar sonini cheklaydi: xarajat va kutish vaqtini tiyadi.
      requestBody.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }];
    }

    const callApi = (body) => fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    let response = await callApi(requestBody);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API xatosi:', response.status, errText);
      res.status(500).json({
        error: useSearch
          ? "Internetdan qidirishda xatolik. Belgini o'chirib qayta urinib ko'ring."
          : 'AI xizmatida xatolik',
        detail: errText,
      });
      return;
    }

    let data = await response.json();
    const allBlocks = [...(data.content || [])];

    // Server vositalari (internet qidiruvi) ishlaganda API javobni "pauza"
    // holatida qaytarishi mumkin — bunda suhbatni davom ettirish kerak,
    // aks holda javob chala bo'lib qoladi.
    let guard = 0;
    const convo = [{ role: 'user', content: prompt }];
    while (data.stop_reason === 'pause_turn' && guard < 3) {
      guard++;
      convo.push({ role: 'assistant', content: data.content });
      response = await callApi({ ...requestBody, messages: convo });
      if (!response.ok) break;
      data = await response.json();
      allBlocks.push(...(data.content || []));
    }

    let text = '';
    const sources = new Map();
    for (const block of allBlocks) {
      if (block.type === 'text') {
        text += block.text || '';
        for (const c of block.citations || []) {
          if (c.url && !sources.has(c.url)) {
            sources.set(c.url, c.title || c.url);
          }
        }
      }
    }

    let { summary, full } = splitSummaryAndFull(text);

    // "slayd" turi uchun TO'LIQ qismi JSON bo'lishi kerak — buni
    // pptxgenjs orqali haqiqiy .pptx faylga aylantirish uchun ishlatamiz.
    let slides = null;
    let reja = null;
    if (type === 'slayd') {
      try {
        const cleaned = full.replace(/```json\s*|```/g, '').trim();
        // Yangi format — {reja:[...], slides:[...]}; eskisi — oddiy massiv.
        const objMatch = cleaned.match(/\{[\s\S]*\}/);
        const arrMatch = cleaned.match(/\[[\s\S]*\]/);
        if (objMatch) {
          const parsed = JSON.parse(objMatch[0]);
          if (Array.isArray(parsed.slides)) {
            slides = parsed.slides;
            reja = Array.isArray(parsed.reja) ? parsed.reja : null;
          }
        }
        if (!slides && arrMatch) {
          const parsed = JSON.parse(arrMatch[0]);
          if (Array.isArray(parsed)) slides = parsed;
        }
      } catch (e) {
        slides = null; // model formatga rioya qilmasa, PPTX tugmasi shunchaki chiqmaydi
      }

      if (slides) {
        if (sources.size > 0) {
          slides.push({
            title: 'Manbalar',
            bullets: Array.from(sources, ([url, title]) => `${title} — ${url}`),
          });
        }
        // PDF/Word uchun ham o'qish mumkin bo'lgan ko'rinishga aylantiramiz
        let md = '';
        if (reja && reja.length) {
          md += '### Reja\n' + reja.map((r, i) => `${i + 1}. ${r}`).join('\n') + '\n\n';
        }
        md += slides.map((s, i) => `### Slayd ${i + 1}: ${s.title || ''}\n` + (s.bullets || []).map(b => `- ${b}`).join('\n')).join('\n\n');
        full = md;
      } else if (sources.size > 0) {
        full += '\n\n---\n\n**Manbalar:**\n' + Array.from(sources, ([url, title]) => `- [${title}](${url})`).join('\n');
      }
    } else if (sources.size > 0) {
      full += '\n\n---\n\n**Manbalar:**\n' + Array.from(sources, ([url, title]) => `- [${title}](${url})`).join('\n');
    }

    const isFree = (DEMO_MODE || isAdmin) ? true : await registerUseAndCheckFree(ip);
    res.status(200).json({ summary, full, slides, reja, isFree });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
