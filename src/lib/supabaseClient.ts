import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient<any, any, any> | null = null;

export function getSupabase() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  cachedClient = createClient<any>(supabaseUrl, supabaseKey);
  return cachedClient;
}
