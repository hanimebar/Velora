export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  try {
    const { headers } = await req.json()

    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'No headers provided' }, { status: 400 })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `You are a CSV column mapper. Given these column headers from a fitness studio client export, return a JSON object mapping our field names to the detected column headers.

Column headers: ${JSON.stringify(headers)}

Our fields are: first_name, last_name, email, phone

Rules:
- Only map fields you're confident about
- Return valid JSON only, no explanation
- Use null for fields you cannot find
- The object should look like: {"first_name": "First Name", "last_name": "Last Name", "email": "Email Address", "phone": "Mobile"}

Return only the JSON object, nothing else.`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ mapping: {} })
    }

    const jsonText = content.text.trim()
    const mapping = JSON.parse(jsonText)

    return NextResponse.json({ mapping })
  } catch (err) {
    console.error('[import/map-columns]', err)
    // Return empty mapping — the UI falls back to manual mapping
    return NextResponse.json({ mapping: {} })
  }
}
