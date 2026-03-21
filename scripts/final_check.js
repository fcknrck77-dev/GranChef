const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Manually load if dotenv missing
if (!process.env.SUPABASE_AI_URL) {
  const fs = require('node:fs');
  const raw = fs.readFileSync('.env.local', 'utf8');
  raw.split('\n').forEach(l => {
    const [k, v] = l.split('=');
    if (k && v) process.env[k.trim()] = v.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  });
}

async function check() {
  const url = process.env.SUPABASE_AI_URL;
  const key = process.env.SUPABASE_AI_SERVICE_KEY;
  console.log('Verifying AI_BRAIN at:', url);
  const client = createClient(url, key);
  const { data, error } = await client.from('culinary_knowledge').select('*').limit(1);
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS: "culinary_knowledge" table is accessible.');
  }
}
check();
