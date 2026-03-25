import crypto from 'crypto'

export function generateMagicLinkToken(email: string, expiresAt: number): string {
  return crypto
    .createHmac('sha256', process.env.MAGIC_LINK_SECRET!)
    .update(`${email}:${expiresAt}`)
    .digest('hex')
}

export function verifyMagicLinkToken(
  email: string,
  expiresAt: number,
  token: string
): boolean {
  const expected = generateMagicLinkToken(email, expiresAt)
  const expectedBuf = Buffer.from(expected, 'hex')
  const tokenBuf = Buffer.from(token, 'hex')

  if (expectedBuf.length !== tokenBuf.length) return false
  if (Date.now() > expiresAt) return false

  return crypto.timingSafeEqual(expectedBuf, tokenBuf)
}

export function magicLinkExpiry(hoursFromNow = 24): number {
  return Date.now() + hoursFromNow * 60 * 60 * 1000
}
