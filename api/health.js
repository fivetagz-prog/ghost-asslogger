import { getKV } from './_kv.js';

export default async function handler(req, res) {
  const kv = await getKV();
  let entries = 0;
  if (kv) {
    try {
      entries = await kv.llen('logs:all');
    } catch (e) {}
  }

  return res.status(200).json({
    ok: true,
    ts: Date.now(),
    kv: Boolean(kv),
    entries,
    telegram: Boolean(process.env.TG_TOKEN && process.env.TG_CHAT),
    token_set: Boolean(process.env.LOG_TOKEN)
  });
}
