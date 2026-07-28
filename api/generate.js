export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, useSearch } = req.body || {};
  if (!prompt) {
    res.status(400).json({ error: 'Prompt kerak' });
    return;
  }

  try {
    const requestBody = {
      // Haiku 4.5 - eng arzon va tez model, bu turdagi vazifalar uchun yetarli.
      // Sifatni oshirish kerak bo'lsa "claude-sonnet-5" ga almashtiring (narxi qimmatroq).
      model: 'claude-haiku-4-5-20251001',
      max_tokens: useSearch ? 1800 : 1200,
      messages: [{ role: 'user', content: prompt }],
    };

    // Ixtiyoriy: internetdan qo'shimcha/joriy ma'lumot izlash.
    // DIQQAT: har bir qidiruv qo'shimcha xarajat qiladi (~$10/1000 qidiruv),
    // shuning uchun faqat foydalanuvchi checkbox orqali so'raganda yoqiladi.
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

    // Barcha matn bloklarini birlashtiramiz (qidiruv ishlatilganda bir nechta
    // blok bo'lishi mumkin) va ichidagi manba havolalarini (citations) yig'ib olamiz.
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

    // Anthropic siyosatiga ko'ra: qidiruv natijalari ko'rsatilsa, manba havolalari
    // ham ko'rsatilishi kerak.
    if (sources.size > 0) {
      text += '\n\n---\n\n**Manbalar:**\n';
      for (const [url, title] of sources) {
        text += `- [${title}](${url})\n`;
      }
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
