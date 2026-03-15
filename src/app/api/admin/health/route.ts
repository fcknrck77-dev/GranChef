import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  // Cheap connectivity check
  const { error } = await supa.supabase.from('courses').select('id').limit(1);
  if (error) {
    return NextResponse.json({ supabaseConfigured: true, ok: false, error: String(error.message || error) }, { status: 200 });
  }
  return NextResponse.json({ supabaseConfigured: true, ok: true });
}
