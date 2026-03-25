export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient as createRawClient } from '@supabase/supabase-js'
import { getResend, FROM_EMAIL } from '@/lib/resend'

// Use untyped client for this route to avoid strict generics issues
// with complex nested selects and mixed status enums
function createServiceClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing cancellation token' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: bookingRaw } = await service
    .from('bookings')
    .select('*, clients(email, first_name), class_sessions(starts_at, studio_id, class_types(name))')
    .eq('cancellation_token', token)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const booking = bookingRaw as any

  if (!booking) {
    return new Response(renderPage('Invalid or expired cancellation link', 'This cancellation link is not valid or has already been used.'), {
      headers: { 'Content-Type': 'text/html' },
      status: 404,
    })
  }

  if (booking.status === 'cancelled') {
    return new Response(renderPage('Already cancelled', 'This booking has already been cancelled.'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (booking.status !== 'confirmed' && booking.status !== 'waitlisted') {
    return new Response(renderPage('Cannot cancel', 'This booking cannot be cancelled.'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Check if class is in the future
  const session = booking.class_sessions as {
    starts_at: string
    class_types: { name: string } | null
    studios: { name: string; timezone: string } | null
  } | null

  if (session && new Date(session.starts_at) < new Date()) {
    return new Response(renderPage('Class already started', 'You cannot cancel a booking after the class has started.'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Cancel the booking
  const bookingId = booking.id as string
  await service
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', bookingId)

  // Return class credit if it was charged from a pack
  if (booking.charged_from === 'pack' && booking.client_pack_id) {
    const { data: pack } = await service
      .from('client_packs')
      .select('classes_used, classes_total')
      .eq('id', booking.client_pack_id)
      .single()

    if (pack && pack.classes_used > 0) {
      await service
        .from('client_packs')
        .update({ classes_used: pack.classes_used - 1, status: 'active' })
        .eq('id', booking.client_pack_id)
    }
  }

  // Return credit for membership
  if (booking.charged_from === 'membership' && booking.client_membership_id) {
    const { data: cm } = await service
      .from('client_memberships')
      .select('classes_used_this_period')
      .eq('id', booking.client_membership_id)
      .single()

    if (cm && cm.classes_used_this_period > 0) {
      await service
        .from('client_memberships')
        .update({ classes_used_this_period: cm.classes_used_this_period - 1 })
        .eq('id', booking.client_membership_id)
    }
  }

  // Promote first waitlisted client
  await promoteWaitlist(booking.session_id, booking.studio_id, service)

  // Send cancellation email
  const client = booking.clients as { email: string; first_name: string } | null
  if (client && session) {
    try {
      const resend = getResend()
      await resend.emails.send({
        from: FROM_EMAIL,
        to: client.email,
        subject: `Booking cancelled — ${session.class_types?.name ?? 'Class'}`,
        html: `
          <p>Hi ${client.first_name},</p>
          <p>Your booking for <strong>${session.class_types?.name ?? 'the class'}</strong> has been cancelled.</p>
          <p>If you used a class pack, your credit has been returned.</p>
          <p>— ${session.studios?.name ?? 'Your studio'}</p>
        `,
      })
    } catch (emailErr) {
      console.error('[cancel] Email error:', emailErr)
    }
  }

  return new Response(renderPage('Booking cancelled', 'Your booking has been cancelled. Your class credit (if any) has been returned.'), {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function promoteWaitlist(
  sessionId: string,
  studioId: string,
  service: ReturnType<typeof createServiceClient>
) {
  // Find first waitlisted booking
  const { data: waitlisted } = await service
    .from('bookings')
    .select('*, clients(*)')
    .eq('session_id', sessionId)
    .eq('studio_id', studioId)
    .eq('status', 'waitlisted')
    .order('booked_at', { ascending: true })
    .limit(1)
    .single()

  if (!waitlisted) return

  await service
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', waitlisted.id)

  const client = waitlisted.clients as { email: string; first_name: string } | null
  if (!client) return

  const { data: sessionData } = await service
    .from('class_sessions')
    .select('starts_at, class_types(name), studios(name)')
    .eq('id', sessionId)
    .single()

  try {
    const resend = getResend()
    const sessionInfo = sessionData as {
      starts_at: string
      class_types: { name: string } | null
      studios: { name: string } | null
    } | null

    await resend.emails.send({
      from: FROM_EMAIL,
      to: client.email,
      subject: `A spot just opened — ${sessionInfo?.class_types?.name ?? 'Class'}`,
      html: `
        <p>Hi ${client.first_name},</p>
        <p>Great news — a spot just opened up in <strong>${sessionInfo?.class_types?.name ?? 'the class'}</strong>.</p>
        <p>You've been automatically moved from the waitlist. Your booking is now confirmed.</p>
        <p>— ${sessionInfo?.studios?.name ?? 'Your studio'}</p>
      `,
    })
  } catch (err) {
    console.error('[waitlist] Email error:', err)
  }
}

function renderPage(title: string, message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Velora</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F6F2; color: #2D2620; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: white; border: 1px solid #DDD8D2; border-radius: 8px; padding: 2rem; max-width: 400px; text-align: center; }
  h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; }
  p { color: #6B5F57; font-size: 0.9rem; margin: 0; line-height: 1.6; }
</style>
</head>
<body>
<div class="card">
  <h1>${title}</h1>
  <p>${message}</p>
</div>
</body>
</html>`
}
