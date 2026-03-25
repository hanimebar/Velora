import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { ClassDetailClient } from '@/components/book/class-detail-client'
import { format } from 'date-fns'
import { ArrowLeft, Clock, Users } from 'lucide-react'
import Link from 'next/link'

interface ClassDetailPageProps {
  params: Promise<{ slug: string; id: string }>
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { slug, id } = await params
  const service = createServiceClient()

  const { data: studio } = await service
    .from('studios')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!studio) notFound()

  const { data: session } = await service
    .from('class_sessions')
    .select('*, class_types(*)')
    .eq('id', id)
    .eq('studio_id', studio.id)
    .single()

  if (!session || session.is_cancelled) notFound()

  // Booking count
  const { count: booked } = await service
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', id)
    .in('status', ['confirmed', 'waitlisted'])

  // Products
  const [{ data: memberships }, { data: packs }] = await Promise.all([
    service.from('memberships').select('*').eq('studio_id', studio.id).eq('is_active', true),
    service.from('class_packs').select('*').eq('studio_id', studio.id).eq('is_active', true),
  ])

  const ct = session.class_types as { name: string; description: string | null; color: string; duration_minutes: number } | null
  const available = session.capacity - (booked ?? 0)
  const isFull = available <= 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/book/${slug}`} className="transition-velora" style={{ color: 'var(--color-foreground-muted)' }}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-display text-lg font-medium" style={{ color: 'var(--color-foreground)' }}>
            {studio.name}
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Class info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ct?.color ?? 'var(--color-accent)' }} />
            <h1 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>{ct?.name ?? 'Class'}</h1>
          </div>

          <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--color-foreground-muted)' }}>
            <span>{format(new Date(session.starts_at), 'EEEE, d MMMM')}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(new Date(session.starts_at), 'HH:mm')}
              {ct && ` — ${ct.duration_minutes} min`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
            <span>with {session.instructor_name}</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {isFull ? 'Class full — join waitlist' : `${available} of ${session.capacity} spots available`}
            </span>
          </div>

          {ct?.description && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
              {ct.description}
            </p>
          )}
        </div>

        <hr className="mb-6" />

        {/* Booking form */}
        <ClassDetailClient
          studioId={studio.id}
          studioSlug={slug}
          sessionId={id}
          memberships={memberships ?? []}
          packs={packs ?? []}
          currency={studio.currency}
          isFull={isFull}
        />
      </main>
    </div>
  )
}
