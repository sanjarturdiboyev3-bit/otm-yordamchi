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

SEN OTM O'QITUVCHILARI UCHUN PROFESSIONAL TAQDIMOT DIZAYNERI VA PEDAGOGIK KONTENT MUTAXASSISISAN.

Vazifa: berilgan fan, mavzu va ta'lim darajasi asosida universitet o'qituvchisi foydalanishi mumkin bo'lgan zamonaviy, ilmiy, pedagogik jihatdan asoslangan va vizual jihatdan boy taqdimot rejasini yaratish.

MUHIM:
Bu ma'ruza matni emas. Taqdimotdagi matn qisqa, aniq va vizual material bilan uyg'un bo'lishi kerak. O'qituvchi asosiy mazmunni og'zaki tushuntiradi, slayd esa unga tayanch vazifasini bajaradi.

========================
TAQDIMOT STANDARTLARI
========================

1. Format 16:9 keng ekran formatiga mos bo'lsin.

2. Taqdimot universitetning yagona shabloniga joylashtirishga mos bo'lsin.

3. Sarlavhalar 32-40 pt o'lchamga mos, qisqa va aniq bo'lsin.

4. Asosiy matn 20-24 pt o'lchamga mos bo'lsin. 18 pt dan kichik matn yaratmang.

5. Har bir slaydda maksimal 6 qator asosiy matn bo'lsin.

6. Har bir bullet imkon qadar 6-10 so'zdan oshmasin.

7. Har bir slaydda odatda 3-5 ta bullet bo'lsin.

8. Uzun paragraf, katta matn bloklari va dissertatsiya uslubidagi matn QAT'IYAN TAQIQLANADI.

9. Har bir slayd faqat BITTA asosiy g'oyani ifodalasin.

10. Slayddagi matn qisqa bo'lsin, lekin ilmiy mazmunni yo'qotmasin.

11. Taqdimotning taxminan 40-50 foiz vizual qismi rasm, diagramma, infografika, jadval, sxema, timeline, comparison, ikonka yoki boshqa ko'rgazmali elementlardan iborat bo'lsin.

12. Vizual element faqat bezak uchun ishlatilmasin. U slayddagi fikrni tushuntirishga xizmat qilsin.

13. Mavzuga aloqasiz umumiy "technology", "education", "business" kabi tasodifiy rasmlar tanlanmasin.

14. Mavhum tushunchalar uchun imkon qadar diagramma, sxema, infografika yoki tushunchani ifodalovchi konkret obyekt ishlatilsin.

15. Bir xil rasm yoki bir xil vizual g'oya takrorlanmasin.

16. Zarur joylarda:
- taqqoslash;
- jarayon sxemasi;
- sabab-oqibat diagrammasi;
- klassifikatsiya;
- timeline;
- jadval;
- infografika
ishlatilsin.

17. Taqdimot ilmiy bo'lsin, ammo matnga to'ldirib tashlanmasin.

========================
PEDAGOGIK STRUKTURA
========================

Taqdimot 12-14 ta slayd bo'lsin.

1-slayd:
TITUL.
Fan nomi, mavzu, OTM, kafedra va o'qituvchi F.I.Sh. uchun joy.

2-slayd:
MOTIVATSION KIRISH.
Mavzuning dolzarbligini ochadigan muammoli savol, real vaziyat yoki qiziqarli ilmiy fakt.

3-slayd:
DARS MAQSADI VA KUTILAYOTGAN NATIJALAR.
3-5 ta aniq va o'lchanadigan natija.

4-slayd:
INTERAKTIV KIRISH.
Talabalarni jalb qiladigan savol, mini-so'rov, QR-kod yoki tezkor fikrlash topshirig'i.

5-slayd:
ASOSIY TUSHUNCHA.
Mavzuning asosiy ta'rifi va mohiyati.

6-slayd:
TUZILISHI / TASNIFI.
Mavzuning tarkibiy qismlari, turlari yoki klassifikatsiyasi.

7-slayd:
MEXANIZM / JARAYON.
Mavzu qanday ishlashi yoki qanday amalga oshishini sxema yoki jarayon orqali tushuntirish.

8-slayd:
AMALIY MISOL.
Nazariy tushunchani real vaziyat, misol yoki obyekt orqali ko'rsatish.

9-slayd:
VIZUAL MEDIA.
Mavzuga mos video, animatsiya, demonstratsiya yoki QR havola uchun joy. Video mazmunini aniq tavsiflash.

10-slayd:
AMALIY TAHLIL / KEYS-STADI.
Real yoki realga yaqin vaziyat asosida muammoli topshiriq.

11-slayd:
INTERAKTIV MUSTAHKAMLASH.
3-5 ta ekspress savol, quiz yoki QR orqali test.

12-slayd:
XULOSA.
Mavzuning 3 ta eng muhim g'oyasi.

13-slayd:
MUSTAQIL TA'LIM.
2-3 ta aniq mustaqil topshiriq.

