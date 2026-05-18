import { NextResponse } from 'next/server'

// Email templates are code-defined, not database-stored.
export async function GET() {
  return NextResponse.json({
    success: true,
    templates: [
      { type: 'welcome', subject: 'Willkommen bei University Ecom' },
      { type: 'ticket_reply', subject: 'Neue Nachricht zu deinem Ticket' },
      { type: 'invoice_ready', subject: 'Deine Rechnung ist bereit' },
      { type: 'session_reminder', subject: 'Erinnerung: Dein Termin' },
    ],
  })
}
