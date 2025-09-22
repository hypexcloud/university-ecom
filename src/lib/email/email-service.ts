import { Resend } from 'resend'
import { Timestamp } from 'firebase/firestore'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration - supports both custom domains and Vercel subdomains
const EMAIL_CONFIG = {
  fromEmail: process.env.EMAIL_FROM_EMAIL || 'noreply@university-ecom.vercel.app',
  fromName: process.env.EMAIL_FROM_NAME || 'University Ecom',
  supportEmail: process.env.EMAIL_SUPPORT_EMAIL || 'support@university-ecom.vercel.app',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@university-ecom.vercel.app',
}

// Auto-detect if we're using a Vercel domain
const isVercelDomain = EMAIL_CONFIG.fromEmail.includes('.vercel.app')

console.log(`📧 Email configured for: ${EMAIL_CONFIG.fromEmail}${isVercelDomain ? ' (Vercel domain)' : ' (custom domain)'}`)

// Email types for tracking and templates
export type EmailType = 
  | 'intake_confirmation'
  | 'intake_approved' 
  | 'intake_rejected'
  | 'welcome_sequence_1'
  | 'welcome_sequence_2'
  | 'welcome_sequence_3'
  | 'course_reminder'
  | 'course_completion'
  | 'support_ticket_created'
  | 'support_ticket_resolved'

export interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  type: EmailType
  userId?: string
  metadata?: Record<string, any>
}

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

export class EmailService {
  
