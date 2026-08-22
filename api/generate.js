// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
//
// Har bir shablon javobni ikki qismga bo'lishni so'raydi:
// "## QISQACHA" — bosh oynada ko'rsatiladigan qisqa, kuchli xulosa
// "## TO'LIQ" — faqat PDF/Word yuklab olishda beriladigan to'liq, ilmiy asoslangan matn
const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n- Matematik formulalar, tenglamalar, matritsalar va ifodalar ALBATTA LaTeX ko'rinishida yozilsin: matn ichidagi kichik ifodalar uchun $...$, alohida qatorga chiqadigan katta formulalar uchun $$...$$. Masalan: $f(x) = 2x + 3$ yoki $$\\frac{a + b}{c} = \\sqrt{x^2 + y^2}$$. Kasr, ildiz, daraja, indeks, integral, yig'indi va matritsalar aynan LaTeX bilan yozilsin — oddiy matnda yozilsa ifoda buziladi.\n- LaTeX faqat formulalar uchun ishlatilsin; oddiy matn ichida $ belgisi ishlatilmasin.\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMavzuning eng muhim mag'zini 3-4 ta jumlada bering.\n\n## TO'LIQ\nMavzu bo'yicha to'liq ilmiy-nazariy o'quv materialini yozing. Tuzilishi quyidagicha bo'lsin va har bir bo'lim chuqur yoritilsin:\n## Kirish\nMavzuning ilmiy va amaliy ahamiyati, o'rganilish zarurati.\n## Mavzuning nazariy asoslari\nAsosiy ta'riflar, tushunchalar, tarixiy shakllanishi, sohaga qo'shgan olimlar va ularning qarashlari.\n## Asosiy qonuniyatlar va xossalar\nTegishli qoida, teorema yoki tamoyillar hamda ularning izohi va asoslanishi.\n## Ishlangan misollar va tahlil\nKamida uchta batafsil, bosqichma-bosqich yechilgan misol yoki holat tahlili.\n## Amaliy qo'llanilishi\nMavzuning fan, texnika, ta'lim yoki kundalik hayotdagi tatbiqi.\n## Xulosa\nUmumlashtiruvchi mulohazalar.\n\nBarchasi o'zbek tilida.`,
  slayd: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTaqdimotning 3-4 ta asosiy bo'lim nomini ro'yxat qilib bering (tafsilotsiz).\n\n## TO'LIQ\nShu yerga FAQAT JSON obyekt yozing — boshqa matn, izoh yoki markdown belgisi qo'shmang.\n\nTAQDIMOT STANDARTI (qat'iy amal qiling):\n- 6x6 QOIDASI: slaydga chiqadigan har bir punkt KO'PI BILAN 6 TA SO'Z bo'lsin. Bir slaydda ko'pi bilan 6 ta punkt.\n- Punktlar to'liq jumla emas, qisqa tezis ko'rinishida bo'lsin. Masalan: "Kuch massa va tezlanish ko'paytmasi".\n- Har bir slayd uchun "izoh" maydonida esa o'qituvchi og'zaki aytadigan TO'LIQ ilmiy tushuntirish yozilsin (150-250 so'z, uzluksiz nasr). Bu matn slaydga chiqmaydi, ma'ruzachi eslatmalariga joylanadi — shuning uchun u chuqur va asosli bo'lsin.\n- Formulalar LaTeX'da: $...$ yoki $$...$$.\n\nJSON tuzilishi aynan quyidagicha:\n{\n"kirish": {"muammo":"Motivatsion savol yoki dolzarb muammo (bir jumla)","faktlar":["qiziqarli fakt, max 6 so'z","yana bir fakt","uchinchi fakt"]},\n"reja": ["reja bandi, max 6 so'z", "..."],\n"natijalar": ["talaba nimani o'zlashtiradi, max 6 so'z", "..."],\n"interaktivSavol": "Aqliy hujum uchun ochiq savol (bir jumla)",\n"bolimlar": [{"sarlavha":"Bo'lim nomi","slaydlar":[{"sarlavha":"Slayd sarlavhasi","punktlar":["max 6 so'z","..."],"izoh":"To'liq og'zaki tushuntirish, 150-250 so'z"}]}],\n"keys": {"vaziyat":"Amaliy holat yoki muammoli vaziyat (2-3 jumla)","savollar":["muhokama savoli","..."]},\n"ekspressTest": [{"savol":"Test savoli","variantlar":["A varianti","B varianti","C varianti","D varianti"],"togri":0}],\n"xulosa": ["asosiy xulosa, max 6 so'z","...","..."],\n"topshiriqlar": ["mustaqil ta'lim vazifasi","..."],\n"rasmSorovlari": ["english image search term","..."]\n}\n\nMIQDOR TALABLARI:\n- "reja": 3-5 ta band. "natijalar": 3-4 ta. "xulosa": ANIQ 3 ta. "topshiriqlar": 2-3 ta.\n- "bolimlar": reja bandlari soniga TENG bo'lsin va ularning sarlavhalari reja bandlari bilan mos kelsin.\n- Har bir bo'limda 2-3 tadan slayd bo'lsin.\n- "ekspressTest": 4-5 ta savol. "togri" — to'g'ri variantning tartib raqami (0 dan boshlanadi).\n- "rasmSorovlari": bo'limlar soniga teng, har biri INGLIZ TILIDA 2-4 so'zli, ko'rgazmali predmetni bildiruvchi qidiruv iborasi (Wikimedia Commons uchun).\n\nBarchasi o'zbek tilida (rasmSorovlari bundan mustasno).`,
  mashq: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n- LaTeX belgilari ($, \\frac, \\begin va h.k.) ISHLATILMASIN. Formulalar oddiy matn ko'rinishida yozilsin, masalan: f(x) = 2x + 3, yoki a kvadrat + b kvadrat = c kvadrat.\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMashqlar mavzusi haqida 2-3 jumlali umumiy ta'rif bering.\n\n## TO'LIQ\nAmaliy mashg'ulot uchun to'liq metodik material yozing:\n## Nazariy kirish\nMashqlarni bajarish uchun zarur nazariy asos, ishlatiladigan qoida va formulalar hamda ularning kelib chiqishi.\n## Namunaviy yechimlar\nKamida OLTITA masala. Har biri uchun: masala shartini yozing, so'ng yechimni bosqichma-bosqich bayon eting, har bir qadamda QAYSI qoida yoki teoremaga tayanilayotganini ilmiy asoslab tushuntiring, oxirida javobni va uning to'g'riligini tekshirishni ko'rsating.\n## Murakkabroq masalalar\nKamida UCHTA chuqurlashtirilgan masala to'liq yechimi va ilmiy izohi bilan.\n## Mustaqil ishlash uchun topshiriqlar\nKamida o'nta topshiriq, har biri uchun faqat javob va qisqa ko'rsatma.\n## Uslubiy tavsiyalar\nO'qituvchi uchun mashqlarni tashkil etish bo'yicha ko'rsatmalar, tipik xatolar va ularning oldini olish.\n\nBarchasi o'zbek tilida.`,
  test: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n- LaTeX belgilari ($, \\frac, \\begin va h.k.) ISHLATILMASIN. Formulalar oddiy matn ko'rinishida yozilsin, masalan: f(x) = 2x + 3, yoki a kvadrat + b kvadrat = c kvadrat.\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTest mavzusi haqida qisqa umumiy ma'lumot bering.\n\n## TO'LIQ\nTo'liq nazorat materialini yozing:\n## Nazorat materialining maqsadi va tuzilishi\nTestlar qanday bilim va ko'nikmalarni tekshirishi, qiyinlik darajalari bo'yicha taqsimoti.\n## Test topshiriqlari\nKamida 40 ta ko'p tanlovli savol. Har bir savol shu tartibda yozilsin: savol raqami va matni, keyingi qatorlarda A), B), C), D) variantlari.\n## Javoblar kaliti va izohlar\nHar bir savol uchun to'g'ri javobni ko'rsating va NEGA aynan shu javob to'g'ri ekanini ilmiy asoslab, 2-3 jumlada tushuntiring; shuningdek boshqa variantlar nima uchun noto'g'ri ekanini qisqacha izohlang.\n## Baholash mezonlari\nTo'plangan ballarni baholashga aylantirish tartibi va uslubiy izoh.\n\nBarchasi o'zbek tilida.`,
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

