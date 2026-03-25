import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { MyBookingsClient } from '@/components/book/my-bookings-client'
import { verifyMagicLinkToken } from '@/lib/hmac'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface MyBookingsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ email?: string; token?: string; expires?: string }>
}

export default async function MyBookingsPage({ params, searchParams }: MyBookingsPageProps) {
  const { slug } = await params
  const { email, token, expires } = await searchParams

  const service = createServiceClient()

  const { data: studio } = await service
    .from('studios')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!studio) notFound()

  // If no token, show the email request form
  if (!email || !token || !expires) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <Link href={`/book/${slug}`} style={{ color: 'var(--color-foreground-muted)' }}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-display text-lg font-medium" style={{ color: 'var(--color-foreground)' }}>{studio.name}</span>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-8">
          <MyBookingsClient studioSlug={slug} studioId={studio.id} />
        </main>
      </div>
    )
  }

  // Verify magic link token
  const expiresAt = parseInt(expires)
  const valid = verifyMagicLinkToken(email, expiresAt, token)

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center max-w-sm">
          <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Link expired</h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-foreground-muted)' }}>
            This link has expired or is invalid. Request a new one below.
          </p>
          <Link href={`/book/${slug}/my-bookings`} className="text-sm underline underline-offset-2" style={{ color: 'var(--color-accent)' }}>
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  // Fetch bookings
  const { data: client } = await service
    .from('clients')
    .select('*')
    .eq('studio_id', studio.id)
    .eq('email', email.toLowerCase())
    .single()

  const bookings = client ? await service
    .from('bookings')
    .select('*, class_sessions(starts_at, class_types(name, color))')
    .eq('client_id', client.id)
    .eq('studio_id', studio.id)
    .order('booked_at', { ascending: false })
    .limit(20)
    .then((r) => r.data) : []

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/book/${slug}`} style={{ color: 'var(--color-foreground-muted)' }}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-display text-lg font-medium" style={{ color: 'var(--color-foreground)' }}>{studio.name}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>My bookings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{email}</p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-foreground-subtle)' }}>
            <p className="text-sm">No bookings found for this email.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => {
              const session = booking.class_sessions as { starts_at: string; class_types: { name: string; color: string } | null } | null
              const ct = session?.class_types

              return (
                <div key={booking.id} className="velora-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {ct && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ct.color }} />}
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{ct?.name ?? 'Class'}</p>
                      </div>
                      {session && (
                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                          {format(new Date(session.starts_at), 'EEEE, d MMMM — HH:mm')}
                        </p>
                      )}
                    </div>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-active' :
                      booking.status === 'cancelled' ? 'badge-cancelled' :
                      booking.status === 'waitlisted' ? 'badge-paused' :
                      'badge-neutral'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
