import { createClient } from '@supabase/supabase-js'

const supabaseCore = createClient(
  process.env.SUPABASE_CORE_URL,
  process.env.SUPABASE_CORE_SERVICE_KEY
)

export default supabaseCore
