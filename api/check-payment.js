const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const url = `${UPSTASH_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

export default async function handler(req, res) {
  const orderId = req.query.order;
  if (!orderId) {
    return res.status(400).json({ error: "order parametri kerak" });
  }

  try {
    const record = await redisGet(`click:${orderId}`);
    const paid = !!(record && record.status === 'paid');
    return res.status(200).json({ paid });
  } catch (e) {
    return res.status(500).json({ error: 'Tekshirishda xatolik', paid: false });
  }
}
