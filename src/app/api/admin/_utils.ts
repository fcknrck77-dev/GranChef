import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function requireAdmin() {
  if (!(await isAdminSessionValid())) {
    return { ok: false as const, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const };
}

export function requireSupabaseAdmin() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, response: NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 }) };
  }
  return { ok: true as const, supabase };
}
