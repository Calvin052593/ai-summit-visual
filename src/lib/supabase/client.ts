import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createSupabaseClient> | null = null

function safeUrl(raw: string | undefined): string {
  try {
    new URL(raw ?? '')
    return raw!
  } catch {
    // Placeholder / missing value — use localhost so builds don't crash
    return 'http://localhost:54321'
  }
}

export function createClient() {
  if (client) return client
  const url = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  client = createSupabaseClient(url, key)
  return client
}
