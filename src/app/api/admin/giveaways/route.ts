import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

type Body = {
  eligibility: string;
  winnerCount: number;
  prizeLabel: string;
  rewardPlanOverride?: { plan: 'FREE' | 'PRO' | 'PREMIUM'; days: number };
};

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { data, error } = await supa.supabase.from('giveaways').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ giveaways: data || [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const { data: users, error: uErr } = await supa.supabase.from('app_users').select('*');
  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
  const all = users || [];

  const eligible = all.filter((u: any) => {
    if (body.eligibility === 'all') return true;
    if (body.eligibility === 'active') return u.status === 'active';
    if (body.eligibility === 'active_paid') return u.status === 'active' && (u.billing?.nextDueAt ? (Date.now() <= new Date(u.billing.nextDueAt).getTime()) : false);
    if (body.eligibility === 'pro_plus') return u.status === 'active' && (u.plan === 'PRO' || u.plan === 'PREMIUM');
    return true;
  });

  const pool = [...eligible];
  const winners: any[] = [];
  const count = Math.max(1, Math.min(Number(body.winnerCount || 1), pool.length));
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    winners.push(pool[idx]);
    pool.splice(idx, 1);
  }

  const { data: giveaway, error: gErr } = await supa.supabase
    .from('giveaways')
    .insert({ eligibility: body.eligibility, prize_label: body.prizeLabel, winner_count: count })
    .select('*')
    .single();
  if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 });

  if (winners.length > 0) {
    await supa.supabase.from('giveaway_winners').insert(
      winners.map(w => ({ giveaway_id: giveaway.id, user_id: w.id, name: w.name, email: w.email }))
    );
  }

  for (const w of winners) {
    await supa.supabase.from('user_rewards').insert({
      user_id: w.id,
      type: 'giveaway',
      label: `Ganador sorteo: ${body.prizeLabel}`,
      meta: { prizeLabel: body.prizeLabel, giveawayId: giveaway.id },
    });
    if (body.rewardPlanOverride) {
      const until = new Date(Date.now() + 1000 * 60 * 60 * 24 * body.rewardPlanOverride.days).toISOString();
      await supa.supabase.from('app_users').update({ plan_override: { plan: body.rewardPlanOverride.plan, until, reason: `Sorteo: ${body.prizeLabel}` } }).eq('id', w.id);
      await supa.supabase.from('user_rewards').insert({
        user_id: w.id,
        type: 'plan_override',
        label: `Sorteo: ${body.prizeLabel} -> ${body.rewardPlanOverride.plan} por ${body.rewardPlanOverride.days} días`,
        meta: { plan: body.rewardPlanOverride.plan, until, days: body.rewardPlanOverride.days },
      });
    }
  }

  return NextResponse.json({
    giveaway,
    winners: winners.map(w => ({ userId: w.id, name: w.name, email: w.email })),
  });
}
