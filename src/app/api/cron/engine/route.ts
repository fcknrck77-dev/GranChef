import { NextResponse } from 'next/server';
import { requireCronSecret, requireSupabaseAdminCron } from '../_utils';
import { generateCourseCycle } from '@/lib/gastronomic_engine';

function nextCycleDueFrom(latestCreatedAt: string) {
  const lastDate = new Date(latestCreatedAt);
  return new Date(lastDate.getTime() + 96 * 3600 * 1000);
}

export async function POST(req: Request) {
  const gate = requireCronSecret(req);
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdminCron();
  if (!supa.ok) return supa.response;

  const now = new Date();

  // Pick the next queued job due
  const { data: job, error: jobErr } = await supa.supabase
    .from('engine_jobs')
    .select('*')
    .eq('kind', 'course_cycle')
    .eq('status', 'queued')
    .lte('run_at', now.toISOString())
    .order('run_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 });
  if (!job) return NextResponse.json({ ok: true, ran: false, reason: 'no_due_job' });

  // Enforce 96h cooldown based on latest cycle
  const { data: latestCycle, error: cycleErr } = await supa.supabase
    .from('engine_cycles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleErr) return NextResponse.json({ error: cycleErr.message }, { status: 500 });

  if (latestCycle?.created_at) {
    const due = nextCycleDueFrom(latestCycle.created_at);
    if (now.getTime() < due.getTime()) {
      // Push the job to the real due date
      await supa.supabase
        .from('engine_jobs')
        .update({ run_at: due.toISOString() })
        .eq('id', job.id);
      return NextResponse.json({ ok: true, ran: false, reason: 'cooldown', nextCycleDue: due.toISOString() });
    }
  }

  // Mark as running
  await supa.supabase
    .from('engine_jobs')
    .update({ status: 'running', started_at: now.toISOString() })
    .eq('id', job.id);

  try {
    const result = await generateCourseCycle();

    await supa.supabase
      .from('engine_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        payload: { ...(job.payload || {}), result },
        last_error: null,
      })
      .eq('id', job.id);

    return NextResponse.json({ ok: true, ran: true, jobId: job.id, result });
  } catch (err: any) {
    await supa.supabase
      .from('engine_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        last_error: String(err?.message || err),
      })
      .eq('id', job.id);

    return NextResponse.json({ ok: false, ran: false, error: String(err?.message || err) }, { status: 500 });
  }
}