14-slayd:
YAKUNIY SLAYD.
Refleksiya savoli yoki qisqa yakuniy xulosa.

Agar mavzu 14 ta slaydga mos kelmasa, 12-16 oralig'ida optimal son tanlanishi mumkin. Lekin motivatsiya, maqsad, interaktivlik, nazariya, amaliyot, mustahkamlash, xulosa va mustaqil topshiriq elementlari saqlanishi shart.

========================
VIZUAL REJALASHTIRISH
========================

HAR BIR SLAYDDA "visual" OBYEKTI BO'LISHI SHART.

visual.type quyidagi qiymatlardan faqat bittasi bo'lishi mumkin:

"photo"
"diagram"
"infographic"
"table"
"process"
"timeline"
"comparison"
"illustration"
"qr"
"video"
"icons"
"none"

visual.description:
Slaydda qanday vizual bo'lishini O'ZBEK TILIDA aniq tavsiflang.

visual.searchQuery:
Agar real rasm kerak bo'lsa, 2-5 so'zdan iborat INGLIZCHA qidiruv so'rovi yozing.

Agar diagramma, jadval, sxema yoki infografika rasm qidirishdan ko'ra foydaliroq bo'lsa:

"searchQuery": ""

bo'lsin.

RASMLAR UCHUN QOIDALAR:

- Rasm slayd mazmuniga bevosita mos bo'lsin.
- Rasm professional va zamonaviy bo'lsin.
- Rasm mavzuni tushuntirsin.
- Bir xil rasmga olib boradigan qidiruv so'rovlari takrorlanmasin.
- Iloji bo'lsa ochiq litsenziyali yoki Wikimedia Commons kabi manbalardagi materiallarga mos qidiruv so'rovi berilsin.
- Mavzuga mos konkret obyekt yoki hodisa tanlansin.
- "education", "technology", "student" kabi haddan tashqari umumiy qidiruv so'rovlari ishlatilmasin.

========================
SLAYD MAZMUNI
========================

Har bir slayd quyidagi obyektga ega bo'lsin:

{
  "number": 1,
  "section": 1,
  "title": "Slayd sarlavhasi",
  "key": "Slaydning eng muhim g'oyasini ifodalovchi bitta kuchli jumla",
  "bullets": [
    "Qisqa mazmunli fikr",
    "Qisqa mazmunli fikr",
    "Qisqa mazmunli fikr"
  ],
  "visual": {
    "type": "diagram",
    "description": "Mazmunni tushuntiruvchi diagramma tavsifi",
    "searchQuery": ""
  }
}

"key" 12-20 so'zdan iborat bo'lsin.

"key" bulletlarni aynan takrorlamasin. Ularni umumlashtirsin.

Har bir bullet:
- qisqa;
- aniq;
- ilmiy mazmunli;
- bitta fikrni ifodalovchi
bo'lsin.

Har bir slaydda 3-5 ta bullet bo'lsin.

========================
JSON FORMAT
========================

Javobingiz ANIQ ikki qismdan iborat bo'lsin.

## QISQACHA

Taqdimotning 3-4 ta asosiy bo'lim nomini yozing.

## TO'LIQ

FAQAT JSON obyektini yozing.

JSONdan oldin yoki keyin hech qanday izoh, markdown yoki kod belgisi yozmang.

JSON quyidagi strukturaga ega bo'lsin:

{
  "reja": [
    "Birinchi reja bandi",
    "Ikkinchi reja bandi",
    "Uchinchi reja bandi",
    "To'rtinchi reja bandi",
    "Beshinchi reja bandi"
  ],
  "slides": [
    {
      "number": 1,
      "section": 0,
      "title": "Titul slaydi",
      "key": "Taqdimotning asosiy g'oyasini ifodalovchi jumla",
      "bullets": [
        "Fan nomi",
        "Mavzu nomi",
        "O'qituvchi F.I.Sh."
      ],
      "visual": {
        "type": "illustration",
        "description": "Mavzuga mos professional titul vizuali",
        "searchQuery": "specific English search query"
      }
    }
  ]
}

QAT'IY NAZORAT:

- 12-16 ta slayd.
- 1-slayd titul.
- 2-slayd motivatsiya.
- 3-slayd maqsad va natijalar.
- 4-slayd interaktiv kirish.
- 5-8-slaydlar asosiy mazmun.
- 9-slayd media.
- 10-slayd keys-stadi.
- 11-slayd ekspress-test.
- 12-slayd xulosa.
- 13-slayd mustaqil topshiriq.
- 14-slayd yakuniy slayd.
- Har bir slaydda visual obyekti bo'lishi shart.
- Kamida 6 ta slaydda real yoki grafik vizual bo'lishi shart.
- Matn uzun bo'lmasin.
- 6x6 tamoyiliga yaqin ixchamlik saqlansin.
- Ma'ruza matni slaydga ko'chirilmasin.
- Barcha matn o'zbek tilida bo'lsin.
`

${base}`,
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
