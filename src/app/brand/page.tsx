import Image from 'next/image'
import { Logo, LogoMarkOnly } from '@/components/shared/logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Guide',
  robots: { index: false },
}

const PALETTE = [
  { name: 'Background', hex: '#F8F6F2', role: 'Page & surface base', dark: false },
  { name: 'Surface', hex: '#F2EFE9', role: 'Cards, nav, subtle fills', dark: false },
  { name: 'Foreground', hex: '#2D2620', role: 'Primary text, CTAs', dark: true },
  { name: 'Foreground Muted', hex: '#5C4F46', role: 'Body copy, secondary text', dark: true },
  { name: 'Foreground Subtle', hex: '#9A8F89', role: 'Labels, timestamps, captions', dark: true },
  { name: 'Sage Green', hex: '#698C60', role: 'Primary accent, CTAs, icons', dark: true },
  { name: 'Sage Light', hex: '#E8F0E5', role: 'Accent backgrounds, badges', dark: false },
  { name: 'Clay Terracotta', hex: '#C17F60', role: 'Logo accent dot, warm highlights', dark: true },
  { name: 'Border', hex: '#E5E0D8', role: 'Dividers, card borders', dark: false },
]

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80', caption: 'Hero — natural light, one subject, calm' },
  { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80', caption: 'Atmosphere — meditation, stillness' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', caption: 'Community — group class energy' },
  { src: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=600&q=80', caption: 'Equipment — Pilates reformer, intimate detail' },
]

