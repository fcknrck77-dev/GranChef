import { createClient } from '@supabase/supabase-js';

const supabaseCourses = createClient(
  process.env.SUPABASE_COURSES_URL as string,
  process.env.SUPABASE_COURSES_SERVICE_KEY as string,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  }
);

export default supabaseCourses;
