import { NextRequest, NextResponse } from 'next/server'
import {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendSessionReminderEmail,
  sendAffiliateApprovalEmail,
  sendCommissionEmail,
} from '@/lib/email-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, ...data } = body

    if (!type || !email) {
      return NextResponse.json(
        { error: 'Missing type or email' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'welcome':
        await sendWelcomeEmail({
          email,
          firstName: data.firstName || 'Test',
          tempPassword: data.tempPassword || 'Test123!',
          course: data.course || 'ai',
          plan: data.plan || 'business',
        })
        break

      case 'order':
        await sendOrderConfirmationEmail({
          email,
          firstName: data.firstName || 'Test',
          orderId: data.orderId || 'TEST-12345',
          course: data.course || 'ai',
          plan: data.plan || 'business',
          amount: data.amount || 1000,
        })
        break

      case 'reminder':
        await sendSessionReminderEmail({
          email,
          firstName: data.firstName || 'Test',
          mentorName: data.mentorName || 'Max Mentor',
          date: data.date || '25. Dezember 2024',
          time: data.time || '14:00 - 15:00',
          meetingLink: data.meetingLink,
          meetingType: data.meetingType || 'online',
        })
        break

      case 'affiliate':
        await sendAffiliateApprovalEmail({
          email,
          firstName: data.firstName || 'Test',
          affiliateCode: data.affiliateCode || 'TEST123',
        })
        break

      case 'commission':
        await sendCommissionEmail({
          email,
          firstName: data.firstName || 'Test',
          amount: data.amount || 150,
          plan: data.plan || 'Business',
          status: data.status || 'approved',
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent to ${email}`,
    })
  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
