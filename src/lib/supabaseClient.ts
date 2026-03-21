import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseDomain = 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS' | 'NETWORKING' | 'BUSINESS';

const cachedClients: Record<string, SupabaseClient<any, any, any>> = {};

export function getSupabase(domain: SupabaseDomain = 'CORE') {
  if (cachedClients[domain]) return cachedClients[domain];

  let supabaseUrl: string | undefined;
  let supabaseKey: string | undefined;

  switch (domain) {
    case 'CORE':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_CORE_URL;
      supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_CORE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      break;
    case 'COURSES':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_COURSES_URL || process.env.SUPABASE_COURSES_URL;
      supabaseKey = process.env.SUPABASE_COURSES_SERVICE_KEY || process.env.SUPABASE_COURSES_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_COURSES_ANON_KEY;
      break;
    case 'AI_BRAIN':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_AI_BRAIN_URL || process.env.SUPABASE_AI_BRAIN_URL || process.env.SUPABASE_AI_URL;
      supabaseKey = process.env.SUPABASE_AI_BRAIN_SERVICE_KEY || process.env.SUPABASE_AI_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_AI_BRAIN_ANON_KEY;
      break;
    case 'MARKETING':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_MARKETING_URL || process.env.SUPABASE_MARKETING_URL;
      supabaseKey = process.env.SUPABASE_MARKETING_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_MARKETING_ANON_KEY;
      break;
    case 'LOGS':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_LOGS_URL || process.env.SUPABASE_LOGS_URL;
      supabaseKey = process.env.SUPABASE_LOGS_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_LOGS_ANON_KEY;
      break;
    case 'NETWORKING':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_NETWORKING_URL || process.env.SUPABASE_NETWORKING_URL || process.env.SUPABASE_NETWORKING_URL_CLEAN;
      supabaseKey = process.env.SUPABASE_NETWORKING_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_NETWORKING_ANON_KEY;
      break;
    case 'BUSINESS':
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_BUSINESS_URL || process.env.SUPABASE_BUSINESS_URL || process.env.SUPABASE_BUSINESS_URL_CLEAN;
      supabaseKey = process.env.SUPABASE_BUSINESS_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_BUSINESS_ANON_KEY;
      break;
    default:
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      break;
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error(`[SupabaseClient] Missing credentials for domain: ${domain}`);
    return null;
  }

  cachedClients[domain] = createClient<any>(supabaseUrl, supabaseKey);
  return cachedClients[domain];
}
