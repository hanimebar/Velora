import { getResend, FROM_EMAIL } from '@/lib/resend'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

interface SendBookingConfirmationParams {
  to: string
  clientName: string
  className: string
  startsAt: Date
  instructorName: string
  studioName: string
  cancellationToken: string
  baseUrl: string
}

export async function sendBookingConfirmation({
  to,
  clientName,
  className,
  startsAt,
  instructorName,
  studioName,
  cancellationToken,
  baseUrl,
}: SendBookingConfirmationParams) {
  const resend = getResend()
  const cancelUrl = `${baseUrl}/api/bookings/cancel?token=${cancellationToken}`
  const formattedDate = format(startsAt, 'EEEE d MMMM, HH:mm', { locale: sv })

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking confirmed — ${className}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F6F2; color: #2D2620; margin: 0; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border: 1px solid #DDD8D2; border-radius: 8px; padding: 32px;">
          <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; margin: 0 0 8px; color: #2D2620;">Booking confirmed</h1>
          <p style="color: #6B5F57; margin: 0 0 24px; font-size: 14px;">Hi ${clientName},</p>

          <div style="background: #EBF0E8; border-left: 3px solid #698C60; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #2D2620;">${className}</p>
            <p style="margin: 0 0 4px; color: #6B5F57; font-size: 14px;">${formattedDate}</p>
            <p style="margin: 0; color: #6B5F57; font-size: 14px;">with ${instructorName}</p>
          </div>

          <p style="color: #6B5F57; font-size: 14px; margin: 0 0 16px;">See you there. If you need to cancel, please do so at least 24 hours before the class using the link below.</p>

          <a href="${cancelUrl}" style="display: inline-block; color: #698C60; font-size: 13px; text-decoration: underline;">Cancel this booking</a>

          <hr style="border: none; border-top: 1px solid #DDD8D2; margin: 24px 0;">
          <p style="color: #9A8F89; font-size: 12px; margin: 0;">${studioName}</p>
        </div>
      </body>
      </html>
    `,
  })
}
