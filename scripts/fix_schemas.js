const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DB_PASS = 'V@llado212g';

const SHARDS = {
    COURSES: { id: 'mxnwlsioxzoynekbiaxb', region: 'eu-central-2' },
    AI_BRAIN: { id: 'vprlwusrkmbbjqytogyf', region: 'eu-central-2' },
    LOGS: { id: 'gtxuuxsjaushzzinqvjw', region: 'eu-west-1' }
};

const SSL_CONFIG = { rejectUnauthorized: false };

async function runSQLDirect(uri, sql) {
    const client = new Client({ connectionString: uri, ssl: SSL_CONFIG });
    try {
        await client.connect();
        await client.query(sql);
        console.log(`  ✅ SQL executed.`);
    } catch (err) {
        console.error(`  ❌ SQL Error:`, err.message);
    } finally {
        await client.end();
    }
}

async function fixSchemas() {
    console.log('--- Fixing Shard Schemas ---');

    // 1. COURSES: needs tests
    console.log('- Setting up COURSES (mxnwlsioxzoynekbiaxb)...');
    const coursesUri = `postgresql://postgres.${SHARDS.COURSES.id}:${DB_PASS}@aws-1-${SHARDS.COURSES.region}.pooler.supabase.com:6543/postgres`;
    const sqlCourses = `
        CREATE TABLE IF NOT EXISTS public.course_tests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
            questions JSONB NOT NULL DEFAULT '[]'::jsonb,
            answers_visible BOOLEAN DEFAULT FALSE,
            release_answers_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_course_tests_course_id ON public.course_tests(course_id);
    `;
    await runSQLDirect(coursesUri, sqlCourses);

    // 2. LOGS: needs engine_jobs, engine_cycles, ai_requests
    console.log('- Setting up LOGS (gtxuuxsjaushzzinqvjw)...');
    const logsUri = `postgresql://postgres.${SHARDS.LOGS.id}:${DB_PASS}@aws-1-${SHARDS.LOGS.region}.pooler.supabase.com:6543/postgres`;
    const sqlLogs = `
        CREATE TABLE IF NOT EXISTS public.engine_cycles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cycle_id TEXT UNIQUE NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT now(),
            completed_at TIMESTAMPTZ
        );
        CREATE TABLE IF NOT EXISTS public.engine_jobs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            kind TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'queued',
            run_at TIMESTAMPTZ NOT NULL,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            last_error TEXT,
            started_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.ai_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            kind TEXT NOT NULL DEFAULT 'courses',
            instruction TEXT NOT NULL,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            days_to_generate INTEGER DEFAULT 7,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_engine_cycles_status ON public.engine_cycles(status);
        CREATE INDEX IF NOT EXISTS idx_engine_jobs_status_run_at ON public.engine_jobs(status, run_at);
        CREATE INDEX IF NOT EXISTS idx_ai_requests_status ON public.ai_requests(status);
    `;
    await runSQLDirect(logsUri, sqlLogs);

    // 3. AI_BRAIN: ensure recipes, ingredients, techniques are there
    console.log('- Setting up AI_BRAIN (vprlwusrkmbbjqytogyf)...');
    const aiUri = `postgresql://postgres.${SHARDS.AI_BRAIN.id}:${DB_PASS}@aws-1-${SHARDS.AI_BRAIN.region}.pooler.supabase.com:6543/postgres`;
    // Skip re-creation if already done by MASTER_GRANDCHEF.sql, but we can call it again
    const sqlAi = `
        CREATE TABLE IF NOT EXISTS public.ingredients (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, family TEXT, description TEXT, pairing_notes JSONB, stories JSONB, created_at TIMESTAMPTZ DEFAULT now());
        CREATE TABLE IF NOT EXISTS public.techniques (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, description TEXT, difficulty TEXT, equipment JSONB, reagents JSONB, pairing_notes JSONB, created_at TIMESTAMPTZ DEFAULT now());
        CREATE TABLE IF NOT EXISTS public.recipes (id TEXT PRIMARY KEY, title TEXT NOT NULL, source TEXT, tier TEXT, difficulty TEXT, servings INTEGER, times JSONB, description TEXT, utensils JSONB, ingredients JSONB, steps JSONB, techniques JSONB, tags JSONB, created_at TIMESTAMPTZ DEFAULT now());
    `;
    await runSQLDirect(aiUri, sqlAi);

    console.log('--- SCHEMA FIX COMPLETE ---');
}

fixSchemas();
