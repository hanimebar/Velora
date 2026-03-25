'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface NewMembershipFormProps {
  studioId: string
  currency: string
}

export function NewMembershipForm({ studioId, currency }: NewMembershipFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    billing_interval: 'month' as 'month' | 'year',
    classes_per_period: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const priceInSmallestUnit = Math.round(parseFloat(form.price) * 100)

      const res = await fetch('/api/products/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio_id: studioId,
          name: form.name,
          description: form.description || null,
          price_per_period: priceInSmallestUnit,
          currency,
          billing_interval: form.billing_interval,
          classes_per_period: form.classes_per_period ? parseInt(form.classes_per_period) : null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create membership')

      router.push('/studio/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="m-name">Plan name</Label>
        <Input
          id="m-name"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Monthly Unlimited"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-desc">Description <span className="normal-case font-normal" style={{ color: 'var(--color-foreground-subtle)' }}>(optional)</span></Label>
        <Textarea
          id="m-desc"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Unlimited access to all classes..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="m-price">Price ({currency})</Label>
          <Input
            id="m-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="349.00"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Billing interval</Label>
          <Select value={form.billing_interval} onValueChange={(v) => setForm((p) => ({ ...p, billing_interval: v as 'month' | 'year' }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-classes">Classes per period <span className="normal-case font-normal" style={{ color: 'var(--color-foreground-subtle)' }}>(leave blank for unlimited)</span></Label>
        <Input
          id="m-classes"
          type="number"
          min="1"
          value={form.classes_per_period}
          onChange={(e) => setForm((p) => ({ ...p, classes_per_period: e.target.value }))}
          placeholder="Unlimited"
        />
      </div>

      {error && (
        <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading || !form.name || !form.price}>
          {loading ? 'Creating...' : 'Create membership plan'}
        </Button>
      </div>
    </form>
  )
}
