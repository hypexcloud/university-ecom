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

/**
 * Transactional email — no opt-in needed (order confirmations, ticket replies, etc.)
 * Always includes List-Unsubscribe header for inbox compliance.
 */
export async function sendTransactionalEmail(params: {
  to: string
  subject: string
  html: string
}) {
  const client = getResend()
  if (!client) return

  await client.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: params.to,
    subject: params.subject,
    html: params.html + unsubscribeFooter('transaktional'),
    headers: {
      'List-Unsubscribe': `<${appUrl}/api/email/unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }).catch(() => {})
}

/**
 * Marketing email — requires prior opt-in consent.
 * Must include one-click unsubscribe link and Impressum.
 */
export async function sendMarketingEmail(params: {
  to: string
  subject: string
  html: string
}) {
  const client = getResend()
  if (!client) return

  await client.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: params.to,
    subject: params.subject,
    html: params.html + unsubscribeFooter('marketing'),
    headers: {
      'List-Unsubscribe': `<${appUrl}/api/email/unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }).catch(() => {})
}

function unsubscribeFooter(type: 'transaktional' | 'marketing'): string {
  return `
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center;">
      <p>University Ecom · <a href="${appUrl}/legal/impressum" style="color:#999;">Impressum</a> · <a href="${appUrl}/legal/datenschutz" style="color:#999;">Datenschutz</a></p>
      ${type === 'marketing'
        ? `<p><a href="${appUrl}/api/email/unsubscribe" style="color:#999;">E-Mail-Benachrichtigungen abbestellen</a></p>`
        : `<p>Dies ist eine ${type}e Nachricht zu Ihrem Konto.</p>`
      }
    </div>
  `
}
