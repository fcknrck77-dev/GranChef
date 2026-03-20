import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminSession';
import supabaseCore from '@/lib/supabase/core';
import supabaseCourses from '@/lib/supabase/courses';
import supabaseAi from '@/lib/supabase/ai';
import supabaseMarketing from '@/lib/supabase/marketing';
import supabaseLogs from '@/lib/supabase/logs';
export async function requireAdmin() {
  if (!(await isAdminSessionValid())) {
    return { ok: false as const, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const };
}

export function requireSupabaseAdmin(domain: 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS' = 'CORE') {
  let supabase = null;
  switch (domain) {
    case 'CORE': supabase = supabaseCore; break;
    case 'COURSES': supabase = supabaseCourses; break;
    case 'AI_BRAIN': supabase = supabaseAi; break;
    case 'MARKETING': supabase = supabaseMarketing; break;
    case 'LOGS': supabase = supabaseLogs; break;
  }
  if (!supabase) {
    return { ok: false as const, response: NextResponse.json({ error: `supabase_${domain.toLowerCase()}_not_configured` }, { status: 503 }) };
  }
  return { ok: true as const, supabase };
}
