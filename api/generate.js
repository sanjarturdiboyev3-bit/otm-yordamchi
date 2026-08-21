// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
//
// Har bir shablon javobni ikki qismga bo'lishni so'raydi:
// "## QISQACHA" — bosh oynada ko'rsatiladigan qisqa, kuchli xulosa
// "## TO'LIQ" — faqat PDF/Word yuklab olishda beriladigan to'liq, ilmiy asoslangan matn
const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n- Matematik formulalar, tenglamalar, matritsalar va ifodalar ALBATTA LaTeX ko'rinishida yozilsin: matn ichidagi kichik ifodalar uchun $...$, alohida qatorga chiqadigan katta formulalar uchun $$...$$. Masalan: $f(x) = 2x + 3$ yoki $$\\frac{a + b}{c} = \\sqrt{x^2 + y^2}$$. Kasr, ildiz, daraja, indeks, integral, yig'indi va matritsalar aynan LaTeX bilan yozilsin — oddiy matnda yozilsa ifoda buziladi.\n- LaTeX faqat formulalar uchun ishlatilsin; oddiy matn ichida $ belgisi ishlatilmasin.\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMavzuning eng muhim mag'zini 3-4 ta jumlada bering.\n\n## TO'LIQ\nMavzu bo'yicha to'liq ilmiy-nazariy o'quv materialini yozing. Tuzilishi quyidagicha bo'lsin va har bir bo'lim chuqur yoritilsin:\n## Kirish\nMavzuning ilmiy va amaliy ahamiyati, o'rganilish zarurati.\n## Mavzuning nazariy asoslari\nAsosiy ta'riflar, tushunchalar, tarixiy shakllanishi, sohaga qo'shgan olimlar va ularning qarashlari.\n## Asosiy qonuniyatlar va xossalar\nTegishli qoida, teorema yoki tamoyillar hamda ularning izohi va asoslanishi.\n## Ishlangan misollar va tahlil\nKamida uchta batafsil, bosqichma-bosqich yechilgan misol yoki holat tahlili.\n## Amaliy qo'llanilishi\nMavzuning fan, texnika, ta'lim yoki kundalik hayotdagi tatbiqi.\n## Xulosa\nUmumlashtiruvchi mulohazalar.\n\nBarchasi o'zbek tilida.`,
  slayd: (base) => `${base}

SIZ UNIVERSITET VA OLIY TA'LIM UCHUN ILMIY TAQDIMOT TAYYORLAYDIGAN PROFESSIONAL AKADEMIK AI YORDAMCHISIZ.

VAZIFA:
Berilgan fan, mavzu va ta'lim darajasi asosida mazmunan to'liq, ilmiy asoslangan, mantiqiy ketma-ketlikka ega bo'lgan taqdimot tuzing.

TAQDIMOTNING ASOSIY TALABI:
Taqdimot mavzuni yuzaki sanab o'tmasligi kerak. Mavzu umumiy tushunchadan boshlab, nazariy asoslar, asosiy qonuniyatlar, tasniflar, mexanizmlar, misollar, amaliy qo'llanish va xulosagacha izchil rivojlantirilishi kerak.

JAVOB FAQAT O'ZBEK TILIDA BO'LSIN.

==================================================
1. TAQDIMOTNING UMUMIY TUZILISHI
==================================================

Taqdimot ANIQ 5 TA asosiy reja bo'limidan tashkil topadi.

Har bir reja bo'limiga ANIQ 3 TADAN SLAYD ajratiladi.

Natijada:

5 ta reja × 3 ta slayd = 15 ta asosiy slayd.

15 ta asosiy slaydning barchasi mazmunan bir-birini to'ldirishi kerak.

Bir xil fikr, ta'rif yoki misolni turli slaydlarda takrorlamang.

Rejalar umumiydan xususiyga, nazariyadan amaliyotga qarab tuzilsin.

==================================================
2. 5 TA REJANI TUZISH QOIDASI
==================================================

5 ta reja quyidagi mantiq asosida tuzilsin:

1-reja — mavzuning umumiy tushunchasi, mohiyati, asosiy ta'riflari va shakllanishi.

2-reja — mavzuning nazariy asoslari, tuzilishi, tarkibiy qismlari, tasnifi yoki asosiy mexanizmlari.

3-reja — mavzuning asosiy qonuniyatlari, tamoyillari, formulalari, teoremalari yoki ilmiy asoslari.

4-reja — mavzuning amaliy qo'llanilishi, usullari, texnologiyalari yoki real jarayonlari.

5-reja — misollar, amaliy masalalar, tahlil, zamonaviy qo'llanish va umumiy xulosa.

Agar mavzuning tabiati bunday tuzilishga to'liq mos kelmasa, shu mantiqni saqlagan holda fan va mavzu xususiyatiga moslashtiring.

==================================================
3. HAR BIR REJA ICHIDAGI 3 TA SLAYD
==================================================

Har bir reja uchun 3 ta slayd bir-birini takrorlamasin.

Birinchi slayd:
— asosiy tushuncha;
— ta'rif;
— mohiyat;
— muhim ilmiy ma'lumot.

Ikkinchi slayd:
— tuzilish;
— tasnif;
— xususiyat;
— mexanizm;
— qonuniyat yoki nazariy asos.

Uchinchi slayd:
— aniq misol;
— amaliy qo'llanish;
— masala;
— real vaziyat;
— tajriba;
— tahlil yoki xulosa.

Mavzuga qarab ushbu tarkibni moslashtirish mumkin, lekin uchta slayd mazmunan farqli bo'lishi shart.

==================================================
4. HAR BIR SLAYD UCHUN TALABLAR
==================================================

Har bir slaydda:

— "section"
— "title"
— "key"
— "bullets"

bo'lishi shart.

Har bir slaydda ANIQ 5 TA bullet bo'lsin.

Har bir bullet to'liq va mazmunli ilmiy jumla bo'lsin.

Har bir bullet taxminan 18–30 ta so'zdan iborat bo'lsin.

Bulletlar oddiy kalit so'zlardan iborat bo'lmasin.

Masalan, quyidagicha yozish TAQIQLANADI:

"Ta'rifi"
"Xususiyatlari"
"Afzalliklari"

Buning o'rniga to'liq mazmunli gap yozilsin.

Har bir bullet mustaqil ilmiy mazmun bersin.

==================================================
5. ILMIYLIK TALABI
==================================================

Ma'lumotlar imkon qadar aniq, ishonchli va ilmiy asoslangan bo'lsin.

Mavzuga tegishli bo'lsa:

— olimlar;
— ilmiy nazariyalar;
— muhim sanalar;
— qonuniyatlar;
— formulalar;
— teoremalar;
— statistik ma'lumotlar;
— terminlar;
— tajribalar;
— real misollar

keltirilsin.

Ammo mavzuga aloqasi bo'lmagan ma'lumotlarni sun'iy ravishda qo'shmang.

Agar formula kerak bo'lsa, uni oddiy matn ko'rinishida yozing.

Masalan:

f(x) = 2x + 3

yoki

a² + b² = c²

LaTeX ishlatmang.

==================================================
6. "KEY" TALABI
==================================================

Har bir slayd uchun "key" maydonida shu slaydning eng muhim ilmiy g'oyasini ifodalovchi BITTA kuchli jumla yozilsin.

"key" 12–20 ta so'zdan iborat bo'lsin.

"key" bulletlarning birortasini aynan takrorlamasin.

U bulletlardagi asosiy fikrlarni umumlashtirsin.

==================================================
7. RASM QIDIRUV SO'ROVLARI
==================================================

"rasmSorovlari" nomli massiv yarating.

Unda ANIQ 5 TA element bo'lsin.

Har bir element tegishli reja bo'limiga mos keladigan rasmni Wikimedia Commons yoki boshqa ishonchli ochiq manbalardan qidirish uchun INGLIZ TILIDAGI 2–5 SO'ZLIK qidiruv so'rovi bo'lsin.

Masalan:

"triangle geometry diagram"

"photosynthesis process diagram"

"artificial intelligence education"

"Newton portrait"

"computer network topology"

Qidiruv so'rovi mavhum emas, iloji boricha ko'rinadigan aniq obyekt yoki jarayonni bildirishi kerak.

Har bir rasm so'rovi tegishli reja bandi bilan bir xil tartibda bo'lsin.

5 ta reja bo'lsa, 5 ta rasm so'rovi bo'lishi shart.

==================================================
8. TAQDIMOT SIFATI
==================================================

Taqdimot:

— ilmiy;
— akademik;
— mantiqiy;
— zamonaviy;
— mazmunan boy;
— takrorlanishsiz;
— ta'lim jarayonida foydalanishga tayyor

bo'lishi kerak.

Mavzuni shunchaki ensiklopedik tarzda sanab o'tmang.

Har bir keyingi slayd oldingi slayddagi bilimni rivojlantirsin.

Tushuncha → nazariya → qonuniyat → misol → amaliyot → xulosa mantiqiy bog'lanishi saqlansin.

==================================================
9. QAT'IYAN TAQIQLANADI
==================================================

— 5 tadan kam yoki ko'p reja tuzish;
— 15 tadan kam yoki ko'p asosiy slayd yaratish;
— bir xil slaydlarni takrorlash;
— bulletlarda faqat 1–2 so'z yozish;
— ilmiy mazmunsiz umumiy gaplarni ko'paytirish;
— mavzuga aloqasiz ma'lumot berish;
— rasm qidiruvlarini o'zbek tilida yozish;
— JSON ichiga izoh qo'shish;
— markdown ishlatish;
— JSON oldidan yoki keyin qo'shimcha matn yozish.

==================================================
10. JAVOB FORMATI
==================================================

Javobingiz ANIQ ikki qismdan iborat bo'lsin.

Birinchi qism:

## QISQACHA

Bu qismda taqdimotning 5 ta asosiy reja nomini qisqa ko'rinishda bering.

Ikkinchi qism:

## TO'LIQ

Bu qismda FAQAT JSON obyekt bo'lsin.

Hech qanday izoh, markdown, ```json yoki boshqa matn yozmang.

