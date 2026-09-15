// Promptlar endi FAQAT serverda tuziladi — mijoz (brauzer) tomonidan
// erkin matn (prompt) yuborib bo'lmaydi. Bu API'ni "istalgan narsani yoz"
// vositasiga aylantirib qo'yishning oldini oladi.
//
// Har bir shablon javobni ikki qismga bo'lishni so'raydi:
// "## QISQACHA" — bosh oynada ko'rsatiladigan qisqa, kuchli xulosa
// "## TO'LIQ" — faqat PDF/Word yuklab olishda beriladigan to'liq, ilmiy asoslangan matn

// Barcha matn turlarida BIR XIL LaTeX qoidasi — avvalgi versiyada "mashq" va
// "test" LaTeX'ni taqiqlab, oddiy matnda formula yozishni talab qilardi ("a
// kvadrat + b kvadrat"), bu esa "material"/"slayd" bilan nomuvofiq va o'qishda
// xato/chalkashlikka olib kelardi. Frontend (index.html) barcha turlardagi
// $...$ / $$...$$ ni bir xil KaTeX renderer bilan chizadi, shuning uchun
// LaTeX'ni cheklashning texnik zarurati yo'q edi.
const FORMULA_RULE = `- Matematik formulalar, tenglamalar, matritsalar va ifodalar ALBATTA LaTeX ko'rinishida yozilsin: matn ichidagi kichik ifodalar uchun $...$, alohida qatorga chiqadigan katta formulalar uchun $$...$$. Masalan: $f(x) = 2x + 3$ yoki $$\\frac{a + b}{c} = \\sqrt{x^2 + y^2}$$. Kasr, ildiz, daraja, indeks, integral, yig'indi va matritsalar aynan LaTeX bilan yozilsin — oddiy matnda yozilsa ifoda buziladi.\n- LaTeX faqat formulalar uchun ishlatilsin; oddiy matn ichida $ belgisi ishlatilmasin.`;

// Aniqlikni oshirish uchun: modeldan javob yozishdan oldin faktlarni,
// sana/raqamlarni va formulalarni o'zida ikki marta tekshirishni so'raymiz.
// Bu qo'shimcha API chaqiruvisiz gallyutsinatsiya xavfini kamaytiradi.
const ACCURACY_RULE = `- ANIQLIK MUHIM: har bir faktni, sanani, formulani va sonli qiymatni yozishdan oldin o'zingizda tekshiring. Ishonchingiz komil bo'lmagan ma'lumotni aniq faktdek taqdim etmang — bunday holatda umumiyroq, lekin noto'g'ri bo'lmagan ifoda tanlang.`;

