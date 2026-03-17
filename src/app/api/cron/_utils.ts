import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export function requireCronSecret(req: Request) {
  const secret = process.env.CRON_SECRET || '';
  if (!secret) {
    return { ok: false as const, response: NextResponse.json({ error: 'cron_secret_not_configured' }, { status: 503 }) };
  }

  const url = new URL(req.url);
  const header = req.headers.get('x-cron-secret') || '';
  const query = url.searchParams.get('secret') || '';
  if (header !== secret && query !== secret) {
    return { ok: false as const, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const };
}

export function requireSupabaseAdminCron() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, response: NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 }) };
  }
  return { ok: true as const, supabase };
}

