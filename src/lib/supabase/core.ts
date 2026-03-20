import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export default function getCoreClient(): SupabaseClient {
  if (client) return client;
  client = createClient(
    (process.env.SUPABASE_CORE_URL || 'https://yqjwqhncofynnkezkuur.supabase.co'),
    (process.env.SUPABASE_CORE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'),
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    }
  );
  return client;
}
