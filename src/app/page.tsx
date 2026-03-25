import Link from 'next/link'
import Image from 'next/image'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, CreditCard, Users, FileUp, Check, X, CheckCircle2 } from 'lucide-react'

// High-quality Unsplash images — yoga & Pilates studio photography
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=85',
  heroBg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80',
  schedule: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80',
  membership: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  pwa: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
  migration: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=600&q=80',
  testimonial: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1800&q=80',
  portrait: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80',
}

// Free Pexels yoga video — autoplay muted loop (behaves like a high-quality GIF)
const VIDEO_URL = 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_25fps.mp4'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <main className="flex-1">

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <p className="field-label mb-4" style={{ color: 'var(--color-accent)' }}>For every kind of wellness studio</p>
              <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.05] tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                Run your studio<br />
                <span className="italic">with the same care<br />you teach with.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
                Scheduling, memberships, and payments for independent wellness studios — yoga, Pilates, meditation, fitness, breathwork, and more. Half the cost of legacy software. Up and running in an afternoon.
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
                14-day trial. No credit card. Cancel anytime.
              </p>
            </div>

            {/* Right — hero image */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={IMAGES.hero}
                  alt="Yoga practitioner in morning light"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 50vw"
                  priority
                />
                {/* warm sage overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2620]/30 via-transparent to-transparent" />
              </div>
              {/* floating stat card */}
              <div className="absolute -bottom-6 -left-6 velora-card shadow-lg p-4 w-44">
                <p className="field-label">Active members</p>
                <p className="text-2xl font-semibold mt-1" style={{ color: 'var(--color-foreground)' }}>87</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>3 new this week</p>
              </div>
              <div className="absolute -top-4 -right-4 velora-card shadow-lg p-4 w-44">
                <p className="field-label">Monthly revenue</p>
                <p className="text-2xl font-semibold mt-1" style={{ color: 'var(--color-foreground)' }}>€3 240</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-accent)' }}>+12% this month</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Who it's for ────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-4">
          <div className="rounded-2xl px-8 py-6 flex flex-wrap gap-x-8 gap-y-3 items-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="field-label flex-shrink-0">Works for</span>
            {[
              'Yoga studios', 'Pilates studios', 'Meditation centres', 'Breathwork classes',
              'Sound healing', 'Personal trainers', 'Fitness classes', 'Dance studios',
              'Prenatal & doula', 'Wellness workshops', 'Barre & sculpt', 'Private instructors',
            ].map((tag) => (
              <span key={tag} className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>{tag}</span>
            ))}
          </div>
        </section>

        {/* ─── Video showcase ───────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl bg-[var(--color-surface)]">
            <video
              src={VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label="Yoga studio class in session"
            />
            {/* label overlay */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="velora-card inline-flex items-center gap-2 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>
                  Live: Morning Flow — 12/12 booked via Velora
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Feature grid ─────────────────────────────────────────── */}
        <section id="features" className="border-y py-20" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14">
              <p className="field-label mb-3">Everything your studio needs</p>
              <h2 className="font-display text-3xl md:text-4xl font-light" style={{ color: 'var(--color-foreground)' }}>
                Built for how independent instructors actually work
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Calendar,
                  title: 'Class schedule',
                  description: 'Recurring and one-off classes with capacity limits, instructor assignment, and waitlist management.',
                  img: IMAGES.schedule,
                  imgAlt: 'Yoga class in session',
                },
                {
                  icon: CreditCard,
                  title: 'Memberships & packs',
                  description: 'Monthly subscriptions and class packs with Stripe billing. Payments handled automatically.',
                  img: IMAGES.membership,
                  imgAlt: 'Pilates studio interior',
                },
                {
                  icon: Users,
                  title: 'Client booking PWA',
                  description: 'A beautiful, installable booking page for your clients — no app download, works on any phone.',
                  img: IMAGES.pwa,
                  imgAlt: 'Clients booking a yoga class',
                },
                {
                  icon: FileUp,
                  title: 'Mindbody migration',
                  description: 'Import your entire client list from a Mindbody CSV. Column mapping is automatic. Switch in a morning.',
                  img: IMAGES.migration,
                  imgAlt: 'Data migration wizard',
                },
              ].map((feature) => (
                <div key={feature.title} className="velora-card overflow-hidden !p-0 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={feature.img}
                      alt={feature.imgAlt}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/60 to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-8 w-8 rounded flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                      <feature.icon className="h-4 w-4" strokeWidth={1.5} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{feature.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Comparison table ─────────────────────────────────────── */}
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
                  { feature: 'Monthly cost', velora: 'From €7.90', mindbody: 'From €99', punchpass: 'From $35' },
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

        {/* ─── Migration story ──────────────────────────────────────── */}
        <section id="migration" className="border-y py-20" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <div>
                <p className="field-label mb-3">Switch in a morning, not a month</p>
                <h2 className="font-display text-3xl md:text-4xl font-light mb-5" style={{ color: 'var(--color-foreground)' }}>
                  Your entire studio,<br />
                  <span className="italic">migrated before lunch.</span>
                </h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-foreground-muted)' }}>
                  Export your client list from Mindbody as a CSV. Upload it to Velora. Our column mapping tool handles messy headers automatically. Every client gets a welcome email with a link to your new booking page.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Export client CSV from Mindbody (2 minutes)',
                    'Upload to Velora — headers mapped automatically',
                    'Review new, duplicate, and error rows',
                    'Velora sends a welcome email to all imported clients',
                    'Recreate your class schedule with recurring rules',
                    'Go live — clients book through your new page',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                        <span className="text-[0.6rem] font-semibold" style={{ color: 'var(--color-accent)' }}>{i + 1}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>{step}</p>
                    </div>
                  ))}
                </div>
                <Button asChild>
                  <Link href="/studio/signup">
                    Start your migration
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Migration image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <Image
                  src={IMAGES.migration}
                  alt="Pilates reformer class"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2620]/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="velora-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>Import preview</span>
                      <div className="flex gap-1.5">
                        <span className="badge badge-active">247 new</span>
                        <span className="badge badge-paused">12 dupl.</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {['Emma Svensson', 'Lina Johansson', 'Maria Nilsson'].map((name) => (
                        <div key={name} className="flex items-center justify-between text-xs">
                          <span style={{ color: 'var(--color-foreground)' }}>{name}</span>
                          <span className="badge badge-active">new</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Testimonial ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-28">
          {/* background image */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.testimonial}
              alt="Yoga studio"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#2D2620]/70" />
          </div>

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed text-white">
              &ldquo;We switched from Mindbody in an afternoon. Our clients didn&rsquo;t notice anything except that booking was faster.&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/30">
                <Image
                  src={IMAGES.portrait}
                  alt="Sofia Lindqvist"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Sofia Lindqvist</p>
                <p className="text-xs text-white/60">Owner, Solstudio Yoga — Stockholm</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: 'var(--color-foreground)' }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-display text-3xl md:text-5xl font-light text-white mb-4 leading-tight">
              Your practice deserves<br />
              <span className="italic">the right tools.</span>
            </p>
            <p className="mb-8 max-w-md mx-auto" style={{ color: '#9A8F89' }}>
              Yoga, Pilates, meditation, fitness, breathwork, doula services — Velora works for all of it. Start free, no credit card.
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
