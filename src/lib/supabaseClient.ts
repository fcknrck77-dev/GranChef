import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseDomain = 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS';

const cachedClients: Record<string, SupabaseClient<any, any, any>> = {};

export function getSupabase(domain: SupabaseDomain = 'CORE') {
  if (cachedClients[domain]) return cachedClients[domain];

  const urlKey = `NEXT_PUBLIC_SUPABASE_URL_${domain}`;
  const anonKeyName = `NEXT_PUBLIC_SUPABASE_ANON_KEY_${domain}`;

  let supabaseUrl = process.env[urlKey];
  let supabaseKey = process.env[anonKeyName];

  // Fallback for legacy/default
  if (!supabaseUrl || !supabaseKey) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yqjwqhncofynnkezkuur.supabase.co';
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';
  }

  if (!supabaseUrl || !supabaseKey) return null;

  cachedClients[domain] = createClient<any>(supabaseUrl, supabaseKey);
  return cachedClients[domain];
}
