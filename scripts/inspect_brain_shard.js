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
    let val = trimmed.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    
    if (key) {
      process.env[key] = val;
    }
  }
}

async function main() {
  loadDotEnvLocal();
  const url = process.env.SUPABASE_AI_URL;
  const key = process.env.SUPABASE_AI_SERVICE_KEY;

  console.log('--- Inspecting AI_BRAIN Shard ---');
  console.log(`URL: ${url ? (url.startsWith('http') ? 'VALID_URL' : 'INVALID_OR_JWT') : 'MISSING'}`);
  
  if (!url || !key || !url.startsWith('http')) {
      console.error('Final URL check failed. Missing or invalid URL.');
      process.exit(1);
  }

  const client = createClient(url, key);

  const tables = ['ingredients', 'techniques', 'recipes', 'culinary_knowledge'];
  for (const table of tables) {
    try {
      const { data, error, count } = await client.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`Table "${table}": NOT FOUND or ERROR (${error.message})`);
      } else {
        console.log(`Table "${table}": OK (count=${count})`);
      }
    } catch (e) {
      console.log(`Table "${table}": EXCEPTION (${e.message})`);
    }
  }
}

main();
