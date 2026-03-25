export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, timezone, currency, description, contact_email } = body

    if (!name || !slug || !timezone || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    // Check slug uniqueness
    const service = createServiceClient()
    const { data: existing } = await service
      .from('studios')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This URL is already taken. Please choose another.' }, { status: 409 })
    }

    // Create Stripe customer
    const stripe = getStripe()
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      name,
      metadata: { studio_slug: slug, owner_id: user.id },
    })

    // Create studio
    const { data: studio, error: studioError } = await service
      .from('studios')
      .insert({
        owner_id: user.id,
        name,
        slug,
        timezone,
        currency,
        description: description || null,
        contact_email: contact_email || null,
        stripe_customer_id: stripeCustomer.id,
        is_active: true,
      })
      .select()
      .single()

    if (studioError) {
      return NextResponse.json({ error: studioError.message }, { status: 500 })
    }

    return NextResponse.json({ studio }, { status: 201 })
  } catch (err) {
    console.error('[studio/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
