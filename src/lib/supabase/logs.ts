import { getSupabase } from '@/lib/supabaseClient';
import { type SupabaseClient } from '@supabase/supabase-js';

export default function getLogsClient(): SupabaseClient {
  const client = getSupabase('LOGS');
  if (!client) throw new Error('Supabase LOGS client not configured');
  return client;
}
