'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const TIMEZONES = [
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
  { value: 'Europe/Oslo', label: 'Oslo (CET/CEST)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (CET/CEST)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'UTC', label: 'UTC' },
]

const CURRENCIES = [
  { value: 'SEK', label: 'SEK — Swedish Krona' },
  { value: 'NOK', label: 'NOK — Norwegian Krone' },
  { value: 'DKK', label: 'DKK — Danish Krone' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    timezone: 'Europe/Stockholm',
    currency: 'SEK',
    description: '',
    contact_email: '',
  })

  function update(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'name' && !prev.slug ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/studio/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create studio')
      }

      router.push('/studio/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const totalSteps = 2

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-10">
          <span className="font-display text-xl font-medium" style={{ color: 'var(--color-foreground)' }}>Velora</span>
          <h1 className="mt-6 text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Set up your studio</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-foreground-muted)' }}>
            This takes about two minutes. You can update everything later.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-velora"
              style={{
                backgroundColor: i < step ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            />
          ))}
          <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--color-foreground-subtle)' }}>
            {step} / {totalSteps}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Studio name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Solstudio Yoga"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Booking page URL</Label>
                <div className="flex items-center gap-0">
                  <div className="h-9 px-3 flex items-center text-sm rounded-l border border-r-0" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
                    velora.actvli.com/book/
                  </div>
                  <Input
                    id="slug"
                    required
                    value={form.slug}
                    onChange={(e) => update('slug', slugify(e.target.value))}
                    className="rounded-l-none"
                    placeholder="solstudio-yoga"
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact_email">Contact email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => update('contact_email', e.target.value)}
                  placeholder="hello@yourstudio.com"
                />
                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                  Shown to clients on your booking page.
                </p>
              </div>

              <Button type="button" className="w-full" onClick={() => setStep(2)} disabled={!form.name || !form.slug}>
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select value={form.timezone} onValueChange={(v) => update('timezone', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">About your studio <span className="normal-case font-normal" style={{ color: 'var(--color-foreground-subtle)' }}>(optional)</span></Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="A welcoming space for yoga and movement in central Stockholm..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating your studio...' : 'Create studio'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
