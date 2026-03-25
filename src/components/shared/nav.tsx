'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/pricing"
            className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora"
          >
            Pricing
          </Link>
          <Link
            href="/#features"
            className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora"
          >
            Features
          </Link>
          <Link
            href="/#migration"
            className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora"
          >
            Migration
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/studio/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/studio/signup">Start free trial</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[var(--color-foreground-muted)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)] px-6 py-5 flex flex-col gap-4">
          <Link href="/pricing" className="text-sm text-[var(--color-foreground-muted)]" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/#features" className="text-sm text-[var(--color-foreground-muted)]" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#migration" className="text-sm text-[var(--color-foreground-muted)]" onClick={() => setOpen(false)}>Migration</Link>
          <hr className="border-[var(--color-border)]" />
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild><Link href="/studio/login">Sign in</Link></Button>
            <Button asChild><Link href="/studio/signup">Start free trial</Link></Button>
          </div>
        </div>
      )}
    </header>
  )
}
