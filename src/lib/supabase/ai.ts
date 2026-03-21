import { getSupabase } from '@/lib/supabaseClient';
import { type SupabaseClient } from '@supabase/supabase-js';

export default function getAiClient(): SupabaseClient {
  const client = getSupabase('AI_BRAIN');
  if (!client) throw new Error('Supabase AI_BRAIN client not configured');
  return client;
}
