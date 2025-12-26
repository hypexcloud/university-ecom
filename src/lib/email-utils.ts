/**
 * Email Utilities
 * 
 * High-level functions for sending specific types of emails
 */

import { sendEmail } from './email-service'
import {
  getWelcomeEmail,
  getOrderConfirmationEmail,
  getSessionReminderEmail,
  getAffiliateApprovalEmail,
  getCommissionEmail,
} from './email-templates'
import { CourseType, PlanType } from './stripe'

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: {
  email: string
  firstName: string
  tempPassword: string
  course: CourseType
  plan: PlanType
}) {
  try {
    const template = getWelcomeEmail(data)
    await sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    console.log('✅ Welcome email sent to:', data.email)
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    throw error
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: {
  email: string
  firstName: string
  orderId: string
  course: CourseType
  plan: PlanType
  amount: number
}) {
  try {
    const template = getOrderConfirmationEmail(data)
    await sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    console.log('✅ Order confirmation email sent to:', data.email)
  } catch (error) {
    console.error('❌ Error sending order confirmation:', error)
    throw error
  }
}

/**
 * Send session reminder email (24 hours before)
 */
export async function sendSessionReminderEmail(data: {
  email: string
  firstName: string
  mentorName: string
  date: string
  time: string
  meetingLink?: string
  meetingType: 'online' | 'in-person'
}) {
  try {
    const template = getSessionReminderEmail(data)
    await sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    console.log('✅ Session reminder sent to:', data.email)
  } catch (error) {
    console.error('❌ Error sending session reminder:', error)
    throw error
  }
}

/**
 * Send affiliate approval email
 */
export async function sendAffiliateApprovalEmail(data: {
  email: string
  firstName: string
  affiliateCode: string
}) {
  try {
    const template = getAffiliateApprovalEmail(data)
    await sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    console.log('✅ Affiliate approval email sent to:', data.email)
  } catch (error) {
    console.error('❌ Error sending affiliate approval:', error)
    throw error
  }
}

/**
 * Send commission notification email
 */
export async function sendCommissionEmail(data: {
  email: string
  firstName: string
  amount: number
  plan: string
  status: 'pending' | 'approved' | 'paid'
}) {
  try {
    const template = getCommissionEmail(data)
    await sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    console.log('✅ Commission email sent to:', data.email)
  } catch (error) {
    console.error('❌ Error sending commission email:', error)
    throw error
  }
}
