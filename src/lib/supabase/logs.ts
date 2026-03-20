import { createClient } from '@supabase/supabase-js';

const supabaseLogs = createClient(
  process.env.SUPABASE_LOGS_URL as string,
  process.env.SUPABASE_LOGS_SERVICE_KEY as string,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  }
);

export default supabaseLogs;
