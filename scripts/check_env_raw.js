const fs = require('fs');
const path = require('path');

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('No .env.local found');
    return;
  }
  const raw = fs.readFileSync(envPath);
  console.log('Buffer hex (first 20 bytes):', raw.slice(0, 20).toString('hex'));
  
  const text = raw.toString('utf8');
  console.log('Text preview (first 100 chars):', JSON.stringify(text.slice(0, 100)));
  
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, '');
    console.log(`Loaded: [${key}] = [${val.slice(0, 10)}...]`);
  }
}

loadDotEnvLocal();
