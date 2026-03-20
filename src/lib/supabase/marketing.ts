import { createClient } from '@supabase/supabase-js';

const supabaseMarketing = createClient(
  process.env.SUPABASE_MARKETING_URL as string,
  process.env.SUPABASE_MARKETING_SERVICE_KEY as string,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  }
);

export default supabaseMarketing;
