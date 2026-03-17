/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

async function main() {
  loadDotEnvLocal();
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL');
  if (!anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const anonClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const adminClient = service
    ? createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

  const anonCourses = await anonClient.from('courses').select('id').limit(1);
  if (anonCourses.error) {
    console.log('Anon SELECT courses: FAIL');
    console.log(String(anonCourses.error.message || anonCourses.error));
  } else {
    console.log(`Anon SELECT courses: OK (rows=${(anonCourses.data || []).length})`);
  }

  const anonIngredients = await anonClient.from('ingredients').select('id').limit(1);
  if (anonIngredients.error) {
    console.log('Anon SELECT ingredients: FAIL');
    console.log(String(anonIngredients.error.message || anonIngredients.error));
  } else {
    console.log(`Anon SELECT ingredients: OK (rows=${(anonIngredients.data || []).length})`);
  }

  const anonTechniques = await anonClient.from('techniques').select('id').limit(1);
  if (anonTechniques.error) {
    console.log('Anon SELECT techniques: FAIL');
    console.log(String(anonTechniques.error.message || anonTechniques.error));
  } else {
    console.log(`Anon SELECT techniques: OK (rows=${(anonTechniques.data || []).length})`);
  }

  if (!adminClient) {
    console.log('Service SELECT app_users: SKIP (missing SUPABASE_SERVICE_ROLE_KEY)');
  } else {
    const adminUsers = await adminClient.from('app_users').select('id').limit(1);
    if (adminUsers.error) {
      console.log('Service SELECT app_users: FAIL');
      console.log(String(adminUsers.error.message || adminUsers.error));
    } else {
      console.log(`Service SELECT app_users: OK (rows=${(adminUsers.data || []).length})`);
    }
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error('Check failed:', e?.message || e);
  process.exit(1);
});
