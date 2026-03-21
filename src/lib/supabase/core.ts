import { getSupabase } from '@/lib/supabaseClient';
import { type SupabaseClient } from '@supabase/supabase-js';

export default function getCoreClient(): SupabaseClient {
  const client = getSupabase('CORE');
  if (!client) throw new Error('Supabase CORE client not configured');
  return client;
}
