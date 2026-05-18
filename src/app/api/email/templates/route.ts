import { NextResponse } from 'next/server'
import { EmailTemplates } from '@/lib/email/email-templates'

// Email templates are now code-defined in email-templates.ts, not stored in Firestore.
// This route returns the static template catalog.

export async function GET() {
  try {
    const templates = EmailTemplates.getAllTemplates()
    return NextResponse.json({ success: true, templates })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
