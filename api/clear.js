import { getKV, auth } from './_kv.js';

export default async function handler(req, res) {
  if (!auth(req)) {
    return res.status(401).json({ ok: false, err: 'unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, err: 'POST only' });
  }

  const kv = await getKV();
  if (!kv) {
    return res.status(200).json({ ok: true, kv: false, removed: 0 });
  }

  const keys = await kv.lrange('logs:all', 0, -1);
  let removed = 0;
  for (const k of keys) {
    try {
      await kv.del(k);
      removed++;
    } catch (e) {}
  }
  await kv.del('logs:all');

  return res.status(200).json({ ok: true, kv: true, removed });
}
