import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('sv-SE', { style: 'currency', currency }).format(amount / 100)
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/studio/login')

  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  const [{ data: memberships }, { data: packs }] = await Promise.all([
    supabase.from('memberships').select('*').eq('studio_id', studio.id).order('price_per_period'),
    supabase.from('class_packs').select('*').eq('studio_id', studio.id).order('price'),
  ])

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Products</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
            Memberships and class packs for your clients
          </p>
        </div>

        {/* Memberships */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Memberships</h2>
            <Button size="sm" asChild>
              <Link href="/studio/products/new-membership">
                <Plus className="h-3.5 w-3.5" /> New membership
              </Link>
            </Button>
          </div>

          {!memberships || memberships.length === 0 ? (
            <div className="text-center py-10 rounded-lg border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
              <Package className="h-8 w-8 mx-auto mb-3 opacity-25" strokeWidth={1} />
              <p className="text-sm">No memberships yet. Create one to start selling subscriptions.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {memberships.map((m) => (
                <div key={m.id} className="velora-card flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{m.name}</p>
                      <span className={`badge ${m.is_active ? 'badge-active' : 'badge-neutral'}`}>
                        {m.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {m.description && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{m.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {formatCurrency(m.price_per_period, m.currency)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>per {m.billing_interval}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                      {m.classes_per_period == null ? 'Unlimited classes' : `${m.classes_per_period} classes / ${m.billing_interval}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Class packs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Class packs</h2>
            <Button size="sm" asChild>
              <Link href="/studio/products/new-pack">
                <Plus className="h-3.5 w-3.5" /> New pack
              </Link>
            </Button>
          </div>

          {!packs || packs.length === 0 ? (
            <div className="text-center py-10 rounded-lg border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
              <Package className="h-8 w-8 mx-auto mb-3 opacity-25" strokeWidth={1} />
              <p className="text-sm">No class packs yet. Create one to sell class bundles.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {packs.map((p) => (
                <div key={p.id} className="velora-card flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{p.name}</p>
                      <span className={`badge ${p.is_active ? 'badge-active' : 'badge-neutral'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {formatCurrency(p.price, p.currency)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>one-time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                      {p.class_count} classes &middot; {p.validity_days} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </StudioShell>
  )
}
