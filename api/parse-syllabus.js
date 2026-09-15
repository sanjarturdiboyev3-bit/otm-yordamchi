const MAX_FILE_SIZE = 6 * 1024 * 1024;
const MAX_TEXT_LENGTH = 120000;

function cleanText(value) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Faqat POST so‘roviga ruxsat berilgan.'
    });
  }

  try {
    const { fileName, mimeType, fileBase64 } = req.body || {};

    if (!fileName || !fileBase64) {
      return res.status(400).json({
        error: 'O‘quv dasturi fayli yuborilmadi.'
      });
    }

    const safeFileName = String(fileName).slice(0, 180);
    const extension = safeFileName
      .split('.')
      .pop()
      .toLowerCase();

    const allowedExtensions = ['pdf', 'docx'];

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        error: 'Faqat PDF yoki DOCX fayl yuklash mumkin.'
      });
    }

    const buffer = Buffer.from(fileBase64, 'base64');

    if (!buffer.length) {
      return res.status(400).json({
        error: 'Yuklangan fayl bo‘sh.'
      });
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(413).json({
        error: 'Fayl hajmi 6 MB dan oshmasligi kerak.'
      });
    }

    let extractedText = '';

    if (extension === 'pdf') {
      const pdfModule = await import('pdf-parse');
      const pdfParse = pdfModule.default || pdfModule;
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text || '';
    }

    if (extension === 'docx') {
      const mammothModule = await import('mammoth');
      const mammoth = mammothModule.default || mammothModule;
      const parsed = await mammoth.extractRawText({ buffer });
      extractedText = parsed.value || '';
    }

    extractedText = cleanText(extractedText);

    if (extractedText.length < 100) {
      return res.status(422).json({
        error:
          'Fayldan yetarli matn aniqlanmadi. PDF skanerlangan rasm ko‘rinishida bo‘lishi mumkin.'
      });
    }

    return res.status(200).json({
      ok: true,
      fileName: safeFileName,
      mimeType: String(mimeType || ''),
      characterCount: extractedText.length,
      text: extractedText.slice(0, MAX_TEXT_LENGTH)
    });
  } catch (error) {
    console.error('O‘quv dasturini o‘qish xatosi:', error);

    return res.status(500).json({
      error: 'O‘quv dasturini o‘qishda server xatosi yuz berdi.'
    });
  }
}
