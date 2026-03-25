import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuccessPageProps {
  params: Promise<{ slug: string }>
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-sm w-full text-center">
        <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--color-accent-light)' }}>
          <CheckCircle2 className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
        </div>

        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
          Payment received
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-foreground-muted)' }}>
          Thank you. Your booking confirmation will arrive by email shortly — including a link to cancel if needed.
        </p>

        <div className="rounded border p-4 text-sm text-left mb-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-foreground-muted)' }}>
          <p className="font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>What happens next</p>
          <ul className="space-y-1">
            <li>Your booking is being confirmed by our system</li>
            <li>You&rsquo;ll receive a confirmation email within a few minutes</li>
            <li>The email contains a link to cancel if needed</li>
          </ul>
        </div>

        <Button asChild className="w-full">
          <Link href={`/book/${slug}`}>Back to schedule</Link>
        </Button>
      </div>
    </div>
  )
}
