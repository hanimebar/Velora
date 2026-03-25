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
    const { studio_id, name, class_count, price, currency, validity_days } = body

    const service = createServiceClient()
    const { data: studio } = await service
      .from('studios')
      .select('*')
      .eq('id', studio_id)
      .eq('owner_id', user.id)
      .single()

    if (!studio) return NextResponse.json({ error: 'Studio not found' }, { status: 404 })

    const stripe = getStripe()

    const product = await stripe.products.create({
      name,
      metadata: { studio_id, type: 'class_pack', class_count: String(class_count) },
    })

    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: currency.toLowerCase(),
    })

    const { data: pack, error } = await service
      .from('class_packs')
      .insert({
        studio_id,
        name,
        class_count,
        price,
        currency,
        stripe_price_id: stripePrice.id,
        stripe_product_id: product.id,
        validity_days,
        is_active: true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ pack }, { status: 201 })
  } catch (err) {
    console.error('[products/pack]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
