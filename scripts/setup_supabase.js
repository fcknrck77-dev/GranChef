/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Missing env SUPABASE_DB_URL (postgres connection string).');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, 'setup_supabase.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('commit');
    console.log('Supabase schema applied successfully.');
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

