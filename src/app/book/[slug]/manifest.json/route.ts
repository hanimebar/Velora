export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const service = createServiceClient()

  const { data: studio } = await service
    .from('studios')
    .select('name')
    .eq('slug', slug)
    .single()

  const name = studio?.name ?? 'Velora Booking'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://velora.actvli.com'

  const manifest = {
    name,
    short_name: name.length > 12 ? name.split(' ')[0] : name,
    description: `Book classes at ${name}`,
    start_url: `/book/${slug}`,
    display: 'standalone',
    background_color: '#F8F6F2',
    theme_color: '#698C60',
    orientation: 'portrait',
    icons: [
      {
        src: `${baseUrl}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: `${baseUrl}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
