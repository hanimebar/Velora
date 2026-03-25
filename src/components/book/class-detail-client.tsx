'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Membership, ClassPack } from '@/types/database'

interface ClassDetailClientProps {
  studioId: string
  studioSlug: string
  sessionId: string
  memberships: Membership[]
  packs: ClassPack[]
  currency: string
  isFull: boolean
}

type ProductType = 'membership' | 'pack'

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount / 100)
}

export function ClassDetailClient({
  studioId,
  studioSlug,
  sessionId,
  memberships,
  packs,
  currency,
  isFull,
}: ClassDetailClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'product'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [selectedType, setSelectedType] = useState<ProductType | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  async function handleCheckout() {
    if (!selectedType || !selectedId) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio_id: studioId,
          session_id: sessionId,
          client_email: email,
          client_first_name: firstName,
          client_last_name: lastName,
          product_type: selectedType,
          product_id: selectedId,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (step === 'details') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
            {isFull ? 'Join the waitlist' : 'Book your spot'}
          </h2>
          {isFull && (
            <div className="rounded border p-3 text-sm mb-4" style={{ borderColor: 'var(--color-warning-light)', backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              This class is full. You&rsquo;ll be added to the waitlist and notified if a spot opens.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="b-first">First name</Label>
            <Input
              id="b-first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Emma"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-last">Last name</Label>
            <Input
              id="b-last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Svensson"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="b-email">Email address</Label>
          <Input
            id="b-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="emma@example.com"
          />
          <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
            We&rsquo;ll send your booking confirmation here.
          </p>
        </div>

        <Button
          className="w-full"
          onClick={() => setStep('product')}
          disabled={!firstName || !email}
        >
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={() => setStep('details')} className="text-sm flex items-center gap-1 transition-velora" style={{ color: 'var(--color-foreground-muted)' }}>
        &larr; Back
      </button>

      <div>
        <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>Choose how to pay</h2>
        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>You&rsquo;ll be redirected to Stripe to complete payment securely.</p>
      </div>

      {memberships.length > 0 && (
        <div>
          <p className="field-label mb-2">Memberships</p>
          <div className="space-y-2">
            {memberships.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setSelectedType('membership'); setSelectedId(m.id) }}
                className="w-full text-left rounded-lg border p-3 transition-velora"
                style={{
                  borderColor: selectedId === m.id ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: selectedId === m.id ? 'var(--color-accent-light)' : 'var(--color-surface-raised)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{m.name}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {formatCurrency(m.price_per_period, currency)} / {m.billing_interval}
                  </p>
                </div>
                {m.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{m.description}</p>
                )}
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                  {m.classes_per_period == null ? 'Unlimited classes' : `${m.classes_per_period} classes / ${m.billing_interval}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {packs.length > 0 && (
        <div>
          <p className="field-label mb-2">Class packs</p>
          <div className="space-y-2">
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedType('pack'); setSelectedId(p.id) }}
                className="w-full text-left rounded-lg border p-3 transition-velora"
                style={{
                  borderColor: selectedId === p.id ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: selectedId === p.id ? 'var(--color-accent-light)' : 'var(--color-surface-raised)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{p.name}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {formatCurrency(p.price, currency)}
                  </p>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                  {p.class_count} classes &middot; valid for {p.validity_days} days
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {memberships.length === 0 && packs.length === 0 && (
        <div className="text-center py-6 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
          No booking options available. Please contact the studio directly.
        </div>
      )}

      {error && (
        <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleCheckout}
        disabled={loading || !selectedId}
      >
        {loading ? 'Redirecting to payment...' : 'Proceed to payment'}
      </Button>

      <p className="text-xs text-center" style={{ color: 'var(--color-foreground-subtle)' }}>
        Secured by Stripe. Your payment info is never stored on our servers.
      </p>
    </div>
  )
}
