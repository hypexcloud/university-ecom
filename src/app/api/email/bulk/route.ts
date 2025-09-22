import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email/email-service'
import { EmailTemplates } from '@/lib/email/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emails } = body

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Missing or invalid emails array' },
        { status: 400 }
      )
    }

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Emails array cannot be empty' },
        { status: 400 }
      )
    }

    if (emails.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 emails per batch' },
        { status: 400 }
      )
    }

    // Process each email and generate templates
    const processedEmails = []
    for (const emailData of emails) {
      if (!emailData.type || !emailData.data || !emailData.data.email) {
        continue; // Skip invalid email data
      }

      let emailTemplate
      const { type, data } = emailData

      switch (type) {
        case 'intake_confirmation':
          emailTemplate = EmailTemplates.getIntakeConfirmationTemplate(data)
          break
        case 'intake_approved':
          emailTemplate = EmailTemplates.getIntakeApprovedTemplate(data)
          break
        case 'intake_rejected':
          emailTemplate = EmailTemplates.getIntakeRejectedTemplate(data)
          break
        case 'welcome_sequence_1':
        case 'welcome_sequence_2':
        case 'welcome_sequence_3':
          const sequenceNumber = parseInt(type.split('_')[2]) as 1 | 2 | 3
          emailTemplate = EmailTemplates.getWelcomeSequenceTemplate(sequenceNumber, data)
          break
        default:
          continue; // Skip unknown email types
      }

      processedEmails.push({
        to: data.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
        type: type as any,
        userId: data.userId,
        metadata: data
      })
    }

    if (processedEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid emails to send' },
        { status: 400 }
      )
    }

    // Send bulk emails
    const results = await EmailService.sendBulkEmails(processedEmails)
    
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Bulk email sending completed`,
      stats: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      },
      results
    })

  } catch (error: any) {
    console.error('Bulk email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
