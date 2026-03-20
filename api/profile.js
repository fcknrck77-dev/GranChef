import supabaseCore from '../lib/supabase/core.js'

export default async function handler(req, res) {
  try {
    // comprobar variables
    if (!process.env.SUPABASE_CORE_URL || !process.env.SUPABASE_CORE_SERVICE_KEY) {
      return res.status(500).json({
        error: "Faltan variables de entorno SUPABASE_CORE"
      })
    }

    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({
        error: "Missing user_id"
      })
    }

    const { data, error } = await supabaseCore
      .from('app_users')
      .select('*')
      .eq('id', user_id)
      .single()

    if (error) {
      return res.status(500).json({
        error: error.message,
        details: error
      })
    }

    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    })
  }
}
