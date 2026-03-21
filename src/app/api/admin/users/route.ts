import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';
import { getSupabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

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

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin('CORE');
  if (!supa.ok) return supa.response;

  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.name) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const { email, name, plan, status, durationDays } = body;

  // 1. Create user in Supabase Auth
  // Note: For admin-created users, we can use admin.createUser but it requires service role client.
  // Our supa.supabase is expected to be a service role client based on requireSupabaseAdmin.
  
  const { data: authUser, error: authError } = await supa.supabase.auth.admin.createUser({
    email,
    password: body.password || 'TemporaryPass123!',
    email_confirm: true,
    user_metadata: { name, level: plan || 'FREE' }
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });
  if (!authUser.user) return NextResponse.json({ error: 'No se pudo crear el usuario' }, { status: 500 });

  const now = new Date().toISOString();
  const patch: any = {
    id: authUser.user.id,
    email,
    name,
    plan: plan || 'FREE',
    status: status || 'active',
    created_at: now,
    trial_start_at: now,
  };

  if (durationDays && durationDays > 0) {
    patch.plan_override = {
      plan: plan || 'FREE',
      until: new Date(Date.now() + 1000 * 60 * 60 * 24 * durationDays).toISOString(),
      reason: 'Asignado por administrador'
    };
  }

  const { error: dbError } = await supa.supabase.from('app_users').insert(patch);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true, user: patch });
}
