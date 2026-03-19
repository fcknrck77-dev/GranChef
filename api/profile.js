import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  try {
    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (error) throw error

    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
