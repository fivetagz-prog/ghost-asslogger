import { getKV, auth } from './_kv.js';

export default async function handler(req, res) {
  if (!auth(req)) {
    return res.status(401).json({ ok: false, err: 'unauthorized' });
  }

  const kv = await getKV();
  if (!kv) {
    return res.status(200).json({ ok: true, kv: false, count: 0, entries: [] });
  }

  const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 1000);
  const keys = await kv.lrange('logs:all', 0, limit - 1);
  const entries = [];

  for (const k of keys) {
    const v = await kv.get(k);
    if (!v) continue;
    try {
      entries.push(typeof v === 'string' ? JSON.parse(v) : v);
    } catch (e) {}
  }

  entries.sort((a, b) => b.ts - a.ts);

  return res.status(200).json({
    ok: true,
    kv: true,
    count: entries.length,
    entries
  });
}