const PROMPT_TEMPLATES = {
  material: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n${FORMULA_RULE}\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n${ACCURACY_RULE}\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMavzuning eng muhim mag'zini 3-4 ta jumlada bering.\n\n## TO'LIQ\nMavzu bo'yicha to'liq ilmiy-nazariy o'quv materialini yozing. Tuzilishi quyidagicha bo'lsin va har bir bo'lim chuqur yoritilsin:\n## Kirish\nMavzuning ilmiy va amaliy ahamiyati, o'rganilish zarurati.\n## Mavzuning nazariy asoslari\nAsosiy ta'riflar, tushunchalar, tarixiy shakllanishi, sohaga qo'shgan olimlar va ularning qarashlari.\n## Asosiy qonuniyatlar va xossalar\nTegishli qoida, teorema yoki tamoyillar hamda ularning izohi va asoslanishi.\n## Ishlangan misollar va tahlil\nKamida uchta batafsil, bosqichma-bosqich yechilgan misol yoki holat tahlili.\n## Amaliy qo'llanilishi\nMavzuning fan, texnika, ta'lim yoki kundalik hayotdagi tatbiqi.\n## Xulosa\nUmumlashtiruvchi mulohazalar.\n\nBarchasi o'zbek tilida.`,
  slayd: (base) => `${base}\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTaqdimotning 3-4 ta asosiy bo'lim nomini ro'yxat qilib bering (tafsilotsiz).\n\n## TO'LIQ\nShu yerga FAQAT JSON obyekt yozing — boshqa matn, izoh yoki markdown belgisi qo'shmang.\n\nTAQDIMOT STANDARTI (qat'iy amal qiling):\n- 6x6 QOIDASI: slaydga chiqadigan har bir punkt KO'PI BILAN 6 TA SO'Z bo'lsin. Bir slaydda ko'pi bilan 6 ta punkt.\n- Punktlar to'liq jumla emas, qisqa tezis ko'rinishida bo'lsin. Masalan: "Kuch massa va tezlanish ko'paytmasi".\n- Har bir slayd uchun "izoh" maydonida esa o'qituvchi og'zaki aytadigan TO'LIQ ilmiy tushuntirish yozilsin (150-250 so'z, uzluksiz nasr). Bu matn slaydga chiqmaydi, ma'ruzachi eslatmalariga joylanadi — shuning uchun u chuqur va asosli bo'lsin.\n- Formulalar LaTeX'da: $...$ yoki $$...$$.\n${ACCURACY_RULE}\n\nJSON tuzilishi aynan quyidagicha:\n{\n"kirish": {"muammo":"Motivatsion savol yoki dolzarb muammo (bir jumla)","faktlar":["qiziqarli fakt, max 6 so'z","yana bir fakt","uchinchi fakt"]},\n"reja": ["reja bandi, max 6 so'z", "..."],\n"natijalar": ["talaba nimani o'zlashtiradi, max 6 so'z", "..."],\n"interaktivSavol": "Aqliy hujum uchun ochiq savol (bir jumla)",\n"bolimlar": [{"sarlavha":"Bo'lim nomi","slaydlar":[{"sarlavha":"Slayd sarlavhasi","punktlar":["max 6 so'z","..."],"izoh":"To'liq og'zaki tushuntirish, 150-250 so'z"}]}],\n"keys": {"vaziyat":"Amaliy holat yoki muammoli vaziyat (2-3 jumla)","savollar":["muhokama savoli","..."]},\n"ekspressTest": [{"savol":"Test savoli","variantlar":["A varianti","B varianti","C varianti","D varianti"],"togri":0}],\n"xulosa": ["asosiy xulosa, max 6 so'z","...","..."],\n"topshiriqlar": ["mustaqil ta'lim vazifasi","..."],\n"rasmSorovlari": ["english image search term","..."]\n}\n\nMIQDOR TALABLARI:\n- "reja": 3-5 ta band. "natijalar": 3-4 ta. "xulosa": ANIQ 3 ta. "topshiriqlar": 2-3 ta.\n- "bolimlar": reja bandlari soniga TENG bo'lsin va ularning sarlavhalari reja bandlari bilan mos kelsin.\n- Har bir bo'limda 2-3 tadan slayd bo'lsin.\n- "ekspressTest": 4-5 ta savol. "togri" — to'g'ri variantning tartib raqami (0 dan boshlanadi).\n- "rasmSorovlari": bo'limlar soniga teng, har biri INGLIZ TILIDA 2-4 so'zli, ko'rgazmali predmetni bildiruvchi qidiruv iborasi (Wikimedia Commons uchun).\n\nBarchasi o'zbek tilida (rasmSorovlari bundan mustasno).`,
  mashq: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n${FORMULA_RULE}\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n${ACCURACY_RULE}\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nMashqlar mavzusi haqida 2-3 jumlali umumiy ta'rif bering.\n\n## TO'LIQ\nAmaliy mashg'ulot uchun to'liq metodik material yozing:\n## Nazariy kirish\nMashqlarni bajarish uchun zarur nazariy asos, ishlatiladigan qoida va formulalar hamda ularning kelib chiqishi.\n## Namunaviy yechimlar\nKamida OLTITA masala. Har biri uchun: masala shartini yozing, so'ng yechimni bosqichma-bosqich bayon eting, har bir qadamda QAYSI qoida yoki teoremaga tayanilayotganini ilmiy asoslab tushuntiring, oxirida javobni HISOBLAB TOPING va uni mustaqil ravishda qayta tekshiring (masalan teskari amal bilan yoki chegaraviy holatni tekshirib) — natija noto'g'ri chiqsa, yechimni qaytadan ko'rib chiqing.\n## Murakkabroq masalalar\nKamida UCHTA chuqurlashtirilgan masala to'liq yechimi va ilmiy izohi bilan.\n## Mustaqil ishlash uchun topshiriqlar\nKamida o'nta topshiriq, har biri uchun faqat javob va qisqa ko'rsatma. Javoblarni ham yechimlarga o'xshab qayta tekshiring.\n## Uslubiy tavsiyalar\nO'qituvchi uchun mashqlarni tashkil etish bo'yicha ko'rsatmalar, tipik xatolar va ularning oldini olish.\n\nBarchasi o'zbek tilida.`,
  test: (base) => `${base}\n\nYOZISH QOIDALARI (qat'iy amal qiling):\n- Matn ILMIY USLUBDA, akademik tilda, uzluksiz nasr ko'rinishida yozilsin — dissertatsiya matni kabi.\n- Bulletli ro'yxat, chiziqcha bilan sanash, jadval va gorizontal chiziqlar ISHLATILMASIN. Fikrlar to'liq abzaslar bilan bayon etilsin.\n${FORMULA_RULE}\n- Har bir abzas kamida 5-7 ta to'liq jumladan iborat bo'lsin.\n- Bo'lim sarlavhalari '## ' bilan boshlansin (ular hujjatda oddiy qalin sarlavhaga aylantiriladi).\n- Ta'riflar aniq, misollar batafsil ishlangan, ilmiy asoslar (qonuniyat, teorema, tamoyil, tadqiqot natijasi) ko'rsatilgan bo'lsin.\n${ACCURACY_RULE}\n- HAR BIR savol uchun to'g'ri javobni belgilashdan oldin, boshqa uchta variant nega noto'g'ri ekanini o'zingizda tekshirib chiqing — faqat bitta variant to'g'ri bo'lishi, qolganlari chindan ham noto'g'ri bo'lishi shart (chalkash yoki ikkilanarli variant qoldirmang).\n- HAJM: TO'LIQ qism kamida 3500 so'zdan iborat bo'lsin (A4 formatda, Times New Roman 14, 1,5 interval bilan taxminan 10-12 bet). Bu majburiy talab — matnni yuzaki qisqartirmang.\n\nJavobingizni ANIQ ikki qismga bo'ling, har biri aynan shu sarlavha bilan boshlansin:\n\n## QISQACHA\nTest mavzusi haqida qisqa umumiy ma'lumot bering.\n\n## TO'LIQ\nTo'liq nazorat materialini yozing:\n## Nazorat materialining maqsadi va tuzilishi\nTestlar qanday bilim va ko'nikmalarni tekshirishi, qiyinlik darajalari bo'yicha taqsimoti.\n## Test topshiriqlari\nKamida 40 ta ko'p tanlovli savol. Har bir savol shu tartibda yozilsin: savol raqami va matni, keyingi qatorlarda A), B), C), D) variantlari.\n## Javoblar kaliti va izohlar\nHar bir savol uchun to'g'ri javobni ko'rsating va NEGA aynan shu javob to'g'ri ekanini ilmiy asoslab, 2-3 jumlada tushuntiring; shuningdek boshqa variantlar nima uchun noto'g'ri ekanini qisqacha izohlang.\n## Baholash mezonlari\nTo'plangan ballarni baholashga aylantirish tartibi va uslubiy izoh.\n\nBarchasi o'zbek tilida.`,
};

