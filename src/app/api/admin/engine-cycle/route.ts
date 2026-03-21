import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';
import { generateCourseCycle } from '@/lib/gastronomic_engine';

export const dynamic = 'force-dynamic';

function nextCycleDueFrom(latestCreatedAt: string) {
  const lastDate = new Date(latestCreatedAt);
  return new Date(lastDate.getTime() + 96 * 3600 * 1000);
}

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin('LOGS');
  if (!supa.ok) return supa.response;

  // Get latest cycle
  const { data: latestCycle, error: cycleErr } = await supa.supabase
    .from('engine_cycles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleErr) return NextResponse.json({ error: cycleErr.message }, { status: 500 });

  let nextCycleDue = null;
  let canStart = true;

  if (latestCycle) {
    nextCycleDue = nextCycleDueFrom(latestCycle.created_at);
    canStart = Date.now() >= nextCycleDue.getTime();
  }

  const { data: queuedJob } = await supa.supabase
    .from('engine_jobs')
    .select('*')
    .eq('kind', 'course_cycle')
    .in('status', ['queued', 'running'])
    .order('run_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    latestCycle,
    nextCycleDue,
    canStart,
    queuedJob,
    currentTime: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin('LOGS');
  if (!supa.ok) return supa.response;

  // Determine cooldown
  const { data: latestCycle, error: cycleErr } = await supa.supabase
    .from('engine_cycles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleErr) return NextResponse.json({ error: cycleErr.message }, { status: 500 });

  let nextCycleDue: Date | null = null;
  let canStart = true;
  if (latestCycle?.created_at) {
    nextCycleDue = nextCycleDueFrom(latestCycle.created_at);
    canStart = Date.now() >= nextCycleDue.getTime();
  }
  
  try {
    if (!canStart) {
      const runAt = (nextCycleDue || new Date(Date.now() + 96 * 3600 * 1000)).toISOString();

      // Avoid duplicate queued jobs
      const { data: existing } = await supa.supabase
        .from('engine_jobs')
        .select('*')
        .eq('kind', 'course_cycle')
        .eq('status', 'queued')
        .order('run_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ ok: true, scheduled: true, runAt: existing.run_at, jobId: existing.id });
      }

      const { data: job, error: jobErr } = await supa.supabase
        .from('engine_jobs')
        .insert({ kind: 'course_cycle', status: 'queued', run_at: runAt, payload: { requestedAt: new Date().toISOString() } })
        .select('*')
        .maybeSingle();

      if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 });
      return NextResponse.json({ ok: true, scheduled: true, runAt, jobId: job?.id || null });
    }

    // Run now (admin-triggered)
    const result = await generateCourseCycle();
    return NextResponse.json({ ok: true, scheduled: false, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
