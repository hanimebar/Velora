import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/service'

interface BookLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BookLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const service = createServiceClient()

  const { data: studio } = await service
    .from('studios')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!studio) return {}

  return {
    title: studio.name,
    description: studio.description ?? `Book a class at ${studio.name}`,
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': studio.name,
    },
  }
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
