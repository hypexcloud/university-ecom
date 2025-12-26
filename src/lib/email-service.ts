/**
 * Email Service Configuration
 * 
 * Centralized email service using Resend
 */

// Email service type
export type EmailProvider = 'resend' | 'sendgrid' | 'console'

// Email configuration
export const EMAIL_CONFIG = {
  provider: (process.env.EMAIL_PROVIDER || 'console') as EmailProvider,
  from: process.env.EMAIL_FROM || 'University Ecom <noreply@university-ecom.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@university-ecom.com',
  
  // Resend API key
  resendApiKey: process.env.RESEND_API_KEY,
  
  // SendGrid API key (alternative)
  sendgridApiKey: process.env.SENDGRID_API_KEY,
}

// Email templates base URL
export const EMAIL_TEMPLATES_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://university-ecom.com'

/**
 * Send email using configured provider
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  const provider = EMAIL_CONFIG.provider

  try {
    if (provider === 'resend') {
      return await sendWithResend({ to, subject, html, text })
    } else if (provider === 'sendgrid') {
      return await sendWithSendGrid({ to, subject, html, text })
    } else {
      // Console mode for development
      console.log('📧 EMAIL (Console Mode):')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('HTML:', html.substring(0, 200) + '...')
      return { success: true, provider: 'console' }
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

/**
 * Send email via Resend
 */
async function sendWithResend({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  if (!EMAIL_CONFIG.resendApiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${EMAIL_CONFIG.resendApiKey}`,
    },
    body: JSON.stringify({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: EMAIL_CONFIG.replyTo,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  const data = await response.json()
  return { success: true, provider: 'resend', id: data.id }
}

/**
 * Send email via SendGrid
 */
async function sendWithSendGrid({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  if (!EMAIL_CONFIG.sendgridApiKey) {
    throw new Error('SENDGRID_API_KEY not configured')
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${EMAIL_CONFIG.sendgridApiKey}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
          subject,
        },
      ],
      from: {
        email: EMAIL_CONFIG.from.match(/<(.+)>/)?.[1] || EMAIL_CONFIG.from,
        name: EMAIL_CONFIG.from.match(/^(.+?)\s*</)?.[1] || 'University Ecom',
      },
      reply_to: {
        email: EMAIL_CONFIG.replyTo,
      },
      content: [
        {
          type: 'text/html',
          value: html,
        },
        ...(text
          ? [
              {
                type: 'text/plain',
                value: text,
              },
            ]
          : []),
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid API error: ${error}`)
  }

  return { success: true, provider: 'sendgrid' }
}
