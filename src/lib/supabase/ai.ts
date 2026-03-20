import { createClient } from '@supabase/supabase-js';

const supabaseAi = createClient(
  process.env.SUPABASE_AI_URL as string,
  process.env.SUPABASE_AI_SERVICE_KEY as string,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  }
);

export default supabaseAi;
