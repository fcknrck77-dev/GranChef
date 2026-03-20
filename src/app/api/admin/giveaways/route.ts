import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

export const dynamic = 'force-dynamic';

type Reward =
  | { type: 'none' }
  | { type: 'plan_override'; plan: 'FREE' | 'PRO' | 'PREMIUM'; days: number }
  | { type: 'plan_set'; plan: 'FREE' | 'PRO' | 'PREMIUM' }
  | { type: 'custom_reward'; rewardType: string; label: string; meta?: any };

type Body = {
  eligibility: string;
  winnerCount: number;
  prizeLabel: string;
  prizeMeta?: Record<string, any>;
  // Back-compat: old field name still accepted.
  rewardPlanOverride?: { plan: 'FREE' | 'PRO' | 'PREMIUM'; days: number };
  reward?: Reward;
};

async function applyGiveawayReward(
  supa: { supabase: any },
  userId: string,
  prizeLabel: string,
  giveawayId: string,
  reward: Reward
) {
  const baseMeta = { giveawayId, prizeLabel, reward };

  await supa.supabase.from('user_rewards').insert({
    user_id: userId,
    type: 'giveaway',
    label: `Ganador sorteo: ${prizeLabel}`,
    meta: baseMeta
  });

  if (reward.type === 'none') return;

  if (reward.type === 'plan_override') {
    const until = new Date(Date.now() + 1000 * 60 * 60 * 24 * reward.days).toISOString();
    await supa.supabase
      .from('app_users')
      .update({ plan_override: { plan: reward.plan, until, reason: `Sorteo: ${prizeLabel}` } })
      .eq('id', userId);
    await supa.supabase.from('user_rewards').insert({
      user_id: userId,
      type: 'plan_override',
      label: `Sorteo: ${prizeLabel} -> ${reward.plan} por ${reward.days} dias`,
      meta: { ...baseMeta, plan: reward.plan, until, days: reward.days }
    });
    return;
  }

  if (reward.type === 'plan_set') {
    await supa.supabase.from('app_users').update({ plan: reward.plan, plan_override: null }).eq('id', userId);
    await supa.supabase.from('user_rewards').insert({
      user_id: userId,
      type: 'plan_set',
      label: `Sorteo: ${prizeLabel} -> plan ${reward.plan}`,
      meta: { ...baseMeta, plan: reward.plan }
    });
    return;
  }

  if (reward.type === 'custom_reward') {
    await supa.supabase.from('user_rewards').insert({
      user_id: userId,
      type: reward.rewardType || 'custom_reward',
      label: reward.label || `Premio sorteo: ${prizeLabel}`,
      meta: { ...baseMeta, ...(reward.meta || {}) }
    });
  }
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { data, error } = await supa.supabase
    .from('giveaways')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
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
  if (!body.prizeLabel || typeof body.prizeLabel !== 'string') return NextResponse.json({ error: 'missing_prize_label' }, { status: 400 });

  const normalizedReward: Reward =
    body.reward ||
    (body.rewardPlanOverride
      ? { type: 'plan_override', plan: body.rewardPlanOverride.plan, days: Number(body.rewardPlanOverride.days) || 7 }
      : { type: 'none' });

  const { data: users, error: uErr } = await supa.supabase.from('app_users').select('*');
  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
  const all = users || [];

  const eligible = all.filter((u: any) => {
    if (body.eligibility === 'all') return true;
    if (body.eligibility === 'active') return u.status === 'active';
    if (body.eligibility === 'active_paid') return u.status === 'active' && (u.billing?.nextDueAt ? Date.now() <= new Date(u.billing.nextDueAt).getTime() : false);
    if (body.eligibility === 'pro_plus') return u.status === 'active' && (u.plan === 'PRO' || u.plan === 'PREMIUM');
    if (body.eligibility === 'overdue') return u.status === 'active' && (u.billing?.nextDueAt ? Date.now() > new Date(u.billing.nextDueAt).getTime() : true);
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
    .insert({
      eligibility: body.eligibility,
      prize_label: body.prizeLabel,
      prize_meta: body.prizeMeta || { reward: normalizedReward },
      status: 'completed',
      winner_count: count
    })
    .select('*')
    .single();
  if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 });

  if (winners.length > 0) {
    await supa.supabase.from('giveaway_winners').insert(winners.map((w) => ({ giveaway_id: giveaway.id, user_id: w.id, name: w.name, email: w.email })));
  }

  for (const w of winners) {
    await applyGiveawayReward(supa as any, w.id, body.prizeLabel, giveaway.id, normalizedReward);
  }

  return NextResponse.json({
    giveaway,
    winners: winners.map((w) => ({ userId: w.id, name: w.name, email: w.email }))
  });
}

