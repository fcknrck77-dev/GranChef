const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const vars = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq < 0) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    vars[key] = val;
});

console.log('--- Uploading Environment Variables to Vercel ---');
const envs = ['production', 'preview', 'development'];

for (const [key, val] of Object.entries(vars)) {
    if (key.startsWith('SUPABASE_') || key.startsWith('NEXT_PUBLIC_') || key.includes('_KEY')) {
        console.log(`- Adding variable: ${key}...`);
        for (const env of envs) {
            // Using spawnSync to avoid shell escaping issues
            const res = spawnSync('vercel', ['env', 'add', key, env, '--value', val, '--yes'], { encoding: 'utf8' });
            if (res.status !== 0) {
                console.error(`  ❌ Error adding ${key} to ${env}: ${res.stderr || res.stdout}`);
            }
        }
    }
}
console.log('--- VERCEL ENV SYNC COMPLETE ---');
