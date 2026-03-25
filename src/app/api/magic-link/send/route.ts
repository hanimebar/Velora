export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { generateMagicLinkToken, magicLinkExpiry } from '@/lib/hmac'

export async function POST(req: Request) {
  try {
    const { email, studio_slug } = await req.json()

    if (!email || !studio_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = createServiceClient()

    // Verify studio exists
    const { data: studio } = await service
      .from('studios')
      .select('name')
      .eq('slug', studio_slug)
      .single()

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    const expiresAt = magicLinkExpiry(24)
    const token = generateMagicLinkToken(email.toLowerCase(), expiresAt)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://velora.actvli.com'
    const magicLink = `${baseUrl}/book/${studio_slug}/my-bookings?email=${encodeURIComponent(email.toLowerCase())}&token=${token}&expires=${expiresAt}`

    const resend = getResend()
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email.toLowerCase(),
      subject: `Your booking history at ${studio.name}`,
      html: `
        <p>Hi,</p>
        <p>Click the link below to view your bookings at <strong>${studio.name}</strong>.</p>
        <p><a href="${magicLink}" style="color: #698C60; font-weight: 600;">View my bookings</a></p>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[magic-link/send]', err)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
