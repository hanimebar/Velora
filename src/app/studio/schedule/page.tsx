import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { WeeklyCalendar } from '@/components/studio/weekly-calendar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Schedule' }

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/studio/login')

  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  // Fetch next 4 weeks of sessions
  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() + 28)

  const { data: sessions } = await supabase
    .from('class_sessions')
    .select('*, class_types(name, color, duration_minutes)')
    .eq('studio_id', studio.id)
    .gte('starts_at', now.toISOString())
    .lte('starts_at', end.toISOString())
    .order('starts_at', { ascending: true })

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Schedule</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
              Manage your class schedule
            </p>
          </div>
          <Button asChild>
            <Link href="/studio/schedule/new">
              <Plus className="h-4 w-4" />
              Add class
            </Link>
          </Button>
        </div>

        <WeeklyCalendar sessions={sessions ?? []} studioId={studio.id} />
      </div>
    </StudioShell>
  )
}
