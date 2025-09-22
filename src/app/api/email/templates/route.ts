import { NextRequest, NextResponse } from 'next/server'
import { FirestoreService } from '@/lib/firebase/firestore'
import { EmailTemplates } from '@/lib/email/email-templates'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type) {
      // Get specific template
      const templates = await FirestoreService.query(
        'email_templates',
        [{ field: 'type', operator: '==', value: type }],
        'createdAt',
        'desc',
        1
      )

      if (templates.length === 0) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        template: templates[0]
      })
    } else {
      // Get all templates
      const templates = await FirestoreService.getAll('email_templates')
      return NextResponse.json({
        success: true,
        templates
      })
    }

  } catch (error: any) {
    console.error('Templates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, html, text, description } = body

    if (!type || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: type, subject, html' },
        { status: 400 }
      )
    }

    const templateData = {
      type,
      subject,
      html,
      text: text || '',
      description: description || '',
      isActive: true
    }

    const templateId = await FirestoreService.create('email_templates', templateData)

    return NextResponse.json({
      success: true,
      message: 'Template created successfully',
      templateId
    })

  } catch (error: any) {
    console.error('Create template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, subject, html, text, description, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (type) updateData.type = type
    if (subject) updateData.subject = subject
    if (html) updateData.html = html
    if (text !== undefined) updateData.text = text
    if (description !== undefined) updateData.description = description
    if (isActive !== undefined) updateData.isActive = isActive

    await FirestoreService.update('email_templates', id, updateData)

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully'
    })

  } catch (error: any) {
    console.error('Update template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      )
    }

    await FirestoreService.delete('email_templates', id)

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
