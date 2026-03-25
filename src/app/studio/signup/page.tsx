'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/studio/onboarding`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-sm w-full text-center">
          <div className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--color-accent-light)' }}>
            <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--color-accent)' }} />
          </div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Check your inbox</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account and set up your studio.
          </p>
          <p className="mt-4 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
            Didn&rsquo;t receive it? Check your spam folder or{' '}
            <button className="underline underline-offset-2" onClick={() => setDone(false)}>try again</button>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
        <div className="mb-10">
          <Link href="/" className="font-display text-xl font-medium" style={{ color: 'var(--color-foreground)' }}>
            Velora
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>Start your free trial</h1>
          <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
            Already have an account?{' '}
            <Link href="/studio/login" className="underline underline-offset-2" style={{ color: 'var(--color-accent)' }}>
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourstudio.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          {['14-day free trial', 'No credit card required', 'Cancel anytime'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
              {item}
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2">Terms of service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link>.
        </p>
      </div>

      <div className="hidden lg:flex flex-1 flex-col justify-center px-12" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-sm space-y-6">
          <h2 className="font-display text-2xl font-light" style={{ color: 'var(--color-foreground)' }}>
            Everything your studio needs.<br />
            <span className="italic">Nothing it doesn&rsquo;t.</span>
          </h2>
          <div className="space-y-3">
            {[
              'Scheduling with recurring class rules',
              'Monthly memberships and class packs',
              'Client-facing booking page (installable PWA)',
              'Mindbody CSV import — switch in a morning',
              'Stripe payments, handled automatically',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                <div className="h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