// #11: Model nomlari endi environment variable orqali sozlanadi — yangi model
// chiqqanda yoki A/B test qilishda kodni o'zgartirmasdan almashtirish mumkin.
const MODEL_TEXT = process.env.CLAUDE_MODEL_TEXT || 'claude-sonnet-5';
const MODEL_SLIDE = process.env.CLAUDE_MODEL_SLIDE || 'claude-haiku-4-5-20251001';
const MODEL_VERIFY = process.env.CLAUDE_MODEL_VERIFY || 'claude-haiku-4-5-20251001';

// #5: Ilmiy/faktik matn uchun past temperature — gallyutsinatsiya va tasodifiy
// noaniq javoblarni kamaytiradi. "slayd" tuzilgan JSON bo'lgani uchun biroz
// yuqoriroq (formatga zarar bermay, tabiiyroq izohlar yozadi).
const TEMPERATURE_TEXT = 0.3;
const TEMPERATURE_SLIDE = 0.4;

// #7: TO'LIQ qism juda qisqa chiqsa (model "3500 so'z" talabiga rioya
// qilmasa), avtomatik davom ettirish so'raladi. Bu faqat matnli turlar
// (material/mashq/test) uchun — "slayd" JSON hajmi so'z bilan o'lchanmaydi.
const MIN_WORDS_FULL = 2200;
const MAX_CONTINUATIONS = 2;

