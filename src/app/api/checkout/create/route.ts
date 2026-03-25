export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      studio_id,
      session_id: classSessionId,
      client_email,
      client_first_name,
      client_last_name,
      product_type,
      product_id, // membership_id or class_pack_id
    } = body

    if (!studio_id || !classSessionId || !client_email || !product_type || !product_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = createServiceClient()

    // Validate studio
    const { data: studio } = await service
      .from('studios')
      .select('*')
      .eq('id', studio_id)
      .single()

    if (!studio) return NextResponse.json({ error: 'Studio not found' }, { status: 404 })

    // Validate session exists and has capacity
    const { data: classSession } = await service
      .from('class_sessions')
      .select('*')
      .eq('id', classSessionId)
      .eq('studio_id', studio_id)
      .single()

    if (!classSession) return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    if (classSession.is_cancelled) return NextResponse.json({ error: 'Class is cancelled' }, { status: 400 })

    const { count: confirmedCount } = await service
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', classSessionId)
      .in('status', ['confirmed', 'waitlisted'])

    const isFull = (confirmedCount ?? 0) >= classSession.capacity

    // Find or create client
    let { data: client } = await service
      .from('clients')
      .select('*')
      .eq('studio_id', studio_id)
      .eq('email', client_email.toLowerCase())
      .single()

    if (!client) {
      const { data: newClient } = await service
        .from('clients')
        .insert({
          studio_id,
          email: client_email.toLowerCase(),
          first_name: client_first_name ?? '',
          last_name: client_last_name ?? '',
          imported_from: 'manual',
        })
        .select()
        .single()
      client = newClient
    }

    if (!client) return NextResponse.json({ error: 'Could not create client' }, { status: 500 })

    // Get or create Stripe customer for client
    const stripe = getStripe()
    let stripeCustomerId = client.stripe_customer_id

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: client.email,
        name: `${client.first_name} ${client.last_name}`.trim(),
        metadata: { studio_id, client_id: client.id },
      })
      stripeCustomerId = stripeCustomer.id
      await service
        .from('clients')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', client.id)
    }

    // Create pending booking (waitlisted until webhook confirms)
    const cancellationToken = crypto.randomUUID()
    await service.from('bookings').insert({
      session_id: classSessionId,
      client_id: client.id,
      studio_id,
      status: isFull ? 'waitlisted' : 'waitlisted', // Always waitlisted until webhook
      booked_at: new Date().toISOString(),
      cancellation_token: cancellationToken,
      charged_from: null,
    })

    // Get product details
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://velora.actvli.com'

    if (product_type === 'membership') {
      const { data: membership } = await service
        .from('memberships')
        .select('*')
        .eq('id', product_id)
        .eq('studio_id', studio_id)
        .single()

      if (!membership?.stripe_price_id) {
        return NextResponse.json({ error: 'Membership product not configured' }, { status: 400 })
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId,
        line_items: [{ price: membership.stripe_price_id, quantity: 1 }],
        success_url: `${baseUrl}/book/${studio.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/book/${studio.slug}/class/${classSessionId}`,
        metadata: {
          studio_id,
          client_email: client.email,
          booking_session_id: classSessionId,
          product_type: 'membership',
          membership_id: product_id,
        },
        locale: 'sv',
        currency: studio.currency.toLowerCase(),
      })

      return NextResponse.json({ url: checkoutSession.url })
    } else if (product_type === 'pack') {
      const { data: pack } = await service
        .from('class_packs')
        .select('*')
        .eq('id', product_id)
        .eq('studio_id', studio_id)
        .single()

      if (!pack?.stripe_price_id) {
        return NextResponse.json({ error: 'Pack product not configured' }, { status: 400 })
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: stripeCustomerId,
        line_items: [{ price: pack.stripe_price_id, quantity: 1 }],
        success_url: `${baseUrl}/book/${studio.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/book/${studio.slug}/class/${classSessionId}`,
        metadata: {
          studio_id,
          client_email: client.email,
          booking_session_id: classSessionId,
          product_type: 'pack',
          class_pack_id: product_id,
        },
        locale: 'sv',
        currency: studio.currency.toLowerCase(),
      })

      return NextResponse.json({ url: checkoutSession.url })
    }

    return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
  } catch (err) {
    console.error('[checkout/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
