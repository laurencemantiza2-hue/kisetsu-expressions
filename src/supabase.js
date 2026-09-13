import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL

const key = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("SUPABASE URL:", url)
console.log("SUPABASE KEY PREFIX:", key ? key.slice(0, 15) : "MISSING")
console.log("SUPABASE KEY LENGTH:", key ? key.length : 0)

export const supabase =
  url && key ? createClient(url, key) : null

export const hasSupabaseConfig = Boolean(supabase)