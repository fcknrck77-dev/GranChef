import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin('CORE');
  if (!supa.ok) return supa.response;

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();

  let query = supa.supabase.from('app_users').select('*').order('name', { ascending: true });
  if (q) {
    // Search by name or email; PostgREST "or" syntax
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data || [] });
}
