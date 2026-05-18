import { Resend } from 'resend'

let resend: Resend | null = null
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!resend) resend = new Resend(apiKey)
  return resend
}

const fromEmail = process.env.EMAIL_FROM_EMAIL || 'noreply@university-ecom.vercel.app'
const fromName = process.env.EMAIL_FROM_NAME || 'University Ecom'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface TicketReplyEmailParams {
  to: string
  customerName: string
  ticketId: string
  ticketSubject: string
  messagePreview: string
}

export async function sendTicketReplyEmail(params: TicketReplyEmailParams) {
  const client = getResend()
  if (!client) return

  const ticketUrl = `${appUrl}/student/support/${params.ticketId}`

  await client.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: params.to,
    subject: `Neue Nachricht zu deinem Ticket: ${params.ticketSubject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37;">University Ecom</h2>
        <p>Hallo ${params.customerName},</p>
        <p>Du hast eine neue Nachricht zu deinem Ticket <strong>"${params.ticketSubject}"</strong>:</p>
        <blockquote style="border-left: 3px solid #D4AF37; padding-left: 12px; color: #555; margin: 16px 0;">
          ${params.messagePreview}${params.messagePreview.length >= 200 ? '...' : ''}
        </blockquote>
        <p>
          <a href="${ticketUrl}" style="display: inline-block; background: #D4AF37; color: #000; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Ticket ansehen
          </a>
        </p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">
          Diese E-Mail wurde automatisch von University Ecom gesendet.
        </p>
      </div>
    `,
  })
}
