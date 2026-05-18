import { db } from '@/lib/server/db'
import { notifications, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'

let resend: Resend | null = null
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!resend) resend = new Resend(key)
  return resend
}

const fromEmail = process.env.EMAIL_FROM_EMAIL || 'noreply@university-ecom.vercel.app'
const fromName = process.env.EMAIL_FROM_NAME || 'University Ecom'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface EmitParams {
  recipientUid: string
  event: string
  title: string
  body?: string
  link?: string
  sendEmail?: boolean
}

/**
 * Create a notification (bell) and optionally send an email.
 * Fails silently on email errors — notifications are best-effort.
 */
export async function emitNotification(params: EmitParams) {
  const { recipientUid, event, title, body, link, sendEmail = true } = params

  // 1. Insert bell notification
  await db.insert(notifications).values({
    recipientUid,
    event,
    title,
    body: body || null,
    link: link || null,
    channels: { bell: true, email: sendEmail, discord: false },
  })

  // 2. Send email if enabled
  if (sendEmail) {
    const client = getResend()
    if (client) {
      const [customer] = await db
        .select({ email: customers.email, firstName: customers.firstName })
        .from(customers)
        .where(eq(customers.uid, recipientUid))
        .limit(1)

      if (customer) {
        const fullLink = link ? `${appUrl}${link}` : appUrl
        await client.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: customer.email,
          subject: title,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #D4AF37;">University Ecom</h2>
              <p>Hallo ${customer.firstName},</p>
              <p>${body || title}</p>
              ${link ? `<p><a href="${fullLink}" style="display:inline-block;background:#D4AF37;color:#000;padding:10px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Jetzt ansehen</a></p>` : ''}
              <p style="color:#888;font-size:12px;margin-top:32px;">University Ecom – automatische Benachrichtigung</p>
            </div>
          `,
        }).catch(() => {
          // Email failure is non-critical
        })
      }
    }
  }
}
