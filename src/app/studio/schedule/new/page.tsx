import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { NewSessionForm } from '@/components/studio/new-session-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New class session' }

export default async function NewSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/studio/login')

  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  const { data: classTypes } = await supabase
    .from('class_types')
    .select('*')
    .eq('studio_id', studio.id)
    .order('name')

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8 max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>New class session</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
            Schedule a single or recurring class
          </p>
        </div>
        <NewSessionForm studioId={studio.id} classTypes={classTypes ?? []} timezone={studio.timezone} />
      </div>
    </StudioShell>
  )
}
