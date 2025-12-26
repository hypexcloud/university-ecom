/**
 * Email Templates
 * 
 * HTML email templates for various notifications
 */

import { CourseType, PlanType } from './stripe'

const BASE_STYLES = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f9fafb;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .logo {
    color: #d4af37;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
  }
  .content {
    padding: 40px 30px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #1a1a1a;
    margin: 0 0 20px 0;
  }
  .text {
    font-size: 16px;
    line-height: 1.6;
    color: #4b5563;
    margin: 0 0 20px 0;
  }
  .button {
    display: inline-block;
    padding: 14px 28px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #d4af37 !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
  }
  .info-box {
    background-color: #f3f4f6;
    border-left: 4px solid #d4af37;
    padding: 20px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .credentials {
    background-color: #fef3c7;
    border: 2px solid #d4af37;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
  }
  .footer {
    background-color: #f9fafb;
    padding: 30px;
    text-align: center;
    color: #6b7280;
    font-size: 14px;
  }
  .divider {
    border: 0;
    border-top: 1px solid #e5e7eb;
    margin: 30px 0;
  }
`

/**
 * Welcome email for new users
 */
export function getWelcomeEmail(data: {
  firstName: string
  email: string
  tempPassword: string
  course: CourseType
  plan: PlanType
}) {
  const courseNames = {
    ai: 'KI Automation Kurs',
    dropshipping: 'EU Dropshipping Kurs',
  }

  return {
    subject: '🎉 Willkommen bei University Ecom!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">University Ecom</h1>
            </div>
            
            <div class="content">
              <h2 class="title">Willkommen, ${data.firstName}! 🎉</h2>
              
              <p class="text">
                Vielen Dank für deine Anmeldung bei University Ecom! Wir freuen uns sehr, 
                dich in unserem <strong>${courseNames[data.course]}</strong> begrüßen zu dürfen.
              </p>

              <div class="credentials">
                <h3 style="margin-top: 0; color: #1a1a1a;">Deine Login-Daten:</h3>
                <p style="margin: 10px 0;"><strong>E-Mail:</strong> ${data.email}</p>
                <p style="margin: 10px 0;"><strong>Temporäres Passwort:</strong> ${data.tempPassword}</p>
                <p style="margin: 15px 0 0 0; font-size: 14px; color: #92400e;">
                  ⚠️ Bitte ändere dein Passwort beim ersten Login!
                </p>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">
                  Zum Dashboard
                </a>
              </div>

              <hr class="divider">

              <div class="info-box">
                <h3 style="margin-top: 0; color: #1a1a1a;">Nächste Schritte:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4b5563;">
                  <li style="margin-bottom: 10px;">Logge dich in dein Dashboard ein</li>
                  <li style="margin-bottom: 10px;">Buche deine erste 1-zu-1 Mentoring-Session</li>
                  <li style="margin-bottom: 10px;">Greife auf die Kursmaterialien zu</li>
                  <li>Trete unserer Community bei</li>
                </ol>
              </div>

              <p class="text">
                Bei Fragen stehen wir dir jederzeit zur Verfügung. Antworte einfach auf diese E-Mail!
              </p>

              <p class="text">
                Viel Erfolg bei deiner Reise! 🚀
              </p>

              <p class="text">
                Dein University Ecom Team
              </p>
            </div>

            <div class="footer">
              <p>University Ecom | E-Learning für europäische Unternehmer</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #d4af37; text-decoration: none;">Website</a> |
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #d4af37; text-decoration: none;">Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Willkommen bei University Ecom, ${data.firstName}!

Vielen Dank für deine Anmeldung bei unserem ${courseNames[data.course]}!

DEINE LOGIN-DATEN:
E-Mail: ${data.email}
Temporäres Passwort: ${data.tempPassword}

⚠️ Bitte ändere dein Passwort beim ersten Login!

NÄCHSTE SCHRITTE:
1. Logge dich in dein Dashboard ein
2. Buche deine erste 1-zu-1 Mentoring-Session
3. Greife auf die Kursmaterialien zu
4. Trete unserer Community bei

Login: ${process.env.NEXT_PUBLIC_APP_URL}/login

Bei Fragen stehen wir dir jederzeit zur Verfügung!

Viel Erfolg! 🚀

Dein University Ecom Team
    `.trim(),
  }
}

/**
 * Order confirmation email
 */
