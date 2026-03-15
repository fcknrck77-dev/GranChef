import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../../_utils';

type PatchBody = {
  status?: 'active' | 'blocked' | 'suspended';
  plan?: 'FREE' | 'PRO' | 'PREMIUM';
  notes?: string;
  markPaid?: boolean;
  planOverride?: { plan: 'FREE' | 'PRO' | 'PREMIUM'; until: string; reason: string } | null;
  addReward?: { type: string; label: string; meta?: any };
};

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { id } = await ctx.params;
  const { data: user, error } = await supa.supabase.from('app_users').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: rewards } = await supa.supabase.from('user_rewards').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(50);
  return NextResponse.json({ user, rewards: rewards || [] });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as PatchBody | null;
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const patch: any = {};
  if (body.status) patch.status = body.status;
  if (body.plan) patch.plan = body.plan;
  if (typeof body.notes === 'string') patch.notes = body.notes;
  if (body.planOverride !== undefined) patch.plan_override = body.planOverride;

  if (body.markPaid) {
    const paidAt = new Date().toISOString();
    const nextDue = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
    patch.billing = { lastPaidAt: paidAt, nextDueAt: nextDue };
    patch.status = 'active';
    await supa.supabase.from('user_rewards').insert({
      user_id: id,
      type: 'payment',
      label: `Pago registrado. Próximo vencimiento: ${new Date(nextDue).toLocaleDateString('es-ES')}`,
      meta: { paidAt, nextDue },
    });
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supa.supabase.from('app_users').update(patch).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.addReward) {
    const { error } = await supa.supabase.from('user_rewards').insert({
      user_id: id,
      type: body.addReward.type,
      label: body.addReward.label,
      meta: body.addReward.meta || {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: user, error: reErr } = await supa.supabase.from('app_users').select('*').eq('id', id).maybeSingle();
  if (reErr) return NextResponse.json({ error: reErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, user });
}
