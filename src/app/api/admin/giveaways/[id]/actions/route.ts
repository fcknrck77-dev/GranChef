import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../../../_utils';

type Reward =
  | { type: 'none' }
  | { type: 'plan_override'; plan: 'FREE' | 'PRO' | 'PREMIUM'; days: number }
  | { type: 'plan_set'; plan: 'FREE' | 'PRO' | 'PREMIUM' }
  | { type: 'custom_reward'; rewardType: string; label: string; meta?: any };

type Body =
  | { action: 'revoke' }
  | { action: 'reroll_all' }
  | { action: 'add_winner'; userId: string }
  | { action: 'remove_winner'; userId: string };

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

function normalizeRewardFromGiveaway(giveaway: any): Reward {
  const r = giveaway?.prize_meta?.reward;
  if (!r || typeof r !== 'object') return { type: 'none' };
  if (r.type === 'plan_override' && (r.plan === 'FREE' || r.plan === 'PRO' || r.plan === 'PREMIUM')) {
    return { type: 'plan_override', plan: r.plan, days: Math.max(1, Math.min(365, Number(r.days) || 7)) };
  }
  if (r.type === 'plan_set' && (r.plan === 'FREE' || r.plan === 'PRO' || r.plan === 'PREMIUM')) {
    return { type: 'plan_set', plan: r.plan };
  }
  if (r.type === 'custom_reward') {
    return {
      type: 'custom_reward',
      rewardType: String(r.rewardType || 'custom_reward'),
      label: String(r.label || ''),
      meta: r.meta
    };
  }
  return { type: 'none' };
}

function isEligibleUser(u: any, eligibility: string) {
  if (eligibility === 'all') return true;
  if (eligibility === 'active') return u.status === 'active';
  if (eligibility === 'active_paid') return u.status === 'active' && (u.billing?.nextDueAt ? Date.now() <= new Date(u.billing.nextDueAt).getTime() : false);
  if (eligibility === 'pro_plus') return u.status === 'active' && (u.plan === 'PRO' || u.plan === 'PREMIUM');
  if (eligibility === 'overdue') return u.status === 'active' && (u.billing?.nextDueAt ? Date.now() > new Date(u.billing.nextDueAt).getTime() : true);
  return true;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const { data: giveaway, error: gErr } = await supa.supabase.from('giveaways').select('*').eq('id', id).maybeSingle();
  if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 });
  if (!giveaway) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const reward = normalizeRewardFromGiveaway(giveaway);

  if (body.action === 'revoke') {
    await supa.supabase.from('giveaway_winners').delete().eq('giveaway_id', id);
    await supa.supabase.from('user_rewards').delete().contains('meta', { giveawayId: id });
    await supa.supabase.from('giveaways').update({ status: 'revoked' }).eq('id', id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'remove_winner') {
    await supa.supabase.from('giveaway_winners').delete().eq('giveaway_id', id).eq('user_id', body.userId);
    await supa.supabase.from('user_rewards').delete().eq('user_id', body.userId).contains('meta', { giveawayId: id });
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'add_winner') {
    const { data: user, error: uErr } = await supa.supabase.from('app_users').select('*').eq('id', body.userId).maybeSingle();
    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    if (!isEligibleUser(user, giveaway.eligibility)) return NextResponse.json({ error: 'user_not_eligible' }, { status: 400 });

    await supa.supabase.from('giveaway_winners').upsert(
      { giveaway_id: id, user_id: user.id, name: user.name, email: user.email },
      { onConflict: 'giveaway_id,user_id' }
    );
    await applyGiveawayReward(supa as any, user.id, giveaway.prize_label, id, reward);
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'reroll_all') {
    const { data: users, error: uErr } = await supa.supabase.from('app_users').select('*');
    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
    const eligible = (users || []).filter((u: any) => isEligibleUser(u, giveaway.eligibility));

    // Clear previous winners + rewards for this giveaway, then re-draw.
    await supa.supabase.from('giveaway_winners').delete().eq('giveaway_id', id);
    await supa.supabase.from('user_rewards').delete().contains('meta', { giveawayId: id });

    const pool = [...eligible];
    const winners: any[] = [];
    const count = Math.max(1, Math.min(Number(giveaway.winner_count || 1), pool.length));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      winners.push(pool[idx]);
      pool.splice(idx, 1);
    }

    if (winners.length > 0) {
      await supa.supabase.from('giveaway_winners').insert(winners.map((w) => ({ giveaway_id: id, user_id: w.id, name: w.name, email: w.email })));
      for (const w of winners) {
        await applyGiveawayReward(supa as any, w.id, giveaway.prize_label, id, reward);
      }
    }

    await supa.supabase.from('giveaways').update({ status: 'completed' }).eq('id', id);
    return NextResponse.json({ ok: true, winners: winners.map((w) => ({ userId: w.id, name: w.name, email: w.email })) });
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}

