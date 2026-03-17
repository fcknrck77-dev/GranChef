// Runs the post-build content pipelines by calling the protected cron endpoints.
// Usage:
//   CRON_BASE_URL=https://your-app.example CRON_SECRET=... node scripts/run_cron_tasks.js
// Optional:
//   CRON_AI_LIMIT=10

'use strict';

const baseUrl = (process.env.CRON_BASE_URL || '').replace(/\/+$/, '');
const secret = process.env.CRON_SECRET || '';
const aiLimit = Math.max(1, Math.min(25, Number(process.env.CRON_AI_LIMIT || 10)));

if (!baseUrl) {
  console.error('Missing CRON_BASE_URL');
  process.exit(1);
}
if (!secret) {
  console.error('Missing CRON_SECRET');
  process.exit(1);
}

async function postJson(path) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'x-cron-secret': secret },
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = json?.error || text || `HTTP ${res.status}`;
    throw new Error(`${path} failed: ${msg}`);
  }
  return json ?? { ok: true };
}

async function main() {
  console.log(`[cron] base=${baseUrl}`);
  const engine = await postJson('/api/cron/engine');
  console.log('[cron] engine:', engine);
  const ai = await postJson(`/api/cron/ai-requests?limit=${aiLimit}`);
  console.log('[cron] ai-requests:', ai);
}

main().catch((err) => {
  console.error('[cron] fatal:', err.message || err);
  process.exit(1);
});