export function getOrderConfirmationEmail(data: {
  firstName: string
  orderId: string
  course: CourseType
  plan: PlanType
  amount: number
}) {
  const courseNames = {
    ai: 'KI Automation Kurs',
    dropshipping: 'EU Dropshipping Kurs',
  }

  const planNames = {
    fast: 'Fast Track',
    business: 'Business',
    infinity: 'Infinity',
  }

  return {
    subject: '✅ Bestellbestätigung - University Ecom',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">University Ecom</h1>
            </div>
            
            <div class="content">
              <h2 class="title">Bestellung bestätigt! ✅</h2>
              
              <p class="text">
                Hallo ${data.firstName},
              </p>

              <p class="text">
                vielen Dank für deine Bestellung! Deine Zahlung wurde erfolgreich verarbeitet.
              </p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #1a1a1a;">Bestelldetails:</h3>
                <p style="margin: 10px 0;"><strong>Bestellnummer:</strong> ${data.orderId}</p>
                <p style="margin: 10px 0;"><strong>Kurs:</strong> ${courseNames[data.course]}</p>
                <p style="margin: 10px 0;"><strong>Plan:</strong> ${planNames[data.plan]}</p>
                <p style="margin: 10px 0;"><strong>Betrag:</strong> €${data.amount.toFixed(2)}</p>
              </div>

              <p class="text">
                Du hast direkten Zugang zu deinem Kurs und kannst sofort mit dem Mentoring beginnen!
              </p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                  Zum Dashboard
                </a>
              </div>

              <p class="text">
                Bei Fragen zu deiner Bestellung, schreibe uns einfach!
              </p>

              <p class="text">
                Beste Grüße,<br>
                Dein University Ecom Team
              </p>
            </div>

            <div class="footer">
              <p>University Ecom | E-Learning für europäische Unternehmer</p>
              <p>Bestellnummer: ${data.orderId}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Bestellung bestätigt!

Hallo ${data.firstName},

vielen Dank für deine Bestellung! Deine Zahlung wurde erfolgreich verarbeitet.

BESTELLDETAILS:
Bestellnummer: ${data.orderId}
Kurs: ${courseNames[data.course]}
Plan: ${planNames[data.plan]}
Betrag: €${data.amount.toFixed(2)}

Du hast direkten Zugang zu deinem Kurs!

Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Bei Fragen zu deiner Bestellung, schreibe uns einfach!

Beste Grüße,
Dein University Ecom Team
    `.trim(),
  }
}

/**
 * Session reminder email
 */
export function getSessionReminderEmail(data: {
  firstName: string
  mentorName: string
  date: string
  time: string
  meetingLink?: string
  meetingType: 'online' | 'in-person'
}) {
  return {
    subject: '⏰ Erinnerung: Deine Mentoring-Session morgen',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">University Ecom</h1>
            </div>
            
            <div class="content">
              <h2 class="title">Erinnerung: Deine Session morgen! ⏰</h2>
              
              <p class="text">
                Hallo ${data.firstName},
              </p>

              <p class="text">
                dies ist eine freundliche Erinnerung an deine bevorstehende Mentoring-Session.
              </p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #1a1a1a;">Session-Details:</h3>
                <p style="margin: 10px 0;"><strong>Mentor:</strong> ${data.mentorName}</p>
                <p style="margin: 10px 0;"><strong>Datum:</strong> ${data.date}</p>
                <p style="margin: 10px 0;"><strong>Uhrzeit:</strong> ${data.time}</p>
                <p style="margin: 10px 0;"><strong>Format:</strong> ${
                  data.meetingType === 'online' ? '🌐 Online' : '🏢 Vor Ort'
                }</p>
              </div>

              ${
                data.meetingLink
                  ? `
              <div style="text-align: center;">
                <a href="${data.meetingLink}" class="button">
                  Zum Meeting beitreten
                </a>
              </div>
              `
                  : ''
              }

              <p class="text">
                Bereite deine Fragen vor und wir sehen uns morgen!
              </p>

              <p class="text">
                Bis bald! 👋
              </p>
            </div>

            <div class="footer">
              <p>University Ecom | E-Learning für europäische Unternehmer</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Erinnerung: Deine Mentoring-Session morgen!

Hallo ${data.firstName},

dies ist eine freundliche Erinnerung an deine bevorstehende Mentoring-Session.

SESSION-DETAILS:
Mentor: ${data.mentorName}
Datum: ${data.date}
Uhrzeit: ${data.time}
Format: ${data.meetingType === 'online' ? 'Online' : 'Vor Ort'}

${data.meetingLink ? `Meeting-Link: ${data.meetingLink}` : ''}

Bereite deine Fragen vor und wir sehen uns morgen!

Bis bald! 👋

University Ecom Team
    `.trim(),
  }
}

/**
 * Affiliate approval email
 */
