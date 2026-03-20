import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // DEBUG: comprobar si la clave existe
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Falta SERVICE ROLE KEY" })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
