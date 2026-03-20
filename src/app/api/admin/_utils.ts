import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminSession';
import getCoreClient from '@/lib/supabase/core';
import getCoursesClient from '@/lib/supabase/courses';
import getAiClient from '@/lib/supabase/ai';
import getMarketingClient from '@/lib/supabase/marketing';
import getLogsClient from '@/lib/supabase/logs';
export async function requireAdmin() {
  if (!(await isAdminSessionValid())) {
    return { ok: false as const, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const };
}

export function requireSupabaseAdmin(domain: 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS' = 'CORE') {
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
