import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="font-display text-lg font-medium text-[var(--color-foreground)]">
              Velora
            </span>
            <p className="mt-3 text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-xs">
              Studio scheduling, memberships, and payments — built for independent yoga and Pilates studios.
            </p>
            <p className="mt-4 text-xs text-[var(--color-foreground-subtle)]">
              Part of the Äctvli family
            </p>
          </div>

          <div>
            <p className="field-label mb-3">Product</p>
            <nav className="flex flex-col gap-2">
              <Link href="/pricing" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Pricing
              </Link>
              <Link href="/#features" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Features
              </Link>
              <Link href="/#migration" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Migration from Mindbody
              </Link>
              <Link href="/studio/signup" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Start free trial
              </Link>
            </nav>
          </div>

          <div>
            <p className="field-label mb-3">Legal</p>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Privacy policy
              </Link>
              <Link href="/terms" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-velora">
                Terms of service
              </Link>
            </nav>
            <p className="mt-6 text-xs text-[var(--color-foreground-subtle)]">
              Contact: reachout@actvli.com
            </p>
          </div>
        </div>

        <hr className="my-8" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            &copy; {new Date().getFullYear()} Äctvli Responsible Consulting. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            Nordic-first. Built with care.
          </p>
        </div>
      </div>
    </footer>
  )
}
