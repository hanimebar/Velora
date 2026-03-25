'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { format, isSameDay, startOfDay } from 'date-fns'
import { Clock, Users } from 'lucide-react'
import type { ClassSession } from '@/types/database'

interface SessionWithType extends ClassSession {
  class_types: {
    name: string
    description: string | null
    color: string
    duration_minutes: number
  } | null
}

interface BookingScheduleProps {
  sessions: SessionWithType[]
  bookingCounts: Record<string, number>
  studioSlug: string
  studioTimezone: string
}

export function BookingSchedule({ sessions, bookingCounts, studioSlug }: BookingScheduleProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, SessionWithType[]>()

    for (const session of sessions) {
      const day = startOfDay(new Date(session.starts_at)).toISOString()
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(session)
    }

    return Array.from(map.entries()).map(([day, daySessions]) => ({
      day: new Date(day),
      sessions: daySessions,
    }))
  }, [sessions])

  if (grouped.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--color-foreground-subtle)' }}>
        <p className="text-sm">No upcoming classes scheduled.</p>
        <p className="text-xs mt-1">Check back soon.</p>
      </div>
    )
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <div className="space-y-6">
      {grouped.map(({ day, sessions: daySessions }) => {
        const isToday = isSameDay(day, today)
        const isTomorrow = isSameDay(day, tomorrow)
        const label = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(day, 'EEEE, d MMMM')

        return (
          <div key={day.toISOString()}>
            <div className="flex items-center gap-3 mb-3">
              <span className="field-label">{label}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>

            <div className="space-y-2">
              {daySessions.map((session) => {
                const ct = session.class_types
                const booked = bookingCounts[session.id] ?? 0
                const available = session.capacity - booked
                const full = available <= 0

                return (
                  <Link
                    key={session.id}
                    href={`/book/${studioSlug}/class/${session.id}`}
                    className="block rounded-lg border p-4 transition-velora"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-surface-raised)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: ct?.color ?? 'var(--color-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                            {ct?.name ?? 'Class'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(session.starts_at), 'HH:mm')}
                            {ct && <span className="ml-0.5">&middot; {ct.duration_minutes} min</span>}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {full ? 'Full' : `${available} spots left`}
                          </span>
                        </div>
                      </div>
                      <span className={`badge flex-shrink-0 mt-0.5 ${full ? 'badge-paused' : 'badge-active'}`}>
                        {full ? 'Waitlist' : 'Book'}
                      </span>
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--color-foreground-muted)' }}>
                      with {session.instructor_name}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
