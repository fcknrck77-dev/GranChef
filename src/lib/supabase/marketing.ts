import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export default function getMarketingClient(): SupabaseClient {
  if (client) return client;
  client = createClient(
    (process.env.SUPABASE_MARKETING_URL || 'https://bvavomfudfolsxvgowjm.supabase.co'),
    (process.env.SUPABASE_MARKETING_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'),
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    }
  );
  return client;
}