  // Send a single email
  static async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not found, skipping email send in development')
        return {
          success: true,
          id: 'dev-mock-' + Date.now()
        }
      }

      console.log(`📧 Sending email to ${emailData.to} from ${EMAIL_CONFIG.fromEmail}`)

      const result = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: EMAIL_CONFIG.replyTo,
      })

      if (result.error) {
        console.error('❌ Resend error:', result.error)
        return {
          success: false,
          error: result.error.message || 'Failed to send email'
        }
      }

      console.log(`✅ Email sent successfully with ID: ${result.data?.id}`)

      // Log email to Firestore for tracking
      if (emailData.userId) {
        await this.logEmail({
          emailId: result.data?.id || 'unknown',
          userId: emailData.userId,
          type: emailData.type,
          to: Array.isArray(emailData.to) ? emailData.to[0] : emailData.to,
          subject: emailData.subject,
          status: 'sent',
          metadata: emailData.metadata || {},
        })
      }

      return {
        success: true,
        id: result.data?.id
      }
    } catch (error: any) {
      console.error('❌ Email service error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }
  }

  // Send bulk emails (for newsletters, announcements)
  static async sendBulkEmails(emails: EmailData[]): Promise<EmailResult[]> {
    const results: EmailResult[] = []
    
    // Send emails in batches to avoid rate limiting
    const batchSize = isVercelDomain ? 5 : 10 // Smaller batches for Vercel domains
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      
      console.log(`📧 Sending batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(emails.length/batchSize)} (${batch.length} emails)`)
      
      const batchPromises = batch.map(email => this.sendEmail(email))
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // Small delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Longer delay for Vercel domains
      }
    }
    
    return results
  }

  // Log email to Firestore for tracking and analytics
  private static async logEmail(logData: {
    emailId: string
    userId: string
    type: EmailType
    to: string
    subject: string
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
    metadata: Record<string, any>
  }) {
    try {
      // Dynamic import to avoid circular dependency
      const { FirestoreService } = await import('../firebase/firestore')
      
      await FirestoreService.create('email_logs', {
        ...logData,
        sentAt: Timestamp.now(),
        domain: EMAIL_CONFIG.fromEmail.split('@')[1],
        isVercelDomain,
      })
    } catch (error) {
      console.error('Error logging email:', error)
      // Don't throw - email logging failure shouldn't stop email sending
    }
  }

  // Get email templates by type
  static async getEmailTemplate(type: EmailType, variables: Record<string, any> = {}): Promise<{ subject: string, html: string, text: string }> {
    try {
      // Dynamic import to avoid circular dependency
      const { FirestoreService } = await import('../firebase/firestore')
      
      const templates = await FirestoreService.query(
        'email_templates',
        [{ field: 'type', operator: '==', value: type }],
        'createdAt',
        'desc',
        1
      )

      if (templates.length === 0) {
        // Fallback to default templates if not found in database
        return this.getDefaultTemplate(type, variables)
      }

      const template = templates[0] as any
      
      // Replace variables in template
      const subject = this.replaceVariables(template.subject, variables)
      const html = this.replaceVariables(template.html, variables)
      const text = this.replaceVariables(template.text || '', variables)

      return { subject, html, text }
    } catch (error) {
      console.error('Error fetching email template:', error)
      // Fallback to default templates
      return this.getDefaultTemplate(type, variables)
    }
  }

  // Replace template variables
  private static replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      result = result.replace(regex, String(value || ''))
    })
    
    return result
  }

  // Default email templates (fallback) - Updated with domain-aware footer
  private static getDefaultTemplate(type: EmailType, variables: Record<string, any>): { subject: string, html: string, text: string } {
    const domainName = EMAIL_CONFIG.fromEmail.split('@')[1]
    const websiteUrl = isVercelDomain 
      ? `https://${domainName.replace('.vercel.app', '')}.vercel.app` 
      : `https://${domainName}`

    const templates = {
      intake_confirmation: {
        subject: 'Vielen Dank für Ihr Interesse - Ihre Antworten werden geprüft',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0;">🎓 University Ecom</h1>
              <p style="margin: 10px 0 0 0; color: #ccc;">AI & Dropshipping Kurse für Unternehmer</p>
            </div>
            <div style="padding: 40px 20px;">
              <h2>Vielen Dank, {{firstName}}! 🎉</h2>
              <p>Wir haben Ihre Antworten erhalten und werden diese innerhalb von 24 Stunden prüfen.</p>
              <p>Sie erhalten eine E-Mail, sobald die Prüfung abgeschlossen ist.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${websiteUrl}" style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Kurse ansehen</a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>University Ecom | ${domainName}</p>
            </div>
          </div>
        `,
        text: 'Vielen Dank für Ihr Interesse! Wir prüfen Ihre Antworten und melden uns innerhalb von 24 Stunden.'
      },
      intake_approved: {
        subject: 'Herzlichen Glückwunsch - Sie sind für unsere Kurse qualifiziert!',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0;">🎓 University Ecom</h1>
              <p style="margin: 10px 0 0 0; color: #ccc;">AI & Dropshipping Kurse für Unternehmer</p>
            </div>
            <div style="padding: 40px 20px;">
              <h2>Herzlichen Glückwunsch, {{firstName}}! 🎉</h2>
              <div style="background: #d4edda; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="margin: 0; color: #155724;">Sie sind qualifiziert! ✅</h3>
                <p style="margin: 10px 0 0 0; color: #155724;">Nach Prüfung Ihrer Antworten freuen wir uns, Ihnen mitteilen zu können, dass Sie für unsere Kurse qualifiziert sind.</p>
              </div>
              <p>{{reviewNotes}}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${websiteUrl}/courses" style="background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-size: 16px;">Jetzt Kurs wählen</a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>University Ecom | ${domainName}</p>
            </div>
          </div>
        `,
        text: 'Herzlichen Glückwunsch! Sie sind für unsere Kurse qualifiziert.'
      },
      intake_rejected: {
        subject: 'Ihre Bewerbung - Nächste Schritte',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0;">🎓 University Ecom</h1>
              <p style="margin: 10px 0 0 0; color: #ccc;">AI & Dropshipping Kurse für Unternehmer</p>
            </div>
            <div style="padding: 40px 20px;">
              <h2>Vielen Dank für Ihr Interesse, {{firstName}}!</h2>
              <p>Nach Prüfung Ihrer Antworten müssen wir Ihnen leider mitteilen, dass unsere Kurse derzeit nicht optimal für Sie geeignet sind.</p>
              <p>{{reviewNotes}}</p>
              <div style="background: #d1ecf1; padding: 20px; border-left: 4px solid #17a2b8; margin: 20px 0;">
                <p style="margin: 0; color: #0c5460;">Bewerben Sie sich gerne in 3-6 Monaten erneut, wenn Sie weitere Erfahrung gesammelt haben.</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${websiteUrl}" style="background: #6c757d; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Kostenlose Ressourcen</a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>University Ecom | ${domainName}</p>
            </div>
          </div>
        `,
        text: 'Vielen Dank für Ihr Interesse. Unsere Kurse sind derzeit nicht optimal für Sie geeignet.'
      }
    }

    const template = templates[type as keyof typeof templates] || templates.intake_confirmation
    
    return {
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.html, variables),
      text: this.replaceVariables(template.text, variables)
    }
  }

  // Quick methods for common email types
  static async sendIntakeConfirmation(userEmail: string, firstName: string, userId?: string) {
    const template = await this.getEmailTemplate('intake_confirmation', { firstName })
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      type: 'intake_confirmation',
      userId,
    })
  }

  static async sendIntakeDecision(
    userEmail: string, 
    firstName: string, 
    approved: boolean, 
    reviewNotes: string = '',
    userId?: string
  ) {
    const type: EmailType = approved ? 'intake_approved' : 'intake_rejected'
    const template = await this.getEmailTemplate(type, { firstName, reviewNotes })
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      type,
      userId,
      metadata: { approved, reviewNotes }
    })
  }

  // Test email functionality
  static async sendTestEmail(to: string): Promise<EmailResult> {
    const domainName = EMAIL_CONFIG.fromEmail.split('@')[1]
    
    return this.sendEmail({
      to,
      subject: 'University Ecom - Test E-Mail ✅',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #000; color: #fff; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0;">🎓 University Ecom</h1>
            <p style="margin: 10px 0 0 0; color: #ccc;">Email System Test</p>
          </div>
          <div style="padding: 40px 20px;">
            <h2>Test E-Mail erfolgreich! ✅</h2>
            <p>Diese E-Mail bestätigt, dass das E-Mail-System ordnungsgemäß funktioniert.</p>
            <div style="background: #d4edda; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
              <p style="margin: 0; color: #155724;"><strong>Domain:</strong> ${domainName}</p>
              <p style="margin: 5px 0 0 0; color: #155724;"><strong>Gesendet am:</strong> ${new Date().toLocaleString('de-DE')}</p>
              <p style="margin: 5px 0 0 0; color: #155724;"><strong>Typ:</strong> ${isVercelDomain ? 'Vercel Domain' : 'Custom Domain'}</p>
            </div>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>University Ecom Email System | ${domainName}</p>
          </div>
        </div>
      `,
      text: `Test E-Mail erfolgreich!\n\nDomain: ${domainName}\nGesendet am: ${new Date().toLocaleString('de-DE')}\nTyp: ${isVercelDomain ? 'Vercel Domain' : 'Custom Domain'}`,
      type: 'intake_confirmation' // Use existing type for test
    })
  }

  // Get email configuration info
  static getEmailConfig() {
    return {
      ...EMAIL_CONFIG,
      isVercelDomain,
      domain: EMAIL_CONFIG.fromEmail.split('@')[1]
    }
  }
}
