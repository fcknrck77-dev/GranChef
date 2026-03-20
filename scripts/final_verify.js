const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DB_PASS = 'V@llado212g';
const SHARDS = {
    COURSES: { id: 'mxnwlsioxzoynekbiaxb', region: 'eu-central-2' },
    AI_BRAIN: { id: 'vprlwusrkmbbjqytogyf', region: 'eu-central-2' },
    LOGS: { id: 'gtxuuxsjaushzzinqvjw', region: 'eu-west-1' }
};

async function verifyShard(name, s) {
    const uri = `postgresql://postgres.${s.id}:${DB_PASS}@aws-1-${s.region}.pooler.supabase.com:6543/postgres`;
    const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        console.log(`- Shard ${name} tables:`, res.rows.map(r => r.tablename).join(', '));
    } catch (err) {
        console.error(`- Error in ${name}:`, err.message);
    } finally {
        await client.end();
    }
}

async function run() {
    for (const [name, s] of Object.entries(SHARDS)) {
        await verifyShard(name, s);
    }
}

run();
