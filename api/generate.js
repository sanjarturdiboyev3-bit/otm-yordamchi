export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    res.status(400).json({ error: 'Prompt kerak' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // Haiku 4.5 - eng arzon va tez model, bu turdagi vazifalar uchun yetarli.
        // Sifatni oshirish kerak bo'lsa "claude-sonnet-5" ga almashtiring (narxi qimmatroq).
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({ error: 'AI xizmatida xatolik', detail: errText });
      return;
    }

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('\n');
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
