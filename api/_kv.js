let cached = null;
let tried = false;

export async function getKV() {
  if (tried) return cached;
  tried = true;
  try {
    const mod = await import('@vercel/kv');
    cached = mod.kv;
  } catch (e) {
    console.error('[kv] unavailable', e && e.message);
    cached = null;
  }
  return cached;
}

export function auth(req) {
  const token =
    (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '') ||
    req.query.token ||
    '';
  return Boolean(process.env.LOG_TOKEN) && token === process.env.LOG_TOKEN;
}