// Matn generatorlari uchun rasm qidiruv so'zlari ham so'raladi. Ular hujjat
// ichiga rasm fayli emas, serverdagi Wikimedia qidiruviga yuboriladigan kalit
// so'z sifatida qaytariladi.
const IMAGE_QUERY_INSTRUCTION = `\n\nJavobning ENG OXIRIDA alohida \`### Rasm so'rovlari\` sarlavhasini yozing va uning ostida 3 ta qisqa, inglizcha Wikimedia Commons qidiruv iborasini \`- \` bilan bering. Ular ko'rgazmali obyekt yoki jarayonni ifodalasin; rasm URLi yoki izoh yozmang.`;

function extractImageQueries(full, fallback) {
  const marker = /^###\s*Rasm so['’]rovlari\s*$/im;
  const match = marker.exec(full);
  if (!match) return { full, queries: [fallback] };
  const tail = full.slice(match.index + match[0].length);
  const queries = tail.split(/\r?\n/)
    .map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(line => /^[\x00-\x7F]{3,120}$/.test(line))
    .slice(0, 4);
  return { full: full.slice(0, match.index).trim(), queries: queries.length ? queries : [fallback] };
}

// #2: "slayd" javobini JSON'ga aylantirishga urinadi; muvaffaqiyatsiz bo'lsa
// null qaytaradi. Alohida funksiyaga chiqarilgan — shunda birinchi urinish va
// qayta-urinish (retry) bir xil tekshiruv mantig'idan foydalanadi.
function tryParseDeck(full) {
  try {
    const cleaned = String(full || '').replace(/```json\s*|```/g, '').trim();
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!objMatch) return null;
    const parsed = JSON.parse(objMatch[0]);
    if (parsed && Array.isArray(parsed.bolimlar)) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

// #1: Test javoblari kalitini ikkinchi, arzon model bilan tekshiradi.
// Model "OK" desa — hech narsa o'zgarmaydi. Xato topilsa, TUZATILGAN to'liq
// matnni qaytaradi va biz asl "full" o'rniga shuni ishlatamiz. Har qanday
// kutilmagan holatda (tarmoq xatosi, formatga mos kelmaslik) xavfsiz tomonga
// og'amiz — ya'ni asl matnni o'zgartirmay qoldiramiz, xizmat to'xtamaydi.
async function verifyTestAnswers(fullText, callApi) {
  if (!fullText || fullText.length < 100) return { corrected: false, text: fullText };
  const verifyPrompt =
    "Siz test va javoblar kalitini tekshiruvchi ekspertsiz. Quyida tuzilgan test topshiriqlari va ularning javoblar kaliti berilgan. Har bir savolni diqqat bilan tahlil qilib, javoblar kalitidagi javob haqiqatan ham to'g'ri ekanligini tekshiring.\n\n"
    + "Agar BARCHA javoblar to'g'ri bo'lsa, FAQAT bitta so'z bilan javob bering: OK\n\n"
    + "Agar birorta xato topsangiz, matnni BOSHIDAN OXIRIGACHA, faqat xato javob(lar)ni TUZATIB, boshqa hech narsani o'zgartirmasdan to'liq qaytaring — hech qanday qo'shimcha izoh yozmang, faqat tuzatilgan matnni bering.\n\n"
    + "---\n" + fullText;

  try {
    const res = await callApi({
      model: MODEL_VERIFY,
      max_tokens: 16000,
      temperature: 0,
      messages: [{ role: 'user', content: verifyPrompt }],
    });
    if (!res.ok) return { corrected: false, text: fullText };
    const data = await res.json();
    const outText = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('')
      .trim();

    if (!outText) return { corrected: false, text: fullText };
    if (/^ok\.?$/i.test(outText)) return { corrected: false, text: fullText };

    // Model "OK" demasa, lekin javobi g'ayritabiiy qisqa bo'lsa (masalan
    // faqat bitta izoh yozib qo'ygan bo'lsa), buni to'liq matn deb qabul
    // qilmaymiz — xavfsizroq tomonga og'ib, asl matnni saqlaymiz.
    if (outText.length < fullText.length * 0.5) return { corrected: false, text: fullText };

    return { corrected: true, text: outText.replace(/```[a-z]*\s*|```/g, '').trim() };
  } catch (e) {
    return { corrected: false, text: fullText };
  }
}

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

// #8: Citation'lar (web-qidiruv manbalari) orasidan sifat jihatidan shubhali
// domenlarni chetlab o'tamiz — forum/ijtimoiy tarmoq manbalari ilmiy material
// uchun mos emas va noto'g'ri/tekshirilmagan ma'lumot tarqatishi mumkin.
const LOW_QUALITY_DOMAINS = [
  'reddit.com', 'quora.com', 'pinterest.com', 'answers.yahoo.com',
  'facebook.com', 'tiktok.com', 'instagram.com', 'twitter.com', 'x.com',
];
function isLowQualitySource(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return LOW_QUALITY_DOMAINS.some(d => host === d || host.endsWith('.' + d));
  } catch (e) {
    return false;
  }
}

