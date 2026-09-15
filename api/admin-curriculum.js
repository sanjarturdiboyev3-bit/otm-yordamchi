// Admin panel uchun: fan/mavzu ro'yxatini (o'quv dasturini) qo'lda
// qo'shish/o'chirish, yoki tayyor hujjat (docx/pdf/txt) yuklab, AI yordamida
// avtomatik ajratib olish.
//
// MUHIM: Vercel loyihasi sozlamalarida ADMIN_PASSWORD o'rnatilgan bo'lishi shart.

import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CURRICULUM_KEY = 'curriculum-map';
const MODEL_VERIFY = process.env.CLAUDE_MODEL_VERIFY || 'claude-haiku-4-5-20251001';

export const maxDuration = 60;

function safeEqual(a, b) {
  const strA = String(a || '');
  const strB = String(b || '');
  if (strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i++) diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  return diff === 0;
}

async function getCurriculum() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return {};
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(CURRICULUM_KEY)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await r.json();
    return data && data.result ? JSON.parse(data.result) : {};
  } catch (e) {
    return {};
  }
}

async function saveCurriculum(map) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    await fetch(
      `${UPSTASH_URL}/set/${encodeURIComponent(CURRICULUM_KEY)}/${encodeURIComponent(JSON.stringify(map))}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function extractText(fileBase64, filename) {
  const buffer = Buffer.from(fileBase64, 'base64');
  const lower = String(filename || '').toLowerCase();
  if (lower.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }
  if (lower.endsWith('.pdf')) {
    const result = await pdfParse(buffer);
    return result.text || '';
  }
  return buffer.toString('utf-8');
}

async function aiParseCurriculum(text) {
  const prompt =
    "Quyida universitet/kollej/maktab o'quv dasturi yoki fanlar ro'yxati hujjatidan olingan matn berilgan. Undan FAN nomlari va har bir fanga tegishli MAVZULAR ro'yxatini ajratib oling.\n\n"
    + "Javobni FAQAT valid JSON ko'rinishida bering, boshqa hech qanday matn, izoh yoki markdown belgisi qo'shmang:\n"
    + '{"Fan nomi": ["Mavzu 1", "Mavzu 2"], "Boshqa fan nomi": ["Mavzu A", "Mavzu B"]}\n\n'
    + "Agar hujjatda mavzular aniq sanab o'tilmagan, faqat fan nomlari bo'lsa, har bir fan uchun eng muhim 5-8 ta mavzuni o'zingiz ilmiy asosda taklif qiling.\n\n"
    + 'Matn:\n' + text.slice(0, 15000);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL_VERIFY,
      max_tokens: 4000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error('AI xatosi: ' + errText.slice(0, 200));
  }
  const data = await res.json();
  const outText = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text || '').join('');
  const cleaned = outText.replace(/```json\s*|```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Javobda JSON topilmadi");
  const parsed = JSON.parse(match[0]);
  // Faqat kutilgan shaklga ({fan: [mavzular]}) mos qismlarni qabul qilamiz
  const clean = {};
  for (const [fan, list] of Object.entries(parsed)) {
    if (typeof fan === 'string' && Array.isArray(list)) {
      clean[fan.trim().slice(0, 100)] = list
        .filter((m) => typeof m === 'string')
        .map((m) => m.trim().slice(0, 200))
        .filter(Boolean);
    }
  }
  return clean;
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
  const { password, action } = req.body || {};
  if (!safeEqual(password, ADMIN_PASSWORD)) {
    res.status(401).json({ error: 'Kirish rad etildi' });
    return;
  }

  try {
    if (action === 'list') {
      res.status(200).json({ curriculum: await getCurriculum() });
      return;
    }

    if (action === 'add') {
      const { fan, mavzu } = req.body || {};
      if (!fan || typeof fan !== 'string' || !fan.trim()) {
        res.status(400).json({ error: 'Fan nomi kerak' });
        return;
      }
      const curriculum = await getCurriculum();
      const fanName = fan.trim().slice(0, 100);
      if (!curriculum[fanName]) curriculum[fanName] = [];
      if (mavzu && typeof mavzu === 'string' && mavzu.trim()) {
        const mavzuName = mavzu.trim().slice(0, 200);
        if (!curriculum[fanName].includes(mavzuName)) curriculum[fanName].push(mavzuName);
      }
      await saveCurriculum(curriculum);
      res.status(200).json({ curriculum });
      return;
    }

    if (action === 'removeMavzu') {
      const { fan, mavzu } = req.body || {};
      const curriculum = await getCurriculum();
      if (curriculum[fan]) curriculum[fan] = curriculum[fan].filter((m) => m !== mavzu);
      await saveCurriculum(curriculum);
      res.status(200).json({ curriculum });
      return;
    }

    if (action === 'removeFan') {
      const { fan } = req.body || {};
      const curriculum = await getCurriculum();
      delete curriculum[fan];
      await saveCurriculum(curriculum);
      res.status(200).json({ curriculum });
      return;
    }

    if (action === 'parseUpload') {
      const { fileBase64, filename } = req.body || {};
      if (!fileBase64) {
        res.status(400).json({ error: 'Fayl kerak' });
        return;
      }
      let text;
      try {
        text = await extractText(fileBase64, filename);
      } catch (e) {
        res.status(400).json({ error: "Fayldan matn ajratib bo'lmadi. .docx, .pdf yoki .txt formatida yuklang." });
        return;
      }
      if (!text || text.trim().length < 20) {
        res.status(400).json({ error: "Fayl bo'sh yoki undan matn topilmadi (skanerlangan rasm bo'lishi mumkin)." });
        return;
      }
      let parsed;
      try {
        parsed = await aiParseCurriculum(text);
      } catch (e) {
        res.status(500).json({ error: "AI orqali tahlil qilishda xatolik: " + (e.message || '') });
        return;
      }
      const curriculum = await getCurriculum();
      for (const [fan, mavzular] of Object.entries(parsed)) {
        if (!curriculum[fan]) curriculum[fan] = [];
        for (const m of mavzular) {
          if (!curriculum[fan].includes(m)) curriculum[fan].push(m);
        }
      }
      await saveCurriculum(curriculum);
      res.status(200).json({ curriculum, added: parsed });
      return;
    }

    res.status(400).json({ error: "Noma'lum amal" });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi: ' + (e.message || '') });
  }
}
