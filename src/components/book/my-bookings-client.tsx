'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'

interface MyBookingsClientProps {
  studioSlug: string
  studioId: string
}

export function MyBookingsClient({ studioSlug }: MyBookingsClientProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, studio_slug: studioSlug }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-accent-light)' }}>
          <Mail className="h-6 w-6" style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Check your inbox</h2>
        <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
          We sent a link to <strong>{email}</strong>. Click it to view your bookings.
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-foreground-subtle)' }}>
          The link expires in 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>My bookings</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-foreground-muted)' }}>
        Enter your email address and we&rsquo;ll send you a link to view your booking history.
      </p>

      <form onSubmit={handleRequest} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="mb-email">Email address</Label>
          <Input
            id="mb-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="emma@example.com"
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send booking link'}
        </Button>
      </form>
    </div>
  )
}
