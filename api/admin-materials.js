// Admin panel uchun: har bir fan+mavzu juftligiga tegishli manba
// materiallarini (docx/pdf/txt) yuklash, ko'rish va o'chirish.
// Bu yerda saqlangan matn keyinchalik api/generate.js tomonidan o'sha
// fan+mavzu uchun material generatsiya qilinganda ASOS sifatida ishlatiladi.

import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const INDEX_KEY = 'materials-index';
// Har bir fan+mavzu uchun saqlanadigan JAMI matn chegarasi (~6-7 ming so'z) —
// generatsiya promptining haddan tashqari uzun bo'lib ketmasligi uchun.
const MAX_TEXT_CHARS = 40000;

export const maxDuration = 60;

function safeEqual(a, b) {
  const strA = String(a || '');
  const strB = String(b || '');
  if (strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i++) diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  return diff === 0;
}

function materialKey(fan, mavzu) {
  return `material:${fan}||${mavzu}`;
}

async function redisGetRaw(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await r.json();
  return data && data.result ? data.result : null;
}

async function redisSetRaw(key, value) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  return true;
}

async function redisSadd(key, member) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  await fetch(`${UPSTASH_URL}/sadd/${encodeURIComponent(key)}/${encodeURIComponent(member)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  return true;
}

async function redisSmembers(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return [];
  const r = await fetch(`${UPSTASH_URL}/smembers/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await r.json();
  return Array.isArray(data.result) ? data.result : [];
}

async function redisSrem(key, member) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  await fetch(`${UPSTASH_URL}/srem/${encodeURIComponent(key)}/${encodeURIComponent(member)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  return true;
}

async function getMaterials(fan, mavzu) {
  const raw = await redisGetRaw(materialKey(fan, mavzu));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

async function saveMaterials(fan, mavzu, arr) {
  await redisSetRaw(materialKey(fan, mavzu), JSON.stringify(arr));
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
    if (action === 'listForTopic') {
      const { fan, mavzu } = req.body || {};
      const materials = await getMaterials(fan, mavzu);
      res.status(200).json({
        materials: materials.map((m) => ({ id: m.id, filename: m.filename, at: m.at, chars: (m.text || '').length })),
      });
      return;
    }

    if (action === 'listAll') {
      const pairs = await redisSmembers(INDEX_KEY);
      const result = [];
      for (const p of pairs) {
        const idx = p.indexOf('||');
        if (idx === -1) continue;
        const fan = p.slice(0, idx);
        const mavzu = p.slice(idx + 2);
        const materials = await getMaterials(fan, mavzu);
        if (materials.length > 0) result.push({ fan, mavzu, count: materials.length });
      }
      res.status(200).json({ items: result });
      return;
    }

    if (action === 'upload') {
      const { fan, mavzu, fileBase64, filename } = req.body || {};
      if (!fan || !mavzu || !fileBase64) {
        res.status(400).json({ error: 'Fan, mavzu va fayl kerak' });
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
        res.status(400).json({ error: "Fayl bo'sh yoki undan matn topilmadi (skanerlangan rasm bo'lishi mumkin — bunday hujjatlar hozircha qo'llab-quvvatlanmaydi)." });
        return;
      }
      const trimmed = text.trim().slice(0, MAX_TEXT_CHARS);
      const materials = await getMaterials(fan, mavzu);
      materials.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        filename: String(filename || 'material').slice(0, 150),
        text: trimmed,
        at: new Date().toISOString(),
      });
      await saveMaterials(fan, mavzu, materials);
      await redisSadd(INDEX_KEY, `${fan}||${mavzu}`);
      res.status(200).json({ ok: true, chars: trimmed.length, truncated: text.trim().length > MAX_TEXT_CHARS });
      return;
    }

    if (action === 'delete') {
      const { fan, mavzu, id } = req.body || {};
      const materials = await getMaterials(fan, mavzu);
      const filtered = materials.filter((m) => m.id !== id);
      await saveMaterials(fan, mavzu, filtered);
      if (filtered.length === 0) await redisSrem(INDEX_KEY, `${fan}||${mavzu}`);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Noma'lum amal" });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi: ' + (e.message || '') });
  }
}
