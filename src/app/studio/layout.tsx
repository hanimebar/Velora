import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioSidebar } from '@/components/studio/sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Studio Dashboard',
    template: '%s | Velora Studio',
  },
  robots: { index: false, follow: false },
}

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/studio/login')
  }

  // Onboarding pages don't need the sidebar
  return <>{children}</>
}
