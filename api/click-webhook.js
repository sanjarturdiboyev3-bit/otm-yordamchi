import crypto from 'crypto';

const SERVICE_ID = process.env.CLICK_SERVICE_ID;
const SECRET_KEY = process.env.CLICK_SECRET_KEY;
const EXPECTED_AMOUNT = 4990;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

async function redisSet(key, value, exSeconds) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  const url = `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encoded}${exSeconds ? `?EX=${exSeconds}` : ''}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error('Redis SET muvaffaqiyatsiz');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: -1, error_note: 'Faqat POST' });
  }

  const body = req.body || {};
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    sign_time,
    sign_string,
    merchant_prepare_id,
    error: clickError,
  } = body;

  // 1) service_id tekshiruvi
  if (String(service_id) !== String(SERVICE_ID)) {
    return res.status(200).json({ error: -1, error_note: "SERVICE_ID noto'g'ri" });
  }

  const actionNum = Number(action);

  // 2) Imzoni tekshirish (rasmiy Click hujjatidagi formula bo'yicha)
  const expectedSign = actionNum === 0
    ? md5(`${click_trans_id}${service_id}${SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`)
    : md5(`${click_trans_id}${service_id}${SECRET_KEY}${merchant_trans_id}${merchant_prepare_id}${amount}${action}${sign_time}`);

  if (expectedSign !== sign_string) {
    return res.status(200).json({ error: -1, error_note: "SIGN CHECK FAILED" });
  }

  // 3) Summani tekshirish — hozircha barcha materiallar 4990 so'm
  if (Math.abs(Number(amount) - EXPECTED_AMOUNT) > 0.01) {
    return res.status(200).json({ error: -2, error_note: "Summa noto'g'ri" });
  }

  try {
    if (actionNum === 0) {
      // ===== PREPARE =====
      const merchantPrepareId = Date.now();
      await redisSet(`click:${merchant_trans_id}`, {
        status: 'prepared',
        click_trans_id,
        amount,
      }, 3600); // 1 soat ichida to'lanishi kerak

      return res.status(200).json({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: merchantPrepareId,
        error: 0,
        error_note: 'Success',
      });
    }

    if (actionNum === 1) {
      // ===== COMPLETE =====
      if (Number(clickError) < 0) {
        await redisSet(`click:${merchant_trans_id}`, { status: 'cancelled' }, 3600);
        return res.status(200).json({
          click_trans_id,
          merchant_trans_id,
          merchant_confirm_id: null,
          error: clickError,
          error_note: 'Cancelled',
        });
      }

      await redisSet(`click:${merchant_trans_id}`, {
        status: 'paid',
        click_trans_id,
        amount,
        paidAt: Date.now(),
      }, 86400); // 24 soat davomida "to'langan" holatini eslab qoladi

      return res.status(200).json({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: Date.now(),
        error: 0,
        error_note: 'Success',
      });
    }

    return res.status(200).json({ error: -3, error_note: "action noto'g'ri" });
  } catch (e) {
    return res.status(200).json({ error: -7, error_note: 'Ichki xatolik: ' + e.message });
  }
}
