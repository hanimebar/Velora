'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface NewPackFormProps {
  studioId: string
  currency: string
}

export function NewPackForm({ studioId, currency }: NewPackFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    class_count: '10',
    price: '',
    validity_days: '90',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/products/pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio_id: studioId,
          name: form.name,
          class_count: parseInt(form.class_count),
          price: Math.round(parseFloat(form.price) * 100),
          currency,
          validity_days: parseInt(form.validity_days),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create class pack')

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
        <Label htmlFor="p-name">Pack name</Label>
        <Input
          id="p-name"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="10-class pack"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="p-count">Number of classes</Label>
          <Input
            id="p-count"
            type="number"
            min="1"
            max="200"
            required
            value={form.class_count}
            onChange={(e) => setForm((p) => ({ ...p, class_count: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-price">Price ({currency})</Label>
          <Input
            id="p-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="800.00"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-validity">Valid for (days)</Label>
        <Input
          id="p-validity"
          type="number"
          min="1"
          required
          value={form.validity_days}
          onChange={(e) => setForm((p) => ({ ...p, validity_days: e.target.value }))}
        />
        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
          Classes must be used within this many days from purchase.
        </p>
      </div>

      {error && (
        <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading || !form.name || !form.price}>
          {loading ? 'Creating...' : 'Create class pack'}
        </Button>
      </div>
    </form>
  )
}