JSON quyidagi strukturada bo'lsin:

{
  "reja": [
    "Birinchi reja bandi",
    "Ikkinchi reja bandi",
    "Uchinchi reja bandi",
    "To'rtinchi reja bandi",
    "Beshinchi reja bandi"
  ],
  "rasmSorovlari": [
    "english search query 1",
    "english search query 2",
    "english search query 3",
    "english search query 4",
    "english search query 5"
  ],
  "slides": [
    {
      "section": 1,
      "title": "Slayd sarlavhasi",
      "key": "Slaydning eng muhim ilmiy g'oyasini ifodalovchi jumla.",
      "bullets": [
        "Birinchi to'liq mazmunli ilmiy jumla.",
        "Ikkinchi to'liq mazmunli ilmiy jumla.",
        "Uchinchi to'liq mazmunli ilmiy jumla.",
        "To'rtinchi to'liq mazmunli ilmiy jumla.",
        "Beshinchi to'liq mazmunli ilmiy jumla."
      ]
    }
  ]
}

MUHIM:

"slides" massivida ANIQ 15 TA obyekt bo'lsin.

section qiymatlari reja tartibiga mos ravishda:

1, 1, 1,
2, 2, 2,
3, 3, 3,
4, 4, 4,
5, 5, 5

ko'rinishida bo'lsin.

Har bir obyekt ichida:

"title" — noyob slayd sarlavhasi;

"key" — 12–20 so'zli asosiy g'oya;

"bullets" — ANIQ 5 TA to'liq ilmiy jumla.

bo'lishi shart.

JSON sintaktik jihatdan to'g'ri bo'lsin.

JSON ichida ortiqcha vergul bo'lmasin.

Barchasi o'zbek tilida bo'lsin.`,
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
    let slides = null;
    let reja = null;
    let rasmSorovlari = null;
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
            rasmSorovlari = Array.isArray(parsed.rasmSorovlari) ? parsed.rasmSorovlari : null;
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
    res.status(200).json({ summary, full, slides, reja, rasmSorovlari, isFree });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
