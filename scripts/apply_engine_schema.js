/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { parse } = require('pg-connection-string');

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
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Missing env SUPABASE_DB_URL (postgres connection string).');
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), 'scripts', 'gastronomic_engine_setup.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const cfg = parse(dbUrl);
  cfg.ssl = { rejectUnauthorized: false };

  const client = new Client(cfg);
  await client.connect();
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('commit');
    console.log('Gastronomic Engine schema applied successfully.');
  } catch (err) {
    await client.query('rollback');
    console.error('Failed applying schema:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
