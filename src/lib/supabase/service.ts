import { createClient } from '@supabase/supabase-js'

// Service role client for API routes — bypasses RLS
// Never expose to the browser
// Untyped intentionally: service role clients operate outside the normal
// RLS constraints and run complex cross-table queries that would require
// full Supabase-generated types to be properly typed.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
