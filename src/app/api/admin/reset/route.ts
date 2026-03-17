import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

const ZERO_DATE = '1970-01-01T00:00:00.000Z';

export async function POST() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const preserveEmail = (process.env.ADMIN_USER || '').trim();
  if (!preserveEmail) {
    return NextResponse.json({ error: 'missing_ADMIN_USER' }, { status: 500 });
  }

  // Ensure the owner/admin user exists in app_users.
  const existing = await supa.supabase.from('app_users').select('id,email').eq('email', preserveEmail).maybeSingle();
  if (existing.error) return NextResponse.json({ error: existing.error.message }, { status: 500 });

  let preserveId = existing.data?.id as string | undefined;
  if (!preserveId) {
    const ins = await supa.supabase
      .from('app_users')
      .insert({
        name: 'Grand Chef',
        email: preserveEmail,
        status: 'active',
        plan: 'PREMIUM',
        billing: {},
        notes: 'Owner account',
      })
      .select('id')
      .maybeSingle();
    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });
    preserveId = ins.data?.id as string | undefined;
  }

  // Reset "income" data (billing + rewards) for the preserved user too.
  const upd = await supa.supabase
    .from('app_users')
    .update({ billing: {}, plan_override: null, notes: '' })
    .eq('email', preserveEmail);
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });

  // Delete history tables first (safe even if empty).
  const delRewards = await supa.supabase.from('user_rewards').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delRewards.error) return NextResponse.json({ error: delRewards.error.message }, { status: 500 });

  const delWinners = await supa.supabase.from('giveaway_winners').delete({ count: 'exact' }).neq('email', '');
  if (delWinners.error) return NextResponse.json({ error: delWinners.error.message }, { status: 500 });

  const delGiveaways = await supa.supabase.from('giveaways').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delGiveaways.error) return NextResponse.json({ error: delGiveaways.error.message }, { status: 500 });

  // Engine / admin queues.
  const delAi = await supa.supabase.from('ai_requests').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delAi.error) return NextResponse.json({ error: delAi.error.message }, { status: 500 });

  const delJobs = await supa.supabase.from('engine_jobs').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delJobs.error) return NextResponse.json({ error: delJobs.error.message }, { status: 500 });

  const delCycles = await supa.supabase.from('engine_cycles').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delCycles.error) return NextResponse.json({ error: delCycles.error.message }, { status: 500 });

  // Keep content tables intact (courses/recipes/ingredients/techniques), but reset tests if you want a clean slate.
  const delTests = await supa.supabase.from('course_tests').delete({ count: 'exact' }).gte('created_at', ZERO_DATE);
  if (delTests.error) return NextResponse.json({ error: delTests.error.message }, { status: 500 });

  // Finally, remove all users except the preserved one.
  const delUsers = await supa.supabase
    .from('app_users')
    .delete({ count: 'exact' })
    .neq('email', preserveEmail);
  if (delUsers.error) return NextResponse.json({ error: delUsers.error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    preserved: { email: preserveEmail, id: preserveId },
    deleted: {
      app_users: delUsers.count ?? null,
      user_rewards: delRewards.count ?? null,
      giveaways: delGiveaways.count ?? null,
      giveaway_winners: delWinners.count ?? null,
      ai_requests: delAi.count ?? null,
      engine_jobs: delJobs.count ?? null,
      engine_cycles: delCycles.count ?? null,
      course_tests: delTests.count ?? null,
    },
  });
}

