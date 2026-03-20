import { createClient } from '@supabase/supabase-js';

const supabaseCore = createClient(
  process.env.SUPABASE_CORE_URL as string,
  process.env.SUPABASE_CORE_SERVICE_KEY as string,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  }
);

export default supabaseCore;
