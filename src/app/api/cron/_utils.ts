import { NextResponse } from 'next/server';
import getCoreClient from '@/lib/supabase/core';
import getCoursesClient from '@/lib/supabase/courses';
import getAiClient from '@/lib/supabase/ai';
import getMarketingClient from '@/lib/supabase/marketing';
import getLogsClient from '@/lib/supabase/logs';
export function requireCronSecret(req: Request) {
  const secret = process.env.CRON_SECRET || '';
  if (!secret) {
    return { ok: false as const, response: NextResponse.json({ error: 'cron_secret_not_configured' }, { status: 503 }) };
  }

  const url = new URL(req.url);
  const header = req.headers.get('x-cron-secret') || '';
  const query = url.searchParams.get('secret') || '';
  if (header !== secret && query !== secret) {
    return { ok: false as const, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const };
}

export function requireSupabaseAdminCron(domain: 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS' = 'CORE') {
  let supabase = null;
  switch (domain) {
    case 'CORE': supabase = getCoreClient(); break;
    case 'COURSES': supabase = getCoursesClient(); break;
    case 'AI_BRAIN': supabase = getAiClient(); break;
    case 'MARKETING': supabase = getMarketingClient(); break;
    case 'LOGS': supabase = getLogsClient(); break;
  }
  if (!supabase) {
    return { ok: false as const, response: NextResponse.json({ error: `supabase_${domain.toLowerCase()}_not_configured` }, { status: 503 }) };
  }
  return { ok: true as const, supabase };
}