export default function BrandPage() {
  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#2D2620' }} className="px-10 py-12">
        <Logo reversed size="lg" />
        <p className="mt-6 text-white/50 text-sm max-w-md leading-relaxed">
          Brand guidelines for Velora — the studio software for independent yoga and Pilates studios.
          Use this guide to maintain visual and tonal consistency across every touchpoint.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16 space-y-20">

        {/* Logo */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Logo</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            The Velora mark is a three-petal lotus, symbol of opening, breath, and the triple focus of body, mind, and community.
            The terracotta dot at the base is a grounding element. Never distort, recolour, or separate the mark from the wordmark
            except where the icon-only variant is specified.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Primary */}
            <div className="rounded-xl border p-8 flex flex-col items-center gap-4" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
              <Logo size="lg" />
              <p className="text-xs text-center" style={{ color: '#9A8F89' }}>Primary — on light backgrounds</p>
            </div>

            {/* Reversed */}
            <div className="rounded-xl border p-8 flex flex-col items-center gap-4" style={{ borderColor: '#2D2620', backgroundColor: '#2D2620' }}>
              <Logo size="lg" reversed />
              <p className="text-xs text-center" style={{ color: '#9A8F89' }}>Reversed — on dark backgrounds</p>
            </div>

            {/* Mark only */}
            <div className="rounded-xl border p-8 flex flex-col items-center gap-4" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
              <LogoMarkOnly size="lg" />
              <p className="text-xs text-center" style={{ color: '#9A8F89' }}>Mark only — app icon, favicon, social avatar</p>
            </div>
          </div>

          {/* Don'ts */}
          <div className="mt-8 rounded-xl border p-6" style={{ borderColor: '#E5E0D8' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: '#2D2620' }}>Do not</p>
            <ul className="text-sm space-y-1.5" style={{ color: '#5C4F46' }}>
              <li>— Rotate or distort the mark</li>
              <li>— Apply drop shadows or gradients</li>
              <li>— Use the wordmark without the mark (except in plain-text contexts)</li>
              <li>— Place on backgrounds that reduce contrast below 4.5:1</li>
              <li>— Recolour the mark outside the approved palette</li>
            </ul>
          </div>
        </section>

        {/* Colour Palette */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Colour palette</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            The palette is warm and earthen — drawn from wabi-sabi ceramics, beeswax, linen, and forest sage.
            Colour is used sparingly. Space does most of the work.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PALETTE.map((swatch) => (
              <div key={swatch.hex} className="rounded-xl overflow-hidden border" style={{ borderColor: '#E5E0D8' }}>
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="p-4" style={{ backgroundColor: '#F2EFE9' }}>
                  <p className="text-sm font-semibold" style={{ color: '#2D2620' }}>{swatch.name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: '#698C60' }}>{swatch.hex}</p>
                  <p className="text-xs mt-1" style={{ color: '#9A8F89' }}>{swatch.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Typography</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            Two typefaces. Cormorant Garamond carries the soul — used for headlines, pull quotes, and the logo wordmark.
            DM Sans is the tool — used for all UI text, labels, and body copy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Display */}
            <div className="rounded-xl border p-8" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#9A8F89' }}>Display — Cormorant Garamond</p>
              <p className="font-display text-5xl font-light leading-tight" style={{ color: '#2D2620' }}>
                The body remembers what the mind forgets.
              </p>
              <p className="font-display text-2xl font-light italic mt-4" style={{ color: '#698C60' }}>
                Italic — for emphasis and pull quotes
              </p>
              <div className="mt-6 space-y-1 text-xs" style={{ color: '#9A8F89' }}>
                <p>Weight: 300 Light / 400 Regular / 700 Bold</p>
                <p>Use: headings, hero text, testimonials, logo</p>
              </div>
            </div>

            {/* UI */}
            <div className="rounded-xl border p-8" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#9A8F89' }}>UI — DM Sans</p>
              <p className="text-lg font-semibold" style={{ color: '#2D2620' }}>Semibold 600 — section headings</p>
              <p className="text-base mt-2" style={{ color: '#2D2620' }}>Regular 400 — body copy and labels</p>
              <p className="text-sm mt-2" style={{ color: '#5C4F46' }}>Small 14px — secondary descriptions and supporting text</p>
              <p className="text-xs font-semibold tracking-widest uppercase mt-2" style={{ color: '#9A8F89' }}>FIELD LABEL — 11px / 600 / 0.08em tracking</p>
              <div className="mt-6 space-y-1 text-xs" style={{ color: '#9A8F89' }}>
                <p>Weight: 300 / 400 / 500 / 600</p>
                <p>Use: all UI, navigation, buttons, forms, body</p>
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="mt-6 rounded-xl border p-8" style={{ borderColor: '#E5E0D8' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#9A8F89' }}>Type scale</p>
            <div className="space-y-4">
              {[
                { label: 'Display XL', sample: 'Practice every day', class: 'font-display text-6xl font-light' },
                { label: 'Display L', sample: 'Your studio, simplified', class: 'font-display text-4xl font-light' },
                { label: 'Display M', sample: 'Class schedule & memberships', class: 'font-display text-2xl font-light' },
                { label: 'Heading', sample: 'Upcoming classes this week', class: 'text-lg font-semibold' },
                { label: 'Body', sample: 'Book your next session in seconds — no app download required.', class: 'text-base' },
                { label: 'Small', sample: 'Monday, 09:30 — Morning Flow with Sofia', class: 'text-sm' },
                { label: 'Label', sample: 'TODAY\'S CLASSES', class: 'text-xs font-semibold tracking-widest uppercase' },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: '#9A8F89' }}>{item.label}</span>
                  <span className={item.class} style={{ color: '#2D2620' }}>{item.sample}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Photography */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Photography</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            Natural light. Real studios. Unhurried moments. Avoid stock-photo perfection — choose images that feel lived-in and authentic.
            Subjects are overwhelmingly women. Skin tones are diverse. The space is always clean but not clinical.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {IMAGES.map((img) => (
              <div key={img.src} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E5E0D8' }}>
                <div className="relative aspect-[4/3]">
                  <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="50vw" />
                </div>
                <div className="px-4 py-3" style={{ backgroundColor: '#F2EFE9' }}>
                  <p className="text-xs" style={{ color: '#9A8F89' }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border p-6" style={{ borderColor: '#E5E0D8' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#698C60' }}>Use</p>
              <ul className="text-sm space-y-1.5" style={{ color: '#5C4F46' }}>
                <li>+ Natural window light or outdoor morning light</li>
                <li>+ One or two subjects max per shot</li>
                <li>+ Warm, slightly desaturated colour grade</li>
                <li>+ Negative space — let the image breathe</li>
                <li>+ Authentic expressions, not posed smiles</li>
              </ul>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: '#E5E0D8' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#C17F60' }}>Avoid</p>
              <ul className="text-sm space-y-1.5" style={{ color: '#5C4F46' }}>
                <li>— Heavily filtered or oversaturated images</li>
                <li>— Generic fitness photography (dumbbells, gym equipment)</li>
                <li>— Aggressive, performance-sport energy</li>
                <li>— Low-resolution or compressed images</li>
                <li>— Images that feel competitive rather than restorative</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Voice & tone */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Voice &amp; tone</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            Velora speaks like a trusted colleague who knows the studio world deeply — not a tech startup, not a wellness guru.
            Confident. Warm. Never loud.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[
              { trait: 'Direct', description: 'Say what you mean. Cut filler. Every sentence earns its place.' },
              { trait: 'Warm', description: 'You\'re talking to studio owners who care deeply about their work. Match that care.' },
              { trait: 'Honest', description: 'No growth hacks, no inflated claims. If something is coming soon, say so.' },
            ].map((v) => (
              <div key={v.trait} className="rounded-xl border p-6" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
                <p className="font-display text-xl font-light mb-2" style={{ color: '#698C60' }}>{v.trait}</p>
                <p className="text-sm" style={{ color: '#5C4F46' }}>{v.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E5E0D8' }}>
            <div className="px-6 py-3 border-b" style={{ borderColor: '#E5E0D8', backgroundColor: '#F2EFE9' }}>
              <p className="text-xs font-semibold" style={{ color: '#2D2620' }}>Examples — do this, not that</p>
            </div>
            {[
              { do: 'Start your free trial — no credit card required.', dont: 'Sign up now and unlock unlimited power!' },
              { do: 'Migrate in a morning. We\'ll help you every step.', dont: 'Seamless migration with our AI-powered platform!' },
              { do: 'Half the price of Mindbody. All the features you actually use.', dont: 'Disrupting the studio management space with cutting-edge tech.' },
              { do: 'Your clients book in seconds. No app download.', dont: 'Frictionless, omnichannel client engagement solution.' },
            ].map((ex, i) => (
              <div key={i} className="grid grid-cols-2 divide-x border-t" style={{ borderColor: '#E5E0D8', divideColor: '#E5E0D8' }}>
                <div className="p-4">
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#698C60' }}>Do</p>
                  <p className="text-sm" style={{ color: '#2D2620' }}>{ex.do}</p>
                </div>
                <div className="p-4" style={{ backgroundColor: '#FAF8F5' }}>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#C17F60' }}>Not</p>
                  <p className="text-sm" style={{ color: '#9A8F89' }}>{ex.dont}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing & motion */}
        <section>
          <h2 className="font-display text-3xl font-light mb-2" style={{ color: '#2D2620' }}>Spacing &amp; motion</h2>
          <p className="text-sm mb-10" style={{ color: '#5C4F46' }}>
            Generous whitespace is non-negotiable. The UI should feel like walking into a calm, well-ordered studio — not a busy marketplace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border p-6" style={{ borderColor: '#E5E0D8' }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9A8F89' }}>Spacing scale</p>
              <div className="space-y-3">
                {[
                  { token: '4px', use: 'Icon–label gap, inline padding' },
                  { token: '8px', use: 'Input internal padding' },
                  { token: '16px', use: 'Card internal padding (sm)' },
                  { token: '20px / 24px', use: 'Card padding (default)' },
                  { token: '40px / 48px', use: 'Section internal padding' },
                  { token: '80px / 96px', use: 'Section vertical rhythm' },
                ].map((s) => (
                  <div key={s.token} className="flex gap-4 text-sm">
                    <span className="font-mono w-28 flex-shrink-0" style={{ color: '#698C60' }}>{s.token}</span>
                    <span style={{ color: '#5C4F46' }}>{s.use}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: '#E5E0D8' }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9A8F89' }}>Motion principles</p>
              <div className="space-y-3 text-sm" style={{ color: '#5C4F46' }}>
                <p><span style={{ color: '#2D2620', fontWeight: 500 }}>Still by default.</span> Nothing moves unless there is a reason.</p>
                <p><span style={{ color: '#2D2620', fontWeight: 500 }}>Duration: 100–150ms.</span> Fast enough to feel responsive, slow enough to feel considered.</p>
                <p><span style={{ color: '#2D2620', fontWeight: 500 }}>Easing: ease-out.</span> Things arrive gently, leave quickly.</p>
                <p><span style={{ color: '#2D2620', fontWeight: 500 }}>No parallax.</span> No scroll-triggered animations. No bouncing.</p>
                <p><span style={{ color: '#2D2620', fontWeight: 500 }}>Hover: subtle.</span> Colour shift or underline only — no transforms larger than scale(1.02).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer of guide */}
        <div className="border-t pt-8 text-center" style={{ borderColor: '#E5E0D8' }}>
          <Logo size="sm" />
          <p className="mt-3 text-xs" style={{ color: '#9A8F89' }}>
            Velora Brand Guidelines — Äctvli Responsible Consulting &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
