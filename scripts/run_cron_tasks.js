// Runs the post-build content pipelines by calling the protected cron endpoints.
// Usage:
//   CRON_BASE_URL=https://your-app.example CRON_SECRET=... node scripts/run_cron_tasks.js
// Optional:
//   CRON_AI_LIMIT=10

'use strict';

const baseUrl = (process.env.CRON_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');
const secret = process.env.CRON_SECRET || '';
const aiLimit = Math.max(1, Math.min(25, Number(process.env.CRON_AI_LIMIT || 10)));

const isCI = process.env.GITHUB_ACTIONS === 'true';

if (!baseUrl || !secret) {
  console.log('--- CRON CONFIGURATION MISSING ---');
  console.log('CRON_BASE_URL:', baseUrl ? 'SET' : 'MISSING (Fallback to NEXT_PUBLIC_BASE_URL attempted)');
  console.log('CRON_SECRET:', secret ? 'SET' : 'MISSING');
  console.log('----------------------------------');
  
  if (isCI) {
    console.log('[cron] Skipping tasks in CI due to missing configuration. (Exiting with 0 to avoid noise)');
    process.exit(0);
  } else {
    process.exit(1);
  }
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
  const engine = await postJson('/api/cron/engine-cron');
  console.log('[cron] engine:', engine);
  const ai = await postJson(`/api/cron/ai-requests?limit=${aiLimit}`);
  console.log('[cron] ai-requests:', ai);
}

main().catch((err) => {
  console.error('[cron] fatal:', err.message || err);
  process.exit(1);
});

