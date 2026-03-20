import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseDomain = 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS';

const cachedAdminClients: Record<string, SupabaseClient<any, any, any>> = {};

export function getSupabaseAdmin(domain: SupabaseDomain = 'CORE') {
  if (cachedAdminClients[domain]) return cachedAdminClients[domain];

  const urlKey = domain === 'CORE' ? 'SUPABASE_URL' : `NEXT_PUBLIC_SUPABASE_URL_${domain}`;
  const roleKeyName = domain === 'CORE' ? 'SUPABASE_SERVICE_ROLE_KEY' : `SUPABASE_SERVICE_ROLE_KEY_${domain}`;

  let url = process.env[urlKey];
  let key = process.env[roleKeyName];

  // Fallback for CORE if specific wasn't found (though we added it)
  if (!url || !key) {
    url = process.env.SUPABASE_URL;
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (!url || !key) return null;

  cachedAdminClients[domain] = createClient<any>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cachedAdminClients[domain];
}

