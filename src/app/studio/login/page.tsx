'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/studio/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
        <div className="mb-10">
          <Link href="/" className="font-display text-xl font-medium" style={{ color: 'var(--color-foreground)' }}>
            Velora
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>Sign in to your studio</h1>
          <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
            Don&rsquo;t have an account?{' '}
            <Link href="/studio/signup" className="underline underline-offset-2" style={{ color: 'var(--color-accent)' }}>
              Start a free trial
            </Link>
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>

          {error && (
            <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
          By signing in you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2">Terms of service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link>.
        </p>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12" style={{ backgroundColor: 'var(--color-surface)' }}>
        <blockquote className="max-w-sm">
          <p className="font-display text-2xl font-light italic leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
            &ldquo;Finally, software that feels like it was made by someone who actually visits yoga studios.&rdquo;
          </p>
          <footer className="mt-4">
            <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Maja Bergström</p>
            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Owner, Bergström Flow &mdash; Gothenburg</p>
          </footer>
        </blockquote>
      </div>
    </div>
  )
}
