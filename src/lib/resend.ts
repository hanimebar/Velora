// Resend is always lazy-initialised — never at module scope
import { Resend } from 'resend'

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export const FROM_EMAIL = 'reachout@actvli.com'
export const FROM_NAME = 'Velora'
