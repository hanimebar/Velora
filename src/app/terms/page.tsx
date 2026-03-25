import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of service',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-light mb-2" style={{ color: 'var(--color-foreground)' }}>Terms of service</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-foreground-subtle)' }}>Last updated: March 2026</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>1. Acceptance of terms</h2>
            <p>
              By creating an account or using Velora, you agree to these Terms of Service and our Privacy Policy. Velora is operated by Äctvli Responsible Consulting.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>2. The service</h2>
            <p>
              Velora provides studio scheduling, membership management, and payment processing software for independent fitness studios. We are not a party to transactions between studios and their clients.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>3. Account responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Maintaining the security of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Ensuring your use complies with applicable laws, including GDPR</li>
              <li>Obtaining necessary consents from your clients</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>4. Acceptable use</h2>
            <p>You may not use Velora to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Violate any applicable law or regulation</li>
              <li>Process payments for illegal goods or services</li>
              <li>Spam or harass clients</li>
              <li>Attempt to reverse-engineer or copy the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>5. Payments and billing</h2>
            <p>
              Payments are processed by Stripe. By creating products in Velora, you agree to Stripe&rsquo;s Terms of Service. Velora does not store card details. Subscriptions auto-renew unless cancelled.
            </p>
            <p className="mt-2">
              We reserve the right to change pricing with 30 days&rsquo; notice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>6. Free trial</h2>
            <p>
              New accounts receive a 14-day free trial. No credit card is required for the trial. At the end of the trial, the account is downgraded to read-only until a plan is selected.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>7. Data ownership</h2>
            <p>
              You retain ownership of all data you import or create in Velora. We will not use your client data for any purpose other than providing the service. Upon cancellation, you may export your data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>8. Limitation of liability</h2>
            <p>
              Velora is provided &ldquo;as is&rdquo;. We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>9. Termination</h2>
            <p>
              You may cancel your account at any time. We may suspend or terminate accounts that violate these terms, with notice where possible.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>10. Governing law</h2>
            <p>
              These terms are governed by Swedish law. Disputes shall be resolved in Swedish courts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>11. Contact</h2>
            <p>
              Questions about these terms: <a href="mailto:reachout@actvli.com" style={{ color: 'var(--color-accent)' }}>reachout@actvli.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
