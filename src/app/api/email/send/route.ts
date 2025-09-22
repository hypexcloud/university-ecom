import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email/email-service'
import { EmailTemplates } from '@/lib/email/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      )
    }

    let emailTemplate
    let result

    switch (type) {
      case 'intake_confirmation':
        emailTemplate = EmailTemplates.getIntakeConfirmationTemplate(data)
        result = await EmailService.sendEmail({
          to: data.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          type: 'intake_confirmation',
          userId: data.userId,
          metadata: { firstName: data.firstName }
        })
        break

      case 'intake_decision':
        const approved = data.approved === true
        emailTemplate = approved 
          ? EmailTemplates.getIntakeApprovedTemplate(data)
          : EmailTemplates.getIntakeRejectedTemplate(data)
        
        result = await EmailService.sendEmail({
          to: data.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          type: approved ? 'intake_approved' : 'intake_rejected',
          userId: data.userId,
          metadata: { 
            firstName: data.firstName, 
            approved, 
            reviewNotes: data.reviewNotes 
          }
        })
        break

      case 'welcome_sequence':
        const sequenceNumber = data.sequenceNumber || 1
        if (![1, 2, 3].includes(sequenceNumber)) {
          return NextResponse.json(
            { error: 'Invalid sequence number. Must be 1, 2, or 3' },
            { status: 400 }
          )
        }

        emailTemplate = EmailTemplates.getWelcomeSequenceTemplate(sequenceNumber, data)
        result = await EmailService.sendEmail({
          to: data.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          type: `welcome_sequence_${sequenceNumber}` as any,
          userId: data.userId,
          metadata: { 
            firstName: data.firstName, 
            sequenceNumber,
            courseName: data.courseName 
          }
        })
        break

      case 'support_ticket':
        const ticketType = data.ticketType || 'created'
        emailTemplate = EmailTemplates.getSupportTicketTemplate(ticketType, data)
        
        result = await EmailService.sendEmail({
          to: data.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          type: ticketType === 'created' ? 'support_ticket_created' : 'support_ticket_resolved',
          userId: data.userId,
          metadata: { 
            firstName: data.firstName,
            ticketId: data.ticketId,
            ticketSubject: data.ticketSubject,
            response: data.response
          }
        })
        break

      case 'test':
        result = await EmailService.sendTestEmail(data.email)
        break

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        emailId: result.id
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const test = searchParams.get('test')

  if (test === 'true') {
    return NextResponse.json({
      message: 'Email API is running',
      endpoints: {
        send: 'POST /api/email/send',
        bulk: 'POST /api/email/bulk',
        templates: 'GET /api/email/templates'
      }
    })
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
