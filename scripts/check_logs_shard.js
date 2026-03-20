const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function checkLogs() {
    const id = 'gtxuuxsjaushzzinqvjw'; // LOGS
    const pass = 'V@llado212g';
    const region = 'eu-west-1';
    const uri = `postgresql://postgres.${id}:${pass}@aws-1-${region}.pooler.supabase.com:6543/postgres`;
    const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const tables = ['ai_requests', 'engine_jobs', 'engine_cycles'];
        for (const t of tables) {
            try {
                const res = await client.query(`SELECT count(*) FROM public.${t}`);
                console.log(`- ${t} count: ${res.rows[0].count}`);
            } catch (e) {
                console.log(`- ${t} table MISSING or error: ${e.message}`);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkLogs();