// 10-12 betlik matn generatsiyasi 2-4 daqiqa davom etishi mumkin.
// DIQQAT: 60 soniyadan ortiq chegara Vercel'ning Pro rejasida ishlaydi.
export const maxDuration = 300;

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
      // "slayd" — tuzilgan JSON, tez va arzon Haiku yetarli.
      // Qolgan turlar — 10-12 betlik ilmiy matn, bunda Sonnet sezilarli chuqurroq
      // va ishonchliroq yozadi (narxi va vaqti ham shunga yarasha ortadi).
      model: type === 'slayd' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-5',
      max_tokens: type === 'slayd' ? 8000 : 16000,
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
    let deck = null;
    let reja = null;
    let rasmSorovlari = null;
    if (type === 'slayd') {
      try {
        const cleaned = full.replace(/```json\s*|```/g, '').trim();
        const objMatch = cleaned.match(/\{[\s\S]*\}/);
        if (objMatch) {
          const parsed = JSON.parse(objMatch[0]);
          if (parsed && Array.isArray(parsed.bolimlar)) {
            deck = parsed;
            reja = Array.isArray(parsed.reja) ? parsed.reja : null;
            rasmSorovlari = Array.isArray(parsed.rasmSorovlari) ? parsed.rasmSorovlari : null;
          }
        }
      } catch (e) {
        deck = null; // format buzilgan bo'lsa PPTX tugmasi chiqmaydi
      }

      if (deck) {
        // Ekranda va PDF/Word'da o'qish uchun matn ko'rinishiga aylantiramiz
        let md = '';
        if (deck.kirish) {
          md += '### Kirish\n' + (deck.kirish.muammo || '') + '\n'
             + (deck.kirish.faktlar || []).map(f => '- ' + f).join('\n') + '\n\n';
        }
        if (reja) md += '### Reja\n' + reja.map((r, i) => `${i + 1}. ${r}`).join('\n') + '\n\n';
        if (Array.isArray(deck.natijalar)) md += '### Kutilayotgan natijalar\n' + deck.natijalar.map(n => '- ' + n).join('\n') + '\n\n';
        (deck.bolimlar || []).forEach((b, bi) => {
          md += `### ${bi + 1}. ${b.sarlavha || ''}\n`;
          (b.slaydlar || []).forEach(s => {
            md += `**${s.sarlavha || ''}**\n`
               + (s.punktlar || []).map(p => '- ' + p).join('\n') + '\n'
               + (s.izoh ? s.izoh + '\n' : '') + '\n';
          });
        });
        if (deck.keys) {
          md += '### Amaliy tahlil (keys-stadi)\n' + (deck.keys.vaziyat || '') + '\n'
             + (deck.keys.savollar || []).map(q => '- ' + q).join('\n') + '\n\n';
        }
        if (Array.isArray(deck.xulosa)) md += '### Xulosa\n' + deck.xulosa.map(x => '- ' + x).join('\n') + '\n\n';
        if (Array.isArray(deck.topshiriqlar)) md += '### Mustaqil ta\'lim topshiriqlari\n' + deck.topshiriqlar.map(t => '- ' + t).join('\n') + '\n';
        full = md;

        if (sources.size > 0) {
          full += '\n### Manbalar\n' + Array.from(sources, ([url, title]) => `- ${title} — ${url}`).join('\n');
        }
      } else if (sources.size > 0) {
        full += '\n\n---\n\n**Manbalar:**\n' + Array.from(sources, ([url, title]) => `- [${title}](${url})`).join('\n');
      }
    } else if (sources.size > 0) {
      full += '\n\n---\n\n**Manbalar:**\n' + Array.from(sources, ([url, title]) => `- [${title}](${url})`).join('\n');
    }

    const isFree = (DEMO_MODE || isAdmin) ? true : await registerUseAndCheckFree(ip);
    res.status(200).json({ summary, full, deck, reja, rasmSorovlari, isFree });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
