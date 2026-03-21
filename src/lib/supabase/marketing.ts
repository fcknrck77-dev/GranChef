import { getSupabase } from '@/lib/supabaseClient';
import { type SupabaseClient } from '@supabase/supabase-js';

export default function getMarketingClient(): SupabaseClient {
  const client = getSupabase('MARKETING');
  if (!client) throw new Error('Supabase MARKETING client not configured');
  return client;
}
