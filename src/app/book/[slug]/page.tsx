import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { BookingSchedule } from '@/components/book/booking-schedule'
import Link from 'next/link'

interface BookPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params
  const service = createServiceClient()

  const { data: studio } = await service
    .from('studios')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!studio) notFound()

  // Fetch upcoming sessions (next 14 days)
  const now = new Date()
  const twoWeeksLater = new Date(now)
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

  const { data: sessions } = await service
    .from('class_sessions')
    .select('*, class_types(name, description, color, duration_minutes)')
    .eq('studio_id', studio.id)
    .eq('is_cancelled', false)
    .gte('starts_at', now.toISOString())
    .lte('starts_at', twoWeeksLater.toISOString())
    .order('starts_at', { ascending: true })

  // Get booking counts for capacity display
  const sessionIds = (sessions ?? []).map((s) => s.id)
  const { data: bookingCounts } = sessionIds.length > 0 ? await service
    .from('bookings')
    .select('session_id')
    .in('session_id', sessionIds)
    .in('status', ['confirmed', 'waitlisted']) : { data: [] }

  const countBySession: Record<string, number> = {}
  for (const b of bookingCounts ?? []) {
    countBySession[b.session_id] = (countBySession[b.session_id] ?? 0) + 1
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* PWA header */}
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <span className="font-display text-lg font-medium" style={{ color: 'var(--color-foreground)' }}>
              {studio.name}
            </span>
          </div>
          <Link
            href={`/book/${slug}/my-bookings`}
            className="text-xs font-medium transition-velora"
            style={{ color: 'var(--color-accent)' }}
          >
            My bookings
          </Link>
        </div>
      </header>

      {/* Schedule */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {studio.description && (
          <p className="text-sm mb-6 pb-6 border-b leading-relaxed" style={{ color: 'var(--color-foreground-muted)', borderColor: 'var(--color-border)' }}>
            {studio.description}
          </p>
        )}

        <BookingSchedule
          sessions={sessions ?? []}
          bookingCounts={countBySession}
          studioSlug={slug}
          studioTimezone={studio.timezone}
        />

        {/* PWA install prompt */}
        <div className="mt-8 p-4 rounded-lg border text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>Install this booking page</p>
          <p style={{ color: 'var(--color-foreground-muted)' }}>
            On iPhone: tap the Share button then &ldquo;Add to Home Screen&rdquo; for quick access to {studio.name}&rsquo;s schedule.
          </p>
        </div>
      </main>
    </div>
  )
}