// So'zlarni chamalab hisoblaymiz — markdown belgilari va LaTeX ichidagi
// bo'shliqlar sonni ozroq oshirib yuborishi mumkin, lekin taxminiy chegara
// (MIN_WORDS_FULL) uchun bu yetarli aniqlikda.
function countWords(text) {
  const stripped = String(text || '').replace(/\$\$[\s\S]*?\$\$|\$[^$\n]*?\$/g, ' ');
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

const ALLOWED_DARAJA = ['Maktab', 'Kollej', "OTM (bakalavriat)"];

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// #12: Bir xil fan/mavzu/daraja uchun natijani keshlaymiz — sifat barqaror
// bo'ladi (har safar qaytadan yozilganda tasodifiy farq bo'lmaydi) va
// xarajat/vaqt tejaladi. useSearch=true bo'lganda KESHLANMAYDI, chunki bu
// holatda foydalanuvchi aynan "joriy" ma'lumot kutmoqda — eski keshni
// qaytarish aniqlikka zarar keltiradi.
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 kun

function cacheKeyFor(type, fan, mavzu, daraja) {
  const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  return `gencache:v2:${type}:${norm(fan)}:${norm(mavzu)}:${norm(daraja)}`;
}

async function getCache(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data && data.result ? JSON.parse(data.result) : null;
  } catch (e) {
    return null;
  }
}

