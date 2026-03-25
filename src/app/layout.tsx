import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Velora — Studio Scheduling & Membership Software',
    template: '%s | Velora',
  },
  description:
    'Scheduling, memberships, and payments for independent wellness studios — yoga, Pilates, meditation, fitness, breathwork, doula services, and more. Up and running in an afternoon.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://velora.actvli.com'),
  openGraph: {
    title: 'Velora — Studio Scheduling & Membership Software',
    description:
      'Scheduling, memberships, and payments for independent wellness instructors. Half the cost, all the features.',
    url: 'https://velora.actvli.com',
    siteName: 'Velora',
    locale: 'en_GB',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
