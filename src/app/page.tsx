import Link from 'next/link'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, CreditCard, Users, FileUp, CheckCircle2, Check, X } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <p className="field-label mb-4" style={{ color: 'var(--color-accent)' }}>Studio software for serious studios</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight" style={{ color: 'var(--color-foreground)' }}>
              The studio software<br />
              <span className="italic">Mindbody wishes it was.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed max-w-xl" style={{ color: 'var(--color-foreground-muted)' }}>
              Scheduling, memberships, and payments for independent yoga and Pilates studios. Nordic-first. Half the price. Migrate in a morning.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/studio/signup">
                  Start your free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
              14-day trial, no credit card required. Cancel anytime.
            </p>
          </div>

          {/* Hero visual */}
          <div className="mt-16 rounded-lg border overflow-hidden shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
            <div className="border-b px-5 py-3 flex items-center justify-between" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full opacity-70" style={{ backgroundColor: 'var(--color-danger-light)', borderWidth: 1, borderColor: 'var(--color-danger)' }} />
                <div className="h-2.5 w-2.5 rounded-full opacity-70" style={{ backgroundColor: 'var(--color-warning-light)', borderWidth: 1, borderColor: 'var(--color-warning)' }} />
                <div className="h-2.5 w-2.5 rounded-full opacity-70" style={{ backgroundColor: 'var(--color-accent-light)', borderWidth: 1, borderColor: 'var(--color-accent)' }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Velora Studio Dashboard</span>
              <div className="w-16" />
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Today's classes", value: '4', sub: 'Next: Flow Yoga at 09:30' },
                { label: 'Active members', value: '87', sub: '3 new this week' },
                { label: 'Monthly revenue', value: '32 450 kr', sub: 'MRR + pack sales' },
                { label: 'Bookings today', value: '41 / 48', sub: 'Capacity across sessions' },
              ].map((card) => (
                <div key={card.label} className="velora-card p-4">
                  <p className="field-label">{card.label}</p>
                  <p className="text-xl font-semibold mt-1" style={{ color: 'var(--color-foreground)' }}>{card.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{card.sub}</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-md border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>This week&rsquo;s schedule</span>
                  <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Mon 24 &mdash; Sun 30 Mar</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {[
                    { time: 'Mon 07:00', name: 'Morning Flow', instructor: 'Sofia Lindqvist', cap: '12/12', full: true },
                    { time: 'Mon 09:30', name: 'Yin & Restore', instructor: 'Maja Bergström', cap: '8/14', full: false },
                    { time: 'Tue 06:30', name: 'Power Pilates', instructor: 'Annika Holst', cap: '10/10', full: true },
                    { time: 'Tue 18:00', name: 'Evening Vinyasa', instructor: 'Sofia Lindqvist', cap: '9/14', full: false },
                  ].map((session) => (
                    <div key={`${session.time}-${session.name}`} className="px-4 py-2.5 flex items-center justify-between text-sm border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono w-20" style={{ color: 'var(--color-foreground-subtle)' }}>{session.time}</span>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>{session.name}</span>
                          <span className="ml-2" style={{ color: 'var(--color-foreground-subtle)' }}>with {session.instructor}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>{session.cap}</span>
                        <span className={`badge ${session.full ? 'badge-paused' : 'badge-active'}`}>
                          {session.full ? 'Full' : 'Open'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section id="features" className="border-y py-20" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <p className="field-label mb-3">Everything your studio needs</p>
              <h2 className="font-display text-3xl md:text-4xl font-light" style={{ color: 'var(--color-foreground)' }}>
                Built for how studios actually work
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Calendar,
                  title: 'Class schedule',
                  description: 'Recurring and one-off classes with capacity limits, instructor assignment, and waitlist management.',
                },
                {
                  icon: CreditCard,
                  title: 'Memberships & packs',
                  description: 'Monthly subscriptions and class packs with Stripe billing. Clients book in seconds, payments handled automatically.',
                },
                {
                  icon: Users,
                  title: 'Client booking PWA',
                  description: 'A beautiful, installable booking page for your clients — no app download, works on any phone.',
                },
                {
                  icon: FileUp,
                  title: 'Mindbody migration',
                  description: 'Import your entire client list from a Mindbody CSV. Column mapping is automatic. Switch in a morning.',
                },
              ].map((feature) => (
                <div key={feature.title} className="velora-card">
                  <div className="h-9 w-9 rounded flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                    <feature.icon className="h-5 w-5" strokeWidth={1.5} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="field-label mb-3">The honest comparison</p>
            <h2 className="font-display text-3xl md:text-4xl font-light" style={{ color: 'var(--color-foreground)' }}>
              How Velora compares
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="text-left py-3 pr-8 field-label">Feature</th>
                  <th className="text-left py-3 px-4 field-label" style={{ color: 'var(--color-accent)' }}>Velora</th>
                  <th className="text-left py-3 px-4 field-label">Mindbody</th>
                  <th className="text-left py-3 px-4 field-label">Punchpass</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Monthly cost', velora: 'From 79 SEK', mindbody: 'From €99', punchpass: 'From $35 USD' },
                  { feature: 'Class scheduling', velora: true, mindbody: true, punchpass: true },
                  { feature: 'Recurring memberships', velora: true, mindbody: true, punchpass: false },
                  { feature: 'Class packs', velora: true, mindbody: true, punchpass: true },
                  { feature: 'Waitlist management', velora: true, mindbody: true, punchpass: false },
                  { feature: 'Client booking PWA', velora: true, mindbody: true, punchpass: false },
                  { feature: 'CSV migration tool', velora: true, mindbody: false, punchpass: false },
                  { feature: 'GDPR compliant', velora: true, mindbody: 'Partial', punchpass: 'Partial' },
                  { feature: 'Nordic languages', velora: true, mindbody: false, punchpass: false },
                  { feature: 'Owned by PE firm', velora: false, mindbody: true, punchpass: false },
                ].map((row) => (
                  <tr key={row.feature} className="border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-3 pr-8" style={{ color: 'var(--color-foreground-muted)' }}>{row.feature}</td>
                    {([row.velora, row.mindbody, row.punchpass] as Array<boolean | string>).map((val, i) => (
                      <td key={i} className="py-3 px-4">
                        {val === true ? (
                          <Check className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
                        ) : val === false ? (
                          <X className="h-4 w-4" style={{ color: 'var(--color-foreground-subtle)' }} />
                        ) : (
                          <span style={{ color: 'var(--color-foreground)' }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Migration story */}
        <section id="migration" className="border-y py-20" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="field-label mb-3">Switch in a morning, not a month</p>
                <h2 className="font-display text-3xl md:text-4xl font-light mb-5" style={{ color: 'var(--color-foreground)' }}>
                  Your entire studio,<br />
                  <span className="italic">migrated before lunch.</span>
                </h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-foreground-muted)' }}>
                  Export your client list from Mindbody as a CSV. Upload it to Velora. Our column mapping tool handles messy headers automatically. Every client gets a welcome email with a link to your new booking page.
                </p>
                <div className="space-y-3">
                  {[
                    'Export client CSV from Mindbody (takes 2 minutes)',
                    'Upload to Velora — headers mapped automatically',
                    'Review new, duplicate, and error rows before importing',
                    'Velora sends a welcome email to all imported clients',
                    'Recreate your class schedule (with recurring rules)',
                    'Go live — your clients book through your new page',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                        <span className="text-[0.6rem] font-semibold" style={{ color: 'var(--color-accent)' }}>{i + 1}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/studio/signup">
                      Start your migration
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Migration wizard preview */}
              <div className="velora-card">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Import preview</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="badge badge-active">247 new</span>
                    <span className="badge badge-paused">12 duplicates</span>
                    <span className="badge badge-cancelled">3 errors</span>
                  </div>
                </div>
                <div className="rounded border overflow-hidden text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="px-3 py-2 grid grid-cols-3 gap-4 field-label" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Status</span>
                  </div>
                  {[
                    { name: 'Emma Svensson', email: 'emma.s@example.com', status: 'new' },
                    { name: 'Lina Johansson', email: 'lina.j@example.com', status: 'new' },
                    { name: 'Karin Berg', email: 'karin.b@example.com', status: 'duplicate' },
                    { name: 'Maria Nilsson', email: 'maria.n@example.com', status: 'new' },
                    { name: 'Sara Larsson', email: 'sara.l@example.com', status: 'new' },
                  ].map((row) => (
                    <div key={row.email} className="px-3 py-2 grid grid-cols-3 gap-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <span style={{ color: 'var(--color-foreground)' }}>{row.name}</span>
                      <span className="truncate" style={{ color: 'var(--color-foreground-subtle)' }}>{row.email}</span>
                      <span className={`badge ${row.status === 'new' ? 'badge-active' : 'badge-paused'}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Ready to import 247 clients</p>
                  <Button size="sm">Run import</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-display text-2xl md:text-3xl font-light italic leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
              &ldquo;We switched from Mindbody in an afternoon. Our clients didn&rsquo;t notice anything except that booking was faster.&rdquo;
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Sofia Lindqvist</p>
              <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Owner, Solstudio Yoga &mdash; Stockholm</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ backgroundColor: 'var(--color-foreground)' }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
              Your studio deserves better software.
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: '#9A8F89' }}>
              Start a 14-day free trial. No credit card. No contracts. Cancel anytime.
            </p>
            <Button size="lg" asChild style={{ backgroundColor: 'var(--color-accent)' }}>
              <Link href="/studio/signup">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              {['14-day free trial', 'No credit card required', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-2" style={{ color: '#9A8F89' }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
                  {item}
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