async function setCache(key, value) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(
      `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?EX=${CACHE_TTL_SECONDS}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
    );
  } catch (e) {
    // Kesh yozilmasa ham xizmat davom etadi — kesh faqat optimallashtirish
  }
}
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

// #13: Mazmun nazorati — platforma FAQAT ta'lim maqsadlarida ishlatilishi
// kerak. Ikki bosqichli tekshiruv qo'llaniladi:
//  1) Tezkor, bepul kalit-so'z filtri — aniq, shubhasiz holatlarni (pornografik
//     so'rov, portlovchi qurilma tayyorlash va h.k.) API chaqiruvisiz darhol
//     to'xtatadi.
//  2) AI-asoslangan tekshiruv (arzon Haiku modeli) — kontekstni tushunadi,
//     shuning uchun "din tarixi", "urush tarixi", "jinsiy ta'lim (sog'liqni
//     saqlash)" kabi QONUNIY o'quv mavzularini noto'g'ri bloklamaydi, faqat
//     haqiqatan mos kelmaydigan so'rovlarni (masalan zo'ravonlikka chaqiruv,
//     buzg'unchilik targ'iboti) rad etadi.
const BLOCKED_PATTERNS = [
  /porno|pornografiya|seks\s*video|xxx\s*video/i,
  /bomba\s*(tayyorlash|yasash)|portlovchi\s*qurilma\s*(tayyorlash|yasash)/i,
  /explosive\s*device|how to make a bomb/i,
  /giyohvand(lik)?\s*modda\s*(tayyorlash|ishlab chiqarish)/i,
  /terror(izm|chi)\s*(guruhiga qo'shilish|targ'ibot)/i,
];

function quickBlockCheck(fan, mavzu) {
  const combined = `${fan} ${mavzu}`;
  return BLOCKED_PATTERNS.some((re) => re.test(combined));
}

async function postAnthropic(body) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
}

async function moderateTopic(fan, mavzu) {
  const modPrompt = `Siz ta'lim platformasi uchun mazmun nazoratchisisiz. Universitet/kollej/maktab o'qituvchilari uchun dars materiali (matn, taqdimot, mashq yoki test) generatsiya qilinmoqda. Quyidagi fan va mavzu haqiqiy, qonuniy TA'LIM maqsadiga xizmat qiladimi, tekshiring.\n\nFan: "${String(fan).slice(0, 100)}"\nMavzu: "${String(mavzu).slice(0, 200)}"\n\nQuyidagilar RAD ETILISHI kerak: pornografik/jinsiy tarkib yaratishga urinish, zo'ravonlik yoki terrorizmni targ'ib qilish yoki unga o'rgatish, giyohvand modda tayyorlash yo'riqnomasi, nafrat tili yoki kamsitishni targ'ib qilish, qonunga zid harakatlarga (masalan qurol yasash, hujum rejalashtirish) o'rgatish so'ralishi.\n\nE'TIBOR: din tarixi, din falsafasi, diniy ekstremizmga QARSHI kurash, jinsiy ta'lim (sog'liqni saqlash/biologiya doirasida), urush tarixi, huquq va jinoyatchilik nazariyasi kabi mavzular — QONUNIY ilmiy-akademik mavzular, ularni rad ETMANG.\n\nFaqat bitta so'z bilan javob bering: RUXSAT yoki RAD.`;

  try {
    const res = await postAnthropic({
      model: MODEL_VERIFY,
      max_tokens: 8,
      temperature: 0,
      messages: [{ role: 'user', content: modPrompt }],
    });
    if (!res.ok) return true; // nazorat xizmati ishlamasa, xizmat butunlay to'xtab qolmasin
    const data = await res.json();
    const outText = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('')
      .trim()
      .toUpperCase();
    return !outText.startsWith('RAD');
  } catch (e) {
    return true; // texnik xato bo'lsa xizmatni to'xtatib qo'ymaymiz
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

  // #13a: Tezkor, bepul kalit-so'z filtri — aniq holatlarni darhol to'xtatadi
  if (quickBlockCheck(fan, mavzu)) {
    res.status(400).json({
      error: "Bu so'rov platforma qoidalariga mos kelmaydi. Iltimos, o'quv dasturiga oid fan va mavzu kiriting.",
    });
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

  // #13b: AI-asoslangan mazmun nazorati — kontekstni tushunadi, shuning
  // uchun kalit-so'z filtridan o'tib ketishi mumkin bo'lgan, lekin aslida
  // nomaqbul (yashirin/parafraz qilingan) so'rovlarni ham ushlaydi.
  const topicAllowed = await moderateTopic(fan, mavzu);
  if (!topicAllowed) {
    res.status(400).json({
      error: "Bu mavzu ta'lim platformasi qoidalariga mos kelmaydi. Iltimos, o'quv dasturiga oid fan va mavzu kiriting.",
    });
    return;
  }

  const base = `Fan: ${fan}. Mavzu: ${mavzu}. Ta'lim darajasi: ${safeDaraja}.`;
  const prompt = PROMPT_TEMPLATES[type](base) + (type === 'slayd' ? '' : IMAGE_QUERY_INSTRUCTION);

  // 4) #12 Kesh: useSearch=false bo'lgan so'rovlar uchun avval keshni tekshiramiz.
  //    Aynan bir xil fan/mavzu/daraja/tur so'ralganda, avvalgi (allaqachon
  //    yaratilgan) natija qaytariladi — sifat barqarorlashadi, xarajat tushadi.
  const cacheKey = !useSearch ? cacheKeyFor(type, fan, mavzu, safeDaraja) : null;
  if (cacheKey) {
    const cached = await getCache(cacheKey);
    if (cached) {
      const isFree = (DEMO_MODE || isAdmin) ? true : await registerUseAndCheckFree(ip);
      res.status(200).json({ ...cached, isFree, cached: true });
      return;
    }
  }

  try {
    const requestBody = {
      // "slayd" — tuzilgan JSON, tez va arzon Haiku yetarli.
      // Qolgan turlar — 10-12 betlik ilmiy matn, bunda Sonnet sezilarli chuqurroq
      // va ishonchliroq yozadi (narxi va vaqti ham shunga yarasha ortadi).
      model: type === 'slayd' ? MODEL_SLIDE : MODEL_TEXT,
      max_tokens: type === 'slayd' ? 8000 : 16000,
      // #5: past temperature — faktik/ilmiy matnda barqarorlik va aniqlik ustun
      temperature: type === 'slayd' ? TEMPERATURE_SLIDE : TEMPERATURE_TEXT,
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
          // #8: sifat jihatidan shubhali (forum/ijtimoiy tarmoq) manbalarni chetlab o'tamiz
          if (c.url && !sources.has(c.url) && !isLowQualitySource(c.url)) {
            sources.set(c.url, c.title || c.url);
          }
        }
      }
    }

    // #7: Matnli turlarda (slayd bundan mustasno) hajm talabini server
    // tomonda tekshiramiz. Model "kamida 3500 so'z" degan ko'rsatmaga rioya
    // qilmasa, avtomatik ravishda davom ettirishni so'raymiz.
    if (type !== 'slayd') {
      let contGuard = 0;
      while (contGuard < MAX_CONTINUATIONS) {
        const { full: currentFull } = splitSummaryAndFull(text);
        if (countWords(currentFull) >= MIN_WORDS_FULL) break;
        contGuard++;
        // Eslatma: assistant turiga to'liq "text" (hozirgacha yozilgan hamma
        // narsa, oddiy satr sifatida) beramiz — data.content emas, chunki
        // internet-qidiruv "pause_turn" holatida bo'lganda data.content
        // faqat OXIRGI bo'lakni saqlaydi, hammasini emas.
        const contConvo = [
          { role: 'user', content: prompt },
          { role: 'assistant', content: text },
          {
            role: 'user',
            content: "Matningiz talab qilingan hajmdan (kamida 3500 so'z) ancha qisqa chiqdi. '## TO'LIQ' qismini xuddi to'xtagan joyidan, TAKRORLAMASDAN davom ettiring va qolgan bo'limlarni to'liq yozib tugating. Faqat davomini yozing — boshidan boshlamang, avval yozilganlarni qaytarmang.",
          },
        ];
        let contRes;
        try {
          contRes = await callApi({ ...requestBody, messages: contConvo });
        } catch (e) {
          break;
        }
        if (!contRes.ok) break;
        data = await contRes.json();
        for (const block of (data.content || [])) {
          if (block.type === 'text') {
            text += '\n' + (block.text || '');
            for (const c of block.citations || []) {
              if (c.url && !sources.has(c.url) && !isLowQualitySource(c.url)) {
                sources.set(c.url, c.title || c.url);
              }
            }
          }
        }
      }
    }

    let { summary, full } = splitSummaryAndFull(text);
    let documentImageQueries = null;
    if (type !== 'slayd') {
      const extracted = extractImageQueries(full, mavzu);
      full = extracted.full;
      documentImageQueries = extracted.queries;
    }

    // #1: "test" turi uchun — javoblar kalitini ikkinchi (arzon) model bilan
    // tekshiramiz. Model o'zi yozgan javob kaliti xato bo'lishi mumkin
    // (LLM'larda odatiy xato turi); bu qadam shu xavfni kamaytiradi.
    let verified = null;
    if (type === 'test') {
      verified = await verifyTestAnswers(full, callApi);
      if (verified && verified.corrected) {
        full = verified.text;
      }
    }

    // "slayd" turi uchun TO'LIQ qismi JSON bo'lishi kerak — buni
    // pptxgenjs orqali haqiqiy .pptx faylga aylantirish uchun ishlatamiz.
    let deck = null;
    let reja = null;
    let rasmSorovlari = null;
    let deckError = false;
    if (type === 'slayd') {
      deck = tryParseDeck(full);

      // #2: Model noto'g'ri JSON qaytarsa, avval jim tarzda deck=null bo'lib
      // qolardi. Endi bitta qattiqroq ko'rsatma bilan qayta so'raymiz;
      // baribir muvaffaqiyatsiz bo'lsa, foydalanuvchiga aniq xabar beramiz
      // (deckError:true) — frontend buni ko'rsatadi.
      if (!deck) {
        const retryPrompt = prompt + "\n\nDIQQAT: Avvalgi javobingiz yaroqli JSON emas edi. Endi FAQAT va FAQAT yuqorida ko'rsatilgan tuzilishga mos, sintaktik xatosiz JSON obyekt qaytaring — hech qanday izoh, markdown belgisi yoki qo'shimcha matn yozmang.";
        try {
          const retryRes = await callApi({
            model: MODEL_SLIDE,
            max_tokens: 8000,
            temperature: TEMPERATURE_SLIDE,
            messages: [{ role: 'user', content: retryPrompt }],
          });
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            const retryText = (retryData.content || [])
              .filter((b) => b.type === 'text')
              .map((b) => b.text || '')
              .join('');
            const retryParsed = tryParseDeck(retryText);
            if (retryParsed) {
              deck = retryParsed;
              full = retryText;
            }
          }
        } catch (e) {
          // qayta urinish muvaffaqiyatsiz bo'lsa, pastdagi deckError=true bilan davom etamiz
        }
      }

      if (deck) {
        reja = Array.isArray(deck.reja) ? deck.reja : null;
        rasmSorovlari = Array.isArray(deck.rasmSorovlari) ? deck.rasmSorovlari : null;
      } else {
        deckError = true;
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
    const payload = {
      summary,
      full,
      deck,
      reja,
      rasmSorovlari: rasmSorovlari || documentImageQueries,
      deckError,
      verified: type === 'test' ? true : undefined,
    };

    // #12: Faqat muvaffaqiyatli (deck xatosiz) natijalarni keshlaymiz —
    // xato/to'liqsiz natijani keshga solib, keyingi foydalanuvchilarga
    // qaytarish aniqlikka zarar keltiradi.
    if (cacheKey && !deckError) {
      await setCache(cacheKey, payload);
    }

    res.status(200).json({ ...payload, isFree });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