export function getAffiliateApprovalEmail(data: {
  firstName: string
  affiliateCode: string
}) {
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout?ref=${data.affiliateCode}`

  return {
    subject: '🎉 Deine Affiliate-Bewerbung wurde genehmigt!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">University Ecom</h1>
            </div>
            
            <div class="content">
              <h2 class="title">Willkommen im Affiliate-Programm! 🎉</h2>
              
              <p class="text">
                Hallo ${data.firstName},
              </p>

              <p class="text">
                großartige Neuigkeiten! Deine Bewerbung für unser Affiliate-Programm wurde genehmigt!
              </p>

              <div class="credentials">
                <h3 style="margin-top: 0; color: #1a1a1a;">Dein Affiliate-Code:</h3>
                <p style="font-size: 24px; font-weight: bold; color: #d4af37; margin: 10px 0;">
                  ${data.affiliateCode}
                </p>
                <p style="margin: 15px 0 0 0; font-size: 14px; color: #1a1a1a;">
                  Dein Referral-Link:
                </p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
                  ${referralUrl}
                </p>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #1a1a1a;">Provisionsstruktur:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                  <li style="margin-bottom: 10px;"><strong>Fast Plan:</strong> 10% = €20 pro Verkauf</li>
                  <li style="margin-bottom: 10px;"><strong>Business Plan:</strong> 15% = €150 pro Verkauf</li>
                  <li><strong>Infinity Plan:</strong> 20% = €600 pro Verkauf</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="button">
                  Zu deinem Dashboard
                </a>
              </div>

              <p class="text">
                Teile deinen Link und beginne zu verdienen! 💰
              </p>

              <p class="text">
                Viel Erfolg!<br>
                Dein University Ecom Team
              </p>
            </div>

            <div class="footer">
              <p>University Ecom | E-Learning für europäische Unternehmer</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Willkommen im Affiliate-Programm!

Hallo ${data.firstName},

großartige Neuigkeiten! Deine Bewerbung wurde genehmigt!

DEIN AFFILIATE-CODE: ${data.affiliateCode}

DEIN REFERRAL-LINK:
${referralUrl}

PROVISIONSSTRUKTUR:
- Fast Plan: 10% = €20 pro Verkauf
- Business Plan: 15% = €150 pro Verkauf
- Infinity Plan: 20% = €600 pro Verkauf

Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/affiliate

Teile deinen Link und beginne zu verdienen! 💰

Viel Erfolg!
Dein University Ecom Team
    `.trim(),
  }
}

/**
 * Commission notification email
 */
export function getCommissionEmail(data: {
  firstName: string
  amount: number
  plan: string
  status: 'pending' | 'approved' | 'paid'
}) {
  const statusText = {
    pending: 'Eine neue Provision wurde erstellt',
    approved: 'Deine Provision wurde genehmigt',
    paid: 'Deine Provision wurde ausgezahlt',
  }

  const statusEmoji = {
    pending: '⏳',
    approved: '✅',
    paid: '💰',
  }

  return {
    subject: `${statusEmoji[data.status]} ${statusText[data.status]}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">University Ecom</h1>
            </div>
            
            <div class="content">
              <h2 class="title">${statusEmoji[data.status]} ${statusText[data.status]}</h2>
              
              <p class="text">
                Hallo ${data.firstName},
              </p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #1a1a1a;">Provisions-Details:</h3>
                <p style="margin: 10px 0;"><strong>Betrag:</strong> €${data.amount.toFixed(2)}</p>
                <p style="margin: 10px 0;"><strong>Plan:</strong> ${data.plan}</p>
                <p style="margin: 10px 0;"><strong>Status:</strong> ${
                  data.status === 'pending'
                    ? 'Ausstehend'
                    : data.status === 'approved'
                    ? 'Genehmigt'
                    : 'Ausgezahlt'
                }</p>
              </div>

              ${
                data.status === 'paid'
                  ? `
              <p class="text">
                Der Betrag wurde auf dein Konto überwiesen. Du solltest ihn in den nächsten 2-3 Werktagen erhalten.
              </p>
              `
                  : ''
              }

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="button">
                  Zum Dashboard
                </a>
              </div>

              <p class="text">
                Weiter so! 🚀
              </p>
            </div>

            <div class="footer">
              <p>University Ecom | E-Learning für europäische Unternehmer</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${statusText[data.status]}

Hallo ${data.firstName},

PROVISIONS-DETAILS:
Betrag: €${data.amount.toFixed(2)}
Plan: ${data.plan}
Status: ${data.status === 'pending' ? 'Ausstehend' : data.status === 'approved' ? 'Genehmigt' : 'Ausgezahlt'}

${data.status === 'paid' ? 'Der Betrag wurde auf dein Konto überwiesen.' : ''}

Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/affiliate

Weiter so! 🚀

University Ecom Team
    `.trim(),
  }
}
