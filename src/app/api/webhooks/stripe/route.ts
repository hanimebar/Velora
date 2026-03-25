export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getStripe, getRawBody } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import type Stripe from 'stripe'
import { addDays } from 'date-fns'

export async function POST(req: Request) {
  const rawBody = await getRawBody(req)
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const service = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, service)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice, service)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription, service)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await service
          .from('client_memberships')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.error('[webhook] Payment failed for PI:', pi.id)
        // Log — do not cancel booking. Retry via Stripe Smart Retries.
        break
      }

      default:
        // Unhandled event — ignore silently
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  service: ReturnType<typeof createServiceClient>
) {
  const metadata = session.metadata ?? {}
  const { studio_id, client_email, booking_session_id, product_type, membership_id, class_pack_id } = metadata

  if (!studio_id || !client_email) {
    console.error('[webhook] Missing metadata in checkout session:', session.id)
    return
  }

  // Find or create client
  let { data: client } = await service
    .from('clients')
    .select('*')
    .eq('studio_id', studio_id)
    .eq('email', client_email)
    .single()

  if (!client) {
    console.error('[webhook] Client not found for email:', client_email)
    return
  }

  // Update client stripe_customer_id if not set
  if (!client.stripe_customer_id && session.customer) {
    await service
      .from('clients')
      .update({ stripe_customer_id: String(session.customer) })
      .eq('id', client.id)
  }

  if (product_type === 'pack' && class_pack_id) {
    // Provision class pack
    const { data: packDef } = await service
      .from('class_packs')
      .select('*')
      .eq('id', class_pack_id)
      .single()

    if (!packDef) return

    const expiresAt = addDays(new Date(), packDef.validity_days)

    const { data: clientPack } = await service
      .from('client_packs')
      .insert({
        client_id: client.id,
        studio_id,
        class_pack_id,
        stripe_payment_intent_id: session.payment_intent ? String(session.payment_intent) : null,
        classes_total: packDef.class_count,
        classes_used: 0,
        purchased_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        status: 'active',
      })
      .select()
      .single()

    // Confirm booking if one was associated
    if (booking_session_id && clientPack) {
      await confirmBooking(booking_session_id, client.id, studio_id, 'pack', clientPack.id, null, service)
    }
  } else if (product_type === 'membership' && membership_id) {
    // Subscription confirmation comes via invoice.paid — just confirm the booking here if immediate
    if (booking_session_id && session.subscription) {
      const { data: cm } = await service
        .from('client_memberships')
        .select('id')
        .eq('stripe_subscription_id', String(session.subscription))
        .single()

      if (cm) {
        await confirmBooking(booking_session_id, client.id, studio_id, 'membership', null, cm.id, service)
      }
    }
  }
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  service: ReturnType<typeof createServiceClient>
) {
  // Stripe v20: subscription reference location
  const subscriptionId =
    (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } })?.parent?.subscription_details?.subscription ??
    (invoice as unknown as { subscription?: string })?.subscription

  if (!subscriptionId) return

  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Find client membership
  const { data: cm } = await service
    .from('client_memberships')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (cm) {
    // Renew: reset period class counter
    // Stripe v20: period fields are on subscription items, not the subscription itself
    const firstItem = subscription.items.data[0]
    const periodStart = firstItem?.current_period_start
      ? new Date(firstItem.current_period_start * 1000).toISOString()
      : null
    const periodEnd = firstItem?.current_period_end
      ? new Date(firstItem.current_period_end * 1000).toISOString()
      : null

    await service
      .from('client_memberships')
      .update({
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        classes_used_this_period: 0,
      })
      .eq('id', cm.id)
  } else {
    // First invoice — provision membership
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

    // Find client by Stripe customer
    const { data: client } = await service
      .from('clients')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!client) return

    // Find membership definition by price
    const priceId = subscription.items.data[0]?.price?.id
    if (!priceId) return

    const { data: membershipDef } = await service
      .from('memberships')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single()

    if (!membershipDef) return

    // Stripe v20: period fields are on subscription items
    const item = subscription.items.data[0]
    const periodStart = item?.current_period_start
      ? new Date(item.current_period_start * 1000).toISOString()
      : null
    const periodEnd = item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null

    await service
      .from('client_memberships')
      .insert({
        client_id: client.id,
        studio_id: membershipDef.studio_id,
        membership_id: membershipDef.id,
        stripe_subscription_id: subscriptionId,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        classes_used_this_period: 0,
      })
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  service: ReturnType<typeof createServiceClient>
) {
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'cancelled',
    paused: 'paused',
    unpaid: 'past_due',
    incomplete: 'past_due',
    incomplete_expired: 'cancelled',
    trialing: 'active',
  }

  const mappedStatus = statusMap[subscription.status] ?? 'paused'

  // Stripe v20: period fields are on subscription items
  const item = subscription.items.data[0]
  const periodStart = item?.current_period_start
    ? new Date(item.current_period_start * 1000).toISOString()
    : null
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000).toISOString()
    : null

  await service
    .from('client_memberships')
    .update({
      status: mappedStatus as 'active' | 'paused' | 'cancelled' | 'past_due',
      current_period_start: periodStart,
      current_period_end: periodEnd,
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function confirmBooking(
  sessionId: string,
  clientId: string,
  studioId: string,
  chargedFrom: 'membership' | 'pack',
  clientPackId: string | null,
  clientMembershipId: string | null,
  service: ReturnType<typeof createServiceClient>
) {
  // Deduct credit if using pack
  if (chargedFrom === 'pack' && clientPackId) {
    const { data: pack } = await service
      .from('client_packs')
      .select('classes_used, classes_total')
      .eq('id', clientPackId)
      .single()

    if (pack) {
      const newUsed = pack.classes_used + 1
      await service
        .from('client_packs')
        .update({
          classes_used: newUsed,
          status: newUsed >= pack.classes_total ? 'exhausted' : 'active',
        })
        .eq('id', clientPackId)
    }
  }

  // Deduct from membership period counter if has limit
  if (chargedFrom === 'membership' && clientMembershipId) {
    const { data: cm } = await service
      .from('client_memberships')
      .select('classes_used_this_period, memberships(classes_per_period)')
      .eq('id', clientMembershipId)
      .single()

    if (cm) {
      await service
        .from('client_memberships')
        .update({ classes_used_this_period: cm.classes_used_this_period + 1 })
        .eq('id', clientMembershipId)
    }
  }

  // Confirm the booking
  await service
    .from('bookings')
    .update({
      status: 'confirmed',
      charged_from: chargedFrom,
      client_pack_id: clientPackId,
      client_membership_id: clientMembershipId,
    })
    .eq('session_id', sessionId)
    .eq('client_id', clientId)
    .eq('studio_id', studioId)
    .eq('status', 'waitlisted')
}
