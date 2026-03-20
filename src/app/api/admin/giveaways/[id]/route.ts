import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../../_utils';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const { id } = await ctx.params;

  const { data: giveaway, error: gErr } = await supa.supabase.from('giveaways').select('*').eq('id', id).maybeSingle();
  if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 });
  if (!giveaway) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: winners, error: wErr } = await supa.supabase
    .from('giveaway_winners')
    .select('*')
    .eq('giveaway_id', id)
    .order('name', { ascending: true });
  if (wErr) return NextResponse.json({ error: wErr.message }, { status: 500 });

  // Rewards are stored in user_rewards.meta.giveawayId
  const { data: rewards, error: rErr } = await supa.supabase
    .from('user_rewards')
    .select('*')
    .contains('meta', { giveawayId: id })
    .order('created_at', { ascending: false })
    .limit(500);
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

  return NextResponse.json({ giveaway, winners: winners || [], rewards: rewards || [] });
}

