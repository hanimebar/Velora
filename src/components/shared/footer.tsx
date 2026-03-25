import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-xs">
              Scheduling, memberships, and payments for independent wellness studios — yoga, Pilates, meditation, fitness, doula services, and more.
            </p>
            <p className="mt-4 text-xs text-[var(--color-foreground-subtle)]">
              Part of the Äctvli family
            </p>
          </div>

          <div>
            <p className="field-label mb-4">Product</p>
            <nav className="flex flex-col gap-2.5">
              <Link href="/pricing" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Pricing</Link>
              <Link href="/#features" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Features</Link>
              <Link href="/#migration" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Migration from Mindbody</Link>
              <Link href="/studio/signup" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Start free trial</Link>
            </nav>
          </div>

          <div>
            <p className="field-label mb-4">Legal</p>
            <nav className="flex flex-col gap-2.5">
              <Link href="/privacy" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Privacy policy</Link>
              <Link href="/terms" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">Terms of service</Link>
            </nav>
            <p className="mt-6 text-xs text-[var(--color-foreground-subtle)]">
              Contact: reachout@actvli.com
            </p>
          </div>
        </div>

        <hr className="my-10 border-[var(--color-border)]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            &copy; {new Date().getFullYear()} Äctvli Responsible Consulting. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            Built with care in Europe.
          </p>
        </div>
      </div>
    </footer>
  )
}
