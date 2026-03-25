import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { format } from 'date-fns'
import { Calendar, Users, DollarSign, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/studio/login')

  // Fetch studio
  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  // Fetch today's sessions
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

  const { data: todaySessions } = await supabase
    .from('class_sessions')
    .select('*, class_types(name, color)')
    .eq('studio_id', studio.id)
    .eq('is_cancelled', false)
    .gte('starts_at', todayStart)
    .lt('starts_at', todayEnd)
    .order('starts_at', { ascending: true })

  // Active members count
  const { count: activeMembers } = await supabase
    .from('client_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('studio_id', studio.id)
    .eq('status', 'active')

  // Recent bookings
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('*, clients(first_name, last_name), class_sessions(starts_at, class_types(name))')
    .eq('studio_id', studio.id)
    .eq('status', 'confirmed')
    .order('booked_at', { ascending: false })
    .limit(5)

  // Total clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('studio_id', studio.id)

  const nextSession = todaySessions?.[0]

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <p className="field-label mb-1">{format(today, 'EEEE, d MMMM yyyy')}</p>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Good morning
          </h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Today's classes",
              value: todaySessions?.length ?? 0,
              sub: nextSession
                ? `Next: ${(nextSession.class_types as { name: string } | null)?.name ?? 'Class'} at ${format(new Date(nextSession.starts_at), 'HH:mm')}`
                : 'No more classes today',
              icon: Calendar,
            },
            {
              label: 'Active members',
              value: activeMembers ?? 0,
              sub: 'Recurring subscriptions',
              icon: Users,
            },
            {
              label: 'Total clients',
              value: totalClients ?? 0,
              sub: 'All time',
              icon: BookOpen,
            },
            {
              label: 'Revenue (est.)',
              value: '—',
              sub: 'Connect Stripe to track',
              icon: DollarSign,
            },
          ].map((card) => (
            <div key={card.label} className="velora-card">
              <div className="flex items-start justify-between mb-3">
                <p className="field-label">{card.label}</p>
                <div className="h-7 w-7 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                  <card.icon className="h-3.5 w-3.5" strokeWidth={1.5} style={{ color: 'var(--color-accent)' }} />
                </div>
              </div>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>{card.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's classes */}
          <div className="velora-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Today&rsquo;s classes</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/studio/schedule" className="flex items-center gap-1">
                  View schedule <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {!todaySessions || todaySessions.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--color-foreground-subtle)' }}>
                <Calendar className="h-8 w-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                <p className="text-sm">No classes scheduled today.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/studio/schedule/new">Add a class</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {todaySessions.map((session) => {
                  const classType = session.class_types as { name: string; color: string } | null
                  return (
                    <div key={session.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="h-3 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: classType?.color ?? 'var(--color-accent)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                          {classType?.name ?? 'Class'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                          {format(new Date(session.starts_at), 'HH:mm')} &middot; {session.instructor_name}
                        </p>
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--color-foreground-muted)' }}>
                        {format(new Date(session.starts_at), 'HH:mm')}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent bookings */}
          <div className="velora-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Recent bookings</h2>
            </div>

            {!recentBookings || recentBookings.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--color-foreground-subtle)' }}>
                <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                <p className="text-sm">No bookings yet.</p>
                <p className="text-xs mt-1">Share your booking page to get started.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {recentBookings.map((booking) => {
                  const client = booking.clients as { first_name: string; last_name: string } | null
                  const session = booking.class_sessions as { starts_at: string; class_types: { name: string } | null } | null
                  return (
                    <div key={booking.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                          {client ? `${client.first_name} ${client.last_name}` : 'Client'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                          {session?.class_types?.name ?? 'Class'} &middot;{' '}
                          {session ? format(new Date(session.starts_at), 'MMM d, HH:mm') : ''}
                        </p>
                      </div>
                      <span className="badge badge-active">Confirmed</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions — shown when studio is new */}
        {(totalClients ?? 0) === 0 && (
          <div className="mt-6 rounded border p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>Get started</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Create a class type', href: '/studio/classes', desc: 'Define your yoga or Pilates classes' },
                { label: 'Add your schedule', href: '/studio/schedule/new', desc: 'Set up recurring or one-off sessions' },
                { label: 'Import from Mindbody', href: '/studio/import', desc: 'Bring your existing client list' },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="block p-4 rounded border transition-velora hover:border-[var(--color-accent)]" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{action.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudioShell>
  )
}
