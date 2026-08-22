export const maxDuration = 300;

const MAX_IMAGES = 3;

function clean(value, max = 140) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function sceneFor(topic, subject, index) {
  const lower = `${topic} ${subject}`.toLowerCase();

  const common = `
Contemporary Uzbek university classroom,
adult university students,
realistic documentary educational photography,
clean modern learning environment,
16:9 landscape composition,
tasteful blue accents,
no logos,
no watermark,
no readable text,
no distorted hands.
`;

  if (/(determinant|matrit|algebra|matemat|tenglama|integral|hosila|geometri)/i.test(lower)) {
    const scenes = [
      `
A university student standing at a large glass whiteboard,
confidently solving a determinant and a 2 by 2 matrix
using neat mathematical symbols,
classmates watching attentively.
`,
      `
A small group of mathematics students discussing a matrix problem
around a table with a tablet, graph paper
and a transparent board with determinant notation.
`,
      `
A lecturer guiding a student through a linear algebra exercise
on an interactive digital board,
matrix grid and geometric vectors visible.
`,
    ];

    return `${scenes[index % scenes.length]}
Topic: ${topic}.
${common}`;
  }

  if (/(tarix|temur|amir temur|temuriy)/i.test(lower)) {
    const scenes = [
      `
A university student presenting the Timurid era to classmates
using a modern projection with Central Asian historical architecture
and a decorative historical map, no readable labels.
`,
      `
Students in a history seminar examining a large historical map
and miniature-style illustrations of the Timurid period,
engaged discussion in a modern classroom.
`,
      `
A lecturer and students studying a digital reconstruction
of Samarkand architecture from the Timurid era.
`,
    ];

    return `${scenes[index % scenes.length]}
Topic: ${topic}.
${common}`;
  }

  if (/(fizik|physics|mexanika|elektr|optik|laborator)/i.test(lower)) {
    const scenes = [
      `
A university physics student in safety glasses performing
an optics laboratory experiment with laser path,
lens and measurement sensors, lecturer observing.
`,
      `
A small team of students assembling an electric circuit
on a laboratory bench with a multimeter,
wires and a modern data display.
`,
      `
A physics student recording measurements from a pendulum experiment
and discussing results with classmates in a bright laboratory.
`,
    ];

    return `${scenes[index % scenes.length]}
Topic: ${topic}.
${common}`;
  }

  const scenes = [
    `
A university student presenting the topic to classmates
beside a modern interactive display with relevant diagrams.
`,
    `
A group of university students collaborating on a practical activity
related to the topic, using notebooks, a tablet and learning materials.
`,
    `
A lecturer mentoring a student during a hands-on
university learning activity related to the topic.
`,
  ];

  return `${scenes[index % scenes.length]}
Topic: ${topic}.
Subject: ${subject}.
${common}`;
}

async function generateOne(prompt) {
  const response = await fetch(
    'https://api.openai.com/v1/images/generations',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1-mini',
        prompt,
        size: '1536x1024',
        quality: 'medium',
        output_format: 'png',
        n: 1,
      }),
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const b64 = data?.data?.[0]?.b64_json;

  return b64 ? `data:image/png;base64,${b64}` : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY sozlanmagan',
    });
  }

  const topic = clean(req.body?.mavzu);
  const subject = clean(req.body?.fan || 'university course');
  const count = Math.min(
    Math.max(Number(req.body?.count) || MAX_IMAGES, 1),
    MAX_IMAGES
  );

  if (!topic) {
    return res.status(400).json({ error: 'Mavzu kerak' });
  }

  try {
    const images = [];

    for (let index = 0; index < count; index++) {
      const data = await generateOne(sceneFor(topic, subject, index));

      if (data) {
        images.push({
          data,
          title: `${topic} — amaliy o'quv sahnasi`,
          credit: 'AI-generated educational visual',
        });
      }
    }

    return res.status(200).json({ images });
  } catch {
    return res.status(200).json({ images: [] });
  }
}
