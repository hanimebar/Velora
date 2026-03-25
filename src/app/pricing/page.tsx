import Link from 'next/link'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for independent yoga and Pilates studios.',
}

const PLANS = [
  {
    name: 'Starter',
    price_sek: 79,
    price_eur: 7.9,
    period: 'month',
    description: 'For studios just getting started.',
    features: [
      'Up to 50 active clients',
      'Unlimited class sessions',
      'Client booking PWA',
      'Stripe payments',
      'Booking confirmation emails',
      '14-day free trial',
    ],
    cta: 'Start free trial',
    href: '/studio/signup',
    highlight: false,
  },
  {
    name: 'Studio',
    price_sek: 349,
    price_eur: 34.9,
    period: 'month',
    description: 'For established studios ready to grow.',
    features: [
      'Unlimited clients',
      'Everything in Starter',
      'Mindbody CSV import',
      'Waitlist management',
      'Priority email support',
      'Membership & pack products',
      '14-day free trial',
    ],
    cta: 'Start free trial',
    href: '/studio/signup',
    highlight: true,
  },
  {
    name: 'Pro',
    price_sek: 749,
    price_eur: 74.9,
    period: 'month',
    description: 'For multi-location studios. (Launching 2026)',
    features: [
      'Multiple locations (coming)',
      'Everything in Studio',
      'White-label booking page',
      'Priority phone support',
      'Dedicated onboarding',
      '14-day free trial',
    ],
    cta: 'Join waitlist',
    href: '/studio/signup',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <p className="field-label mb-3">Transparent pricing</p>
            <h1 className="font-display text-4xl md:text-5xl font-light" style={{ color: 'var(--color-foreground)' }}>
              Simple pricing.<br />
              <span className="italic">No surprises.</span>
            </h1>
            <p className="mt-4 max-w-md mx-auto" style={{ color: 'var(--color-foreground-muted)' }}>
              All plans include a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="velora-card relative flex flex-col"
                style={{
                  borderColor: plan.highlight ? 'var(--color-accent)' : 'var(--color-border)',
                  borderWidth: plan.highlight ? 2 : 1,
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-active px-3">Most popular</span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>{plan.name}</h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-foreground-muted)' }}>{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                      {plan.price_sek} kr
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-foreground-subtle)' }}>/ month</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                    or approx. €{plan.price_eur} / month
                  </p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                      <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? 'default' : 'outline'}
                  asChild
                  className="w-full"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-light mb-8 text-center" style={{ color: 'var(--color-foreground)' }}>
              Common questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Can I switch plans?',
                  a: 'Yes — you can upgrade or downgrade at any time. Changes take effect on your next billing date.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'All major credit and debit cards via Stripe. Nordic bank transfers on request.',
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No. The 14-day trial is completely free. You only pay when the trial ends.',
                },
                {
                  q: 'What happens to my data if I cancel?',
                  a: 'Your data is retained for 30 days after cancellation. You can export it at any time from the settings page.',
                },
                {
                  q: 'Do you offer annual billing?',
                  a: "Annual billing with 2 months free is coming in Q3 2026. Contact us if you'd like early access.",
                },
              ].map((item) => (
                <div key={item.q} className="border-b pb-6 last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{item.q}</p>
                  <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
