import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy policy',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-light mb-2" style={{ color: 'var(--color-foreground)' }}>Privacy policy</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-foreground-subtle)' }}>Last updated: March 2026</p>

        <div className="prose-velora space-y-8 text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>1. Who we are</h2>
            <p>
              Velora is operated by Äctvli Responsible Consulting (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;).
              Contact: <a href="mailto:reachout@actvli.com" style={{ color: 'var(--color-accent)' }}>reachout@actvli.com</a>
            </p>
            <p className="mt-2">
              We act as a data controller for studio owner accounts, and as a data processor for end-client data held on behalf of studio owners.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>2. Data we collect</h2>
            <p><strong>Studio owners:</strong> Email address, password (hashed), studio name, payment information (via Stripe — we do not store card numbers).</p>
            <p className="mt-2"><strong>Studio clients (end users):</strong> First name, last name, email address, phone number (optional), booking history, payment history via Stripe.</p>
            <p className="mt-2"><strong>Automatically:</strong> Log data, IP addresses (stored for security purposes only, purged after 30 days).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>3. How we use it</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide the Velora service (scheduling, booking, payments)</li>
              <li>To send transactional emails (booking confirmations, waitlist notifications)</li>
              <li>To process payments via Stripe</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-2">We do not sell personal data. We do not use personal data for advertising.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>4. Legal basis (GDPR)</h2>
            <p>We process data on the following legal bases:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Contract performance</strong> — to deliver the service you signed up for</li>
              <li><strong>Legitimate interest</strong> — security logging, fraud prevention</li>
              <li><strong>Consent</strong> — marketing emails (opt-in only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>5. Data retention</h2>
            <p>Account data is retained for as long as you hold an active account. Upon cancellation, data is retained for 30 days then deleted, unless required by law. You can request immediate deletion.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>6. Third-party processors</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Supabase</strong> — database and authentication (EU region)</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Vercel</strong> — hosting (EU region)</li>
              <li><strong>Anthropic</strong> — AI column mapping (CSV headers only, no personal data transmitted)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>7. Your rights</h2>
            <p>Under GDPR you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Access your data (right of access)</li>
              <li>Correct inaccurate data (right to rectification)</li>
              <li>Delete your data (right to erasure)</li>
              <li>Restrict or object to processing</li>
              <li>Data portability (receive your data in a machine-readable format)</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:reachout@actvli.com" style={{ color: 'var(--color-accent)' }}>reachout@actvli.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>8. Cookies</h2>
            <p>
              We use only functional cookies necessary for authentication (session tokens set by Supabase). We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>9. Data processing agreement</h2>
            <p>
              Studio owners who process personal data of their clients through Velora can request a Data Processing Agreement (DPA) by emailing{' '}
              <a href="mailto:reachout@actvli.com" style={{ color: 'var(--color-accent)' }}>reachout@actvli.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>10. Changes to this policy</h2>
            <p>
              We may update this policy periodically. We will notify account holders by email of material changes. The current version is always available at this URL.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
