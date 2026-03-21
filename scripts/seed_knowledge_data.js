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

  if (!url || !key) {
    console.error('Missing SUPABASE_AI_URL or SUPABASE_AI_SERVICE_KEY');
    process.exit(1);
  }

  const client = createClient(url, key);

  const files = ['big_text.txt', 'culinary_data_rich.txt'];
  let totalSaved = 0;

  for (const fileName of files) {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${fileName}`);
      continue;
    }

    console.log(`Processing ${fileName}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split by @D or similar separator if found
    const blocks = content.split('@D').map(b => b.trim()).filter(Boolean);
    
    for (const block of blocks) {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;

      const title = lines[0];
      const body = lines.slice(1).join(' ').replace(/\s+/g, ' ');

      // Simple tag extraction
      const tags = [title.toLowerCase().split(/\s+/)[0]];

      const { error } = await client.from('culinary_knowledge').upsert({
        pair_key: title,
        body: body,
        source: fileName === 'big_text.txt' ? 'The Flavor Thesaurus' : 'Rich Culinary Data',
        tags: tags
      }, { onConflict: 'pair_key' });

      if (error) {
        console.error(`  Error saving "${title}":`, error.message);
      } else {
        totalSaved++;
        if (totalSaved % 10 === 0) process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }

  console.log(`--- Finished. Total blocks saved: ${totalSaved} ---`);
}

main();
