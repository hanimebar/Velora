'use client'

import { useState } from 'react'
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ClassSession } from '@/types/database'

interface SessionWithType extends ClassSession {
  class_types: { name: string; color: string; duration_minutes: number } | null
}

interface WeeklyCalendarProps {
  sessions: SessionWithType[]
  studioId: string
}

export function WeeklyCalendar({ sessions }: WeeklyCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  function getSessionsForDay(day: Date) {
    return sessions.filter((s) => isSameDay(new Date(s.starts_at), day))
  }

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
            {format(weekStart, 'MMMM d')} &ndash; {format(addDays(weekStart, 6), 'd, yyyy')}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
          Today
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="px-3 py-2.5 text-center border-r last:border-r-0"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <p className="field-label text-center">{format(day, 'EEE')}</p>
              <p
                className={`text-sm font-medium mt-0.5 h-6 w-6 mx-auto flex items-center justify-center rounded-full ${isSameDay(day, today) ? 'text-white' : ''}`}
                style={{
                  color: isSameDay(day, today) ? 'white' : 'var(--color-foreground)',
                  backgroundColor: isSameDay(day, today) ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {days.map((day) => {
            const daySessions = getSessionsForDay(day)
            return (
              <div
                key={day.toISOString()}
                className="border-r last:border-r-0 p-2 space-y-1.5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {daySessions.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-center" style={{ color: 'var(--color-foreground-subtle)' }}>—</p>
                  </div>
                )}
                {daySessions.map((session) => {
                  const ct = session.class_types
                  return (
                    <div
                      key={session.id}
                      className="rounded p-2 text-xs cursor-pointer hover:opacity-90 transition-velora"
                      style={{
                        backgroundColor: ct?.color ? `${ct.color}20` : 'var(--color-accent-light)',
                        borderLeft: `3px solid ${ct?.color ?? 'var(--color-accent)'}`,
                      }}
                    >
                      <p className="font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>
                        {ct?.name ?? 'Class'}
                      </p>
                      <p style={{ color: 'var(--color-foreground-subtle)' }}>
                        {format(new Date(session.starts_at), 'HH:mm')}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                        <Users className="h-2.5 w-2.5" />
                        <span>{session.capacity}</span>
                      </div>
                      {session.is_cancelled && (
                        <span className="badge badge-cancelled mt-1">Cancelled</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
