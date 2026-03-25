export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, FROM_EMAIL } from '@/lib/resend'

interface ImportClient {
  first_name: string
  last_name: string
  email: string
  phone?: string
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { studio_id, studio_slug, clients } = await req.json()

    const service = createServiceClient()

    // Verify studio ownership
    const { data: studio } = await service
      .from('studios')
      .select('*')
      .eq('id', studio_id)
      .eq('owner_id', user.id)
      .single()

    if (!studio) return NextResponse.json({ error: 'Studio not found' }, { status: 404 })

    let imported = 0
    let errors = 0
    const BATCH_SIZE = 100

    for (let i = 0; i < clients.length; i += BATCH_SIZE) {
      const batch = (clients as ImportClient[]).slice(i, i + BATCH_SIZE)

      const toUpsert = batch
        .filter((c) => c.email && (c.first_name || c.last_name))
        .map((c) => ({
          studio_id,
          email: c.email.toLowerCase().trim(),
          first_name: c.first_name?.trim() ?? '',
          last_name: c.last_name?.trim() ?? '',
          phone: c.phone?.trim() || null,
          imported_from: 'mindbody_csv' as const,
        }))

      if (toUpsert.length === 0) continue

      const { error } = await service
        .from('clients')
        .upsert(toUpsert, {
          onConflict: 'studio_id,email',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error('[import/execute] batch error:', error)
        errors += toUpsert.length
      } else {
        imported += toUpsert.length
      }
    }

    // Send welcome emails (non-blocking, best-effort)
    sendWelcomeEmails(clients as ImportClient[], studio.name, studio_slug).catch((err) =>
      console.error('[import/execute] welcome email error:', err)
    )

    return NextResponse.json({ imported, errors })
  } catch (err) {
    console.error('[import/execute]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendWelcomeEmails(clients: ImportClient[], studioName: string, studioSlug: string) {
  const resend = getResend()
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/book/${studioSlug}`

  // Resend batch: 50 per call max
  const BATCH = 50
  for (let i = 0; i < clients.length; i += BATCH) {
    const batch = clients.slice(i, i + BATCH)

    await Promise.allSettled(
      batch.map((c) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: c.email,
          subject: `Welcome to ${studioName}`,
          html: `
            <p>Hi ${c.first_name || 'there'},</p>
            <p>You've been added to <strong>${studioName}</strong>'s new booking system.</p>
            <p>You can browse our schedule and book classes here:</p>
            <p><a href="${bookingUrl}" style="color: #698C60;">${bookingUrl}</a></p>
            <p>No password needed — just enter your email when booking.</p>
            <p>See you on the mat,<br>${studioName}</p>
          `,
        })
      )
    )
  }
}
