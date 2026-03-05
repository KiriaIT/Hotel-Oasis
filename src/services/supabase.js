import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://waduorxsefnouvqjwogc.supabase.co'
const supabaseKey = 'sb_publishable_fMjWR-ciC4dH__mR2TidGA_6ksHE7F2'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;