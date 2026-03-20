import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export default function getLogsClient(): SupabaseClient {
  if (client) return client;
  client = createClient(
    (process.env.SUPABASE_LOGS_URL || 'https://gtxuuxsjaushzzinqvjw.supabase.co'),
    (process.env.SUPABASE_LOGS_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'),
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    }
  );
  return client;
}
