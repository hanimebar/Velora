export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { studio_id, name, description, price_per_period, currency, billing_interval, classes_per_period } = body

    const service = createServiceClient()
    const { data: studio } = await service
      .from('studios')
      .select('*')
      .eq('id', studio_id)
      .eq('owner_id', user.id)
      .single()

    if (!studio) return NextResponse.json({ error: 'Studio not found' }, { status: 404 })

    // Create Stripe product + price
    const stripe = getStripe()

    const product = await stripe.products.create({
      name,
      description: description ?? undefined,
      metadata: { studio_id, type: 'membership' },
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: price_per_period,
      currency: currency.toLowerCase(),
      recurring: { interval: billing_interval },
    })

    // Save to DB
    const { data: membership, error } = await service
      .from('memberships')
      .insert({
        studio_id,
        name,
        description: description ?? null,
        price_per_period,
        currency,
        billing_interval,
        stripe_price_id: price.id,
        stripe_product_id: product.id,
        is_active: true,
        classes_per_period: classes_per_period ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ membership }, { status: 201 })
  } catch (err) {
    console.error('[products/membership]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
