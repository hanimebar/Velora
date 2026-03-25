import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { SettingsForm } from '@/components/studio/settings-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/studio/login')

  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Studio settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
            Manage your studio profile and configuration
          </p>
        </div>
        <SettingsForm studio={studio} />
      </div>
    </StudioShell>
  )
}
