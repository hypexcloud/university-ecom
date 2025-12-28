/**
 * Email Templates - Prestige Branding
 * 
 * Professional HTML email templates matching the platform's black & gold aesthetic
 */

import { CourseType, PlanType } from './stripe'

const BASE_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #0a0a0a;
    -webkit-font-smoothing: antialiased;
  }
  .outer-wrapper {
    background-color: #0a0a0a;
    padding: 40px 20px;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1);
  }
  .header {
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    padding: 50px 30px;
    text-align: center;
    border-bottom: 2px solid rgba(212, 175, 55, 0.3);
    position: relative;
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
  .logo {
    color: #d4af37;
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
  }
  .tagline {
    color: rgba(212, 175, 55, 0.6);
    font-size: 11px;
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .content {
    padding: 48px 40px;
    background-color: #1a1a1a;
  }
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 24px 0;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .text {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 20px 0;
  }
  .text strong {
    color: #d4af37;
    font-weight: 600;
  }
  .button {
    display: inline-block;
    padding: 16px 40px;
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
    color: #000000 !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 700;
    margin: 28px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
    transition: all 0.3s ease;
  }
  .info-box {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%);
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-left: 4px solid #d4af37;
    padding: 28px;
    margin: 28px 0;
    border-radius: 12px;
  }
  .info-box h3 {
    color: #d4af37;
    margin: 0 0 16px 0;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 700;
  }
  .info-box p,
  .info-box li {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
  }
  .info-box strong {
    color: #ffffff;
    font-weight: 600;
  }
  .credentials {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.06) 100%);
    border: 2px solid #d4af37;
    padding: 32px;
    margin: 32px 0;
    border-radius: 12px;
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.15);
  }
  .credentials h3 {
    color: #d4af37;
    margin: 0 0 20px 0;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 700;
  }
  .credential-item {
    margin: 16px 0;
  }
  .credential-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    font-weight: 600;
  }
  .credential-value {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 14px 18px;
    border-radius: 8px;
    font-family: 'Courier New', Courier, monospace;
    color: #ffffff;
    border: 1px solid rgba(212, 175, 55, 0.3);
    font-size: 15px;
    word-break: break-all;
  }
  .warning-box {
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(234, 179, 8, 0.06) 100%);
    border: 1px solid rgba(234, 179, 8, 0.4);
    border-left: 4px solid #eab308;
    padding: 18px 24px;
    border-radius: 8px;
    margin: 20px 0;
  }
  .warning-box p {
    color: #fbbf24;
    font-size: 14px;
    margin: 0;
    line-height: 1.6;
  }
  .footer {
    background-color: #000000;
    padding: 40px 30px;
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    border-top: 1px solid rgba(212, 175, 55, 0.15);
  }
  .footer p {
    margin: 8px 0;
    line-height: 1.6;
  }
  .footer-links {
    margin: 16px 0 0 0;
  }
  .footer-link {
    color: #d4af37;
    text-decoration: none;
    margin: 0 12px;
    transition: color 0.2s;
    font-weight: 500;
  }
  .divider {
    border: 0;
    border-top: 1px solid rgba(212, 175, 55, 0.15);
    margin: 32px 0;
  }
  .list-style {
    margin: 0;
    padding-left: 24px;
    list-style: none;
  }
  .list-style li {
    position: relative;
    margin-bottom: 14px;
    padding-left: 8px;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.7;
  }
  .list-style li::before {
    content: '→';
    position: absolute;
    left: -20px;
    color: #d4af37;
    font-weight: bold;
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
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="outer-wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">University Ecom</h1>
                <p class="tagline">Premium E-Learning Platform</p>
              </div>
              
              <div class="content">
                <h2 class="title">Willkommen, ${data.firstName}! 🎉</h2>
                
                <p class="text">
                  Vielen Dank für deine Anmeldung bei University Ecom! Wir freuen uns sehr, 
                  dich in unserem <strong>${courseNames[data.course]}</strong> begrüßen zu dürfen.
                </p>

                <div class="credentials">
                  <h3>Deine Login-Daten</h3>
                  <div class="credential-item">
                    <div class="credential-label">E-Mail-Adresse</div>
                    <div class="credential-value">${data.email}</div>
                  </div>
                  <div class="credential-item">
                    <div class="credential-label">Temporäres Passwort</div>
                    <div class="credential-value">${data.tempPassword}</div>
                  </div>
                </div>

                <div class="warning-box">
                  <p>⚠️ <strong>Wichtig:</strong> Bitte ändere dein Passwort beim ersten Login aus Sicherheitsgründen!</p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">
                    Zum Dashboard
                  </a>
                </div>

                <hr class="divider">

                <div class="info-box">
                  <h3>Nächste Schritte</h3>
                  <ul class="list-style">
                    <li>Logge dich in dein persönliches Dashboard ein</li>
                    <li>Buche deine erste 1-zu-1 Mentoring-Session</li>
                    <li>Greife auf die exklusiven Kursmaterialien zu</li>
                    <li>Trete unserer Community bei und vernetze dich</li>
                  </ul>
                </div>

                <p class="text">
                  Bei Fragen oder Anliegen stehen wir dir jederzeit zur Verfügung. 
                  Antworte einfach auf diese E-Mail oder kontaktiere unseren Support.
                </p>

                <p class="text">
                  Viel Erfolg bei deiner unternehmerischen Reise! 🚀
                </p>

                <p class="text" style="margin-top: 32px; color: rgba(255, 255, 255, 0.6);">
                  Mit besten Grüßen,<br>
                  <strong style="color: #d4af37;">Dein University Ecom Team</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>University Ecom</strong></p>
                <p>Premium E-Learning für europäische Unternehmer</p>
                <div class="footer-links">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="footer-link">Website</a>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" class="footer-link">Support</a>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/community" class="footer-link">Community</a>
                </div>
              </div>
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

⚠️ WICHTIG: Bitte ändere dein Passwort beim ersten Login!

NÄCHSTE SCHRITTE:
→ Logge dich in dein Dashboard ein
→ Buche deine erste 1-zu-1 Mentoring-Session
→ Greife auf die Kursmaterialien zu
→ Trete unserer Community bei

Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/login

Bei Fragen stehen wir dir jederzeit zur Verfügung!

Viel Erfolg! 🚀

Mit besten Grüßen,
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
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="outer-wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">University Ecom</h1>
                <p class="tagline">Premium E-Learning Platform</p>
              </div>
              
              <div class="content">
                <h2 class="title">Bestellung bestätigt! ✅</h2>
                
                <p class="text">
                  Hallo ${data.firstName},
                </p>

                <p class="text">
                  vielen Dank für deine Bestellung! Deine Zahlung wurde erfolgreich verarbeitet 
                  und dein Zugang ist ab sofort freigeschaltet.
                </p>

                <div class="info-box">
                  <h3>Bestelldetails</h3>
                  <p style="margin: 12px 0;"><strong>Bestellnummer:</strong> ${data.orderId}</p>
                  <p style="margin: 12px 0;"><strong>Kurs:</strong> ${courseNames[data.course]}</p>
                  <p style="margin: 12px 0;"><strong>Tarif:</strong> ${planNames[data.plan]} Plan</p>
                  <p style="margin: 12px 0;"><strong>Betrag:</strong> €${data.amount.toFixed(2)}</p>
                </div>

                <p class="text">
                  Du hast <strong>sofortigen Zugang</strong> zu deinem Kurs und kannst direkt 
                  mit dem Mentoring beginnen!
                </p>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                    Zum Dashboard
                  </a>
                </div>

                <hr class="divider">

                <p class="text">
                  Bei Fragen zu deiner Bestellung oder technischen Problemen, 
                  kontaktiere uns jederzeit über unseren Support.
                </p>

                <p class="text" style="margin-top: 32px; color: rgba(255, 255, 255, 0.6);">
                  Beste Grüße,<br>
                  <strong style="color: #d4af37;">Dein University Ecom Team</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>University Ecom</strong></p>
                <p>Bestellnummer: ${data.orderId}</p>
                <div class="footer-links">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="footer-link">Website</a>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" class="footer-link">Support</a>
                </div>
              </div>
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
Tarif: ${planNames[data.plan]} Plan
Betrag: €${data.amount.toFixed(2)}

Du hast sofortigen Zugang zu deinem Kurs!

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
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="outer-wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">University Ecom</h1>
                <p class="tagline">Premium E-Learning Platform</p>
              </div>
              
              <div class="content">
                <h2 class="title">Erinnerung: Deine Session morgen! ⏰</h2>
                
                <p class="text">
                  Hallo ${data.firstName},
                </p>

                <p class="text">
                  dies ist eine freundliche Erinnerung an deine bevorstehende 
                  <strong>1-zu-1 Mentoring-Session</strong>.
                </p>

                <div class="info-box">
                  <h3>Session-Details</h3>
                  <p style="margin: 12px 0;"><strong>Mentor:</strong> ${data.mentorName}</p>
                  <p style="margin: 12px 0;"><strong>Datum:</strong> ${data.date}</p>
                  <p style="margin: 12px 0;"><strong>Uhrzeit:</strong> ${data.time}</p>
                  <p style="margin: 12px 0;"><strong>Format:</strong> ${
                    data.meetingType === 'online' ? '🌐 Online-Meeting' : '🏢 Vor Ort'
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
                  <strong>Tipp:</strong> Bereite deine Fragen vor, um das Maximum aus 
                  deiner Session herauszuholen!
                </p>

                <p class="text" style="margin-top: 32px; color: rgba(255, 255, 255, 0.6);">
                  Wir freuen uns auf die Session!<br>
                  <strong style="color: #d4af37;">Dein University Ecom Team</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>University Ecom</strong></p>
                <p>Premium E-Learning für europäische Unternehmer</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Erinnerung: Deine Mentoring-Session morgen!

Hallo ${data.firstName},

dies ist eine freundliche Erinnerung an deine bevorstehende 1-zu-1 Mentoring-Session.

SESSION-DETAILS:
Mentor: ${data.mentorName}
Datum: ${data.date}
Uhrzeit: ${data.time}
Format: ${data.meetingType === 'online' ? 'Online-Meeting' : 'Vor Ort'}

${data.meetingLink ? `Meeting-Link: ${data.meetingLink}` : ''}

TIPP: Bereite deine Fragen vor, um das Maximum aus deiner Session herauszuholen!

Wir freuen uns auf die Session!

Dein University Ecom Team
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
    subject: '🎉 Willkommen im Affiliate-Programm!',
    html: `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="outer-wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">University Ecom</h1>
                <p class="tagline">Premium Affiliate Program</p>
              </div>
              
              <div class="content">
                <h2 class="title">Willkommen im Affiliate-Programm! 🎉</h2>
                
                <p class="text">
                  Hallo ${data.firstName},
                </p>

                <p class="text">
                  <strong>Großartige Neuigkeiten!</strong> Deine Bewerbung für unser 
                  exklusives Affiliate-Programm wurde genehmigt!
                </p>

                <div class="credentials">
                  <h3>Dein Affiliate-Code</h3>
                  <div class="credential-item">
                    <div class="credential-label">Persönlicher Code</div>
                    <div class="credential-value" style="font-size: 20px; font-weight: bold; color: #d4af37;">
                      ${data.affiliateCode}
                    </div>
                  </div>
                  <div class="credential-item">
                    <div class="credential-label">Dein Referral-Link</div>
                    <div class="credential-value">
                      ${referralUrl}
                    </div>
                  </div>
                </div>

                <div class="info-box">
                  <h3>Provisionsstruktur</h3>
                  <ul class="list-style">
                    <li><strong>Fast Track Plan:</strong> 10% Provision = €20 pro Verkauf</li>
                    <li><strong>Business Plan:</strong> 15% Provision = €150 pro Verkauf</li>
                    <li><strong>Infinity Plan:</strong> 20% Provision = €600 pro Verkauf</li>
                  </ul>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="button">
                    Zum Affiliate Dashboard
                  </a>
                </div>

                <hr class="divider">

                <p class="text">
                  Teile deinen einzigartigen Link und beginne sofort zu verdienen! 
                  Jeder erfolgreiche Verkauf wird deinem Konto gutgeschrieben.
                </p>

                <p class="text" style="margin-top: 32px; color: rgba(255, 255, 255, 0.6);">
                  Viel Erfolg beim Empfehlen!<br>
                  <strong style="color: #d4af37;">Dein University Ecom Team</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>University Ecom Affiliate Program</strong></p>
                <div class="footer-links">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="footer-link">Dashboard</a>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" class="footer-link">Support</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Willkommen im Affiliate-Programm!

Hallo ${data.firstName},

Großartige Neuigkeiten! Deine Bewerbung wurde genehmigt!

DEIN AFFILIATE-CODE:
${data.affiliateCode}

DEIN REFERRAL-LINK:
${referralUrl}

PROVISIONSSTRUKTUR:
→ Fast Track Plan: 10% = €20 pro Verkauf
→ Business Plan: 15% = €150 pro Verkauf
→ Infinity Plan: 20% = €600 pro Verkauf

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
  const statusConfig = {
    pending: {
      title: 'Neue Provision erstellt',
      emoji: '⏳',
      color: '#fbbf24',
    },
    approved: {
      title: 'Provision genehmigt',
      emoji: '✅',
      color: '#10b981',
    },
    paid: {
      title: 'Provision ausgezahlt',
      emoji: '💰',
      color: '#d4af37',
    },
  }

  const config = statusConfig[data.status]

  return {
    subject: `${config.emoji} ${config.title}`,
    html: `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${BASE_STYLES}</style>
        </head>
        <body>
          <div class="outer-wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">University Ecom</h1>
                <p class="tagline">Affiliate Program</p>
              </div>
              
              <div class="content">
                <h2 class="title">${config.emoji} ${config.title}</h2>
                
                <p class="text">
                  Hallo ${data.firstName},
                </p>

                <div class="info-box" style="border-left-color: ${config.color};">
                  <h3>Provisions-Details</h3>
                  <p style="margin: 12px 0;">
                    <strong>Betrag:</strong> 
                    <span style="color: ${config.color}; font-size: 20px; font-weight: bold;">€${data.amount.toFixed(2)}</span>
                  </p>
                  <p style="margin: 12px 0;"><strong>Plan:</strong> ${data.plan}</p>
                  <p style="margin: 12px 0;">
                    <strong>Status:</strong> 
                    ${
                      data.status === 'pending'
                        ? '⏳ Ausstehend'
                        : data.status === 'approved'
                        ? '✅ Genehmigt'
                        : '💰 Ausgezahlt'
                    }
                  </p>
                </div>

                ${
                  data.status === 'paid'
                    ? `
                <p class="text">
                  <strong>Glückwunsch!</strong> Der Betrag wurde auf dein Konto überwiesen. 
                  Du solltest ihn in den nächsten 2-3 Werktagen erhalten.
                </p>
                `
                    : data.status === 'approved'
                    ? `
                <p class="text">
                  Deine Provision wurde genehmigt und wird in Kürze ausgezahlt.
                </p>
                `
                    : `
                <p class="text">
                  Eine neue Provision wurde erstellt und wartet auf Genehmigung.
                </p>
                `
                }

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="button">
                    Zum Dashboard
                  </a>
                </div>

                <p class="text" style="margin-top: 32px; color: rgba(255, 255, 255, 0.6);">
                  Weiter so! 🚀<br>
                  <strong style="color: #d4af37;">Dein University Ecom Team</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>University Ecom Affiliate Program</strong></p>
                <div class="footer-links">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate" class="footer-link">Dashboard</a>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" class="footer-link">Support</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${config.emoji} ${config.title}

Hallo ${data.firstName},

PROVISIONS-DETAILS:
Betrag: €${data.amount.toFixed(2)}
Plan: ${data.plan}
Status: ${data.status === 'pending' ? 'Ausstehend' : data.status === 'approved' ? 'Genehmigt' : 'Ausgezahlt'}

${data.status === 'paid' ? 'Der Betrag wurde auf dein Konto überwiesen. Du solltest ihn in den nächsten 2-3 Werktagen erhalten.' : ''}

Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/affiliate

Weiter so! 🚀

Dein University Ecom Team
    `.trim(),
  }
}
