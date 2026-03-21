import { getSupabase } from '@/lib/supabaseClient';
import { type SupabaseClient } from '@supabase/supabase-js';

export default function getCoursesClient(): SupabaseClient {
  const client = getSupabase('COURSES');
  if (!client) throw new Error('Supabase COURSES client not configured');
  return client;
}
