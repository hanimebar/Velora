import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { NewMembershipForm } from '@/components/studio/new-membership-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New membership' }

export default async function NewMembershipPage() {
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
      <div className="px-8 py-8 max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>New membership plan</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
            Creates a Stripe product and recurring price automatically
          </p>
        </div>
        <NewMembershipForm studioId={studio.id} currency={studio.currency} />
      </div>
    </StudioShell>
  )
}
