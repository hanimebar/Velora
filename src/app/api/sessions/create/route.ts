export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { addWeeks } from 'date-fns'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      studio_id,
      class_type_id,
      instructor_name,
      starts_at,
      ends_at,
      capacity,
      recurrence,
      recurrence_count,
    } = body

    // Verify ownership
    const service = createServiceClient()
    const { data: studio } = await service
      .from('studios')
      .select('id')
      .eq('id', studio_id)
      .eq('owner_id', user.id)
      .single()

    if (!studio) return NextResponse.json({ error: 'Studio not found' }, { status: 404 })

    const sessions = []
    const baseStart = new Date(starts_at)
    const baseEnd = new Date(ends_at)
    const count = recurrence === 'none' ? 1 : (recurrence_count ?? 8)
    const weekInterval = recurrence === 'biweekly' ? 2 : 1

    for (let i = 0; i < count; i++) {
      const sessionStart = addWeeks(baseStart, i * weekInterval)
      const sessionEnd = addWeeks(baseEnd, i * weekInterval)

      sessions.push({
        studio_id,
        class_type_id,
        instructor_name,
        starts_at: sessionStart.toISOString(),
        ends_at: sessionEnd.toISOString(),
        capacity: parseInt(capacity),
        is_cancelled: false,
        cancellation_note: null,
        recurrence_rule: recurrence !== 'none' ? `FREQ=${recurrence === 'weekly' ? 'WEEKLY' : 'BIWEEKLY'};COUNT=${count}` : null,
      })
    }

    const { data, error } = await service
      .from('class_sessions')
      .insert(sessions)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ sessions: data }, { status: 201 })
  } catch (err) {
    console.error('[sessions/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
