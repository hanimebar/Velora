import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { ClassTypesManager } from '@/components/studio/class-types-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Class types' }

export default async function ClassTypesPage() {
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
      <div className="px-8 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Class types</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
            Define the types of classes your studio offers
          </p>
        </div>
        <ClassTypesManager studioId={studio.id} initialTypes={classTypes ?? []} />
      </div>
    </StudioShell>
  )
}
