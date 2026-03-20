const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function listTables() {
    const id = 'yqjwqhncofynnkezkuur';
    const pass = 'V@llado212g';
    const uri = `postgresql://postgres.${id}:${pass}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres`;
    const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        console.log('Tables in CORE:', res.rows.map(r => r.tablename).join(', '));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

listTables();
