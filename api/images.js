// Wikimedia Commons'dan bepul rasmlarni izlab, base64 ko'rinishida qaytaradi.
// Rasmlar brauzerda emas, serverda yuklab olinadi — bu CORS muammosini butunlay chetlab o'tadi.
//
// DIQQAT (litsenziya): Commons rasmlari erkin litsenziyalarda bo'lsa-da, aksariyati
// muallif va litsenziya ko'rsatilishini talab qiladi. Shuning uchun har bir rasm bilan
// birga muallif/litsenziya matni qaytariladi va taqdimot slaydida ko'rsatiladi.

export const maxDuration = 60;

const UA = 'OqituvchiYordamchisi/1.0 (https://otm-yordamchi.vercel.app)';
const MAX_QUERIES = 8;
const THUMB_WIDTH = 900;
const MAX_BYTES = 900 * 1024; // bitta rasm uchun yuqori chegara

// HTML teglarni tozalaydi (extmetadata qiymatlari HTML bo'lib keladi)
function stripHtml(s) {
  return String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function searchOne(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',       // 6 — fayllar fazosi
    gsrlimit: '6',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime|size',
    iiurlwidth: String(THUMB_WIDTH),
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  // Nomzodlarni saralaymiz: faqat rastr rasmlar, gerb/bayroq/logotip kabilarni chetlab o'tamiz
  const candidates = Object.values(pages)
    .map((p) => ({ title: p.title || '', info: (p.imageinfo || [])[0] }))
    .filter((c) => c.info && /^image\/(jpeg|png)$/.test(c.info.mime || ''))
    .filter((c) => !/\b(logo|coat of arms|flag|icon|map of|signature|seal)\b/i.test(c.title))
    .filter((c) => (c.info.width || 0) >= 400);

  for (const c of candidates) {
    const src = c.info.thumburl || c.info.url;
    if (!src) continue;
    try {
      const imgRes = await fetch(src, { headers: { 'User-Agent': UA } });
      if (!imgRes.ok) continue;
      const buf = Buffer.from(await imgRes.arrayBuffer());
      if (buf.length > MAX_BYTES) continue;
      const mime = imgRes.headers.get('content-type') || c.info.mime || 'image/jpeg';
      const meta = c.info.extmetadata || {};
      const author = stripHtml(meta.Artist?.value) || 'Noma\u2019lum muallif';
      const license = stripHtml(meta.LicenseShortName?.value) || 'Wikimedia Commons';
      return {
        data: `data:${mime};base64,${buf.toString('base64')}`,
        credit: `${author} \u00b7 ${license} \u00b7 Wikimedia Commons`,
        title: c.title.replace(/^File:/, ''),
      };
    } catch (e) {
      // keyingi nomzodga o'tamiz
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { queries } = req.body || {};
  if (!Array.isArray(queries) || queries.length === 0) {
    res.status(400).json({ error: 'queries massivi kerak' });
    return;
  }

  const list = queries.slice(0, MAX_QUERIES).map((q) => {
  if (q && typeof q === 'object') {
    return [q.query, ...(Array.isArray(q.fallback) ? q.fallback : [])]
      .map(v => String(v || '').trim().slice(0, 120))
      .filter(Boolean)
      .slice(0, 3);
  }

  return [String(q || '').trim().slice(0, 120)].filter(Boolean);
});

  try {
    // Parallel izlaymiz — ketma-ket qilinsa juda sekin bo'lardi
    const results = await Promise.all(
      list.map(async (alternatives) => {
  for (const query of alternatives) {
    const image = await searchOne(query).catch(() => null);
    if (image) return image;
  }

  return null;
})
    );
    res.status(200).json({ images: results });
  } catch (e) {
    // Rasm topilmasligi taqdimotni buzmasligi kerak — bo'sh ro'yxat qaytaramiz
    res.status(200).json({ images: list.map(() => null) });
  }
}
