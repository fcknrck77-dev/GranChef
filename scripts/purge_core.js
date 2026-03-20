const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function purgeCore() {
    const id = 'yqjwqhncofynnkezkuur'; // CORE
    const pass = 'V@llado212g';
    const uri = `postgresql://postgres.${id}:${pass}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres`;
    const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const tables = ['courses', 'ingredients', 'techniques', 'recipes', 'ai_requests', 'engine_jobs', 'engine_cycles', 'course_tests', 'profiles'];
        for (const t of tables) {
            console.log(`- Dropping public.${t} from CORE...`);
            await client.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
        }
        console.log('--- PURGE COMPLETE ---');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

purgeCore();
