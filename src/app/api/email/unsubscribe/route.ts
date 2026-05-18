import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { consentLog } from '@/lib/server/db/schema'
import { createClient } from '@/lib/supabase/server'

/**
 * One-click email unsubscribe endpoint.
 * Supports both GET (link click) and POST (List-Unsubscribe-Post header).
 */
export async function GET() {
  // Show a simple confirmation page
  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="de">
    <head><meta charset="utf-8"><title>Abgemeldet</title></head>
    <body style="font-family:sans-serif;max-width:600px;margin:40px auto;text-align:center;">
      <h2 style="color:#D4AF37;">University Ecom</h2>
      <p>Du wurdest erfolgreich von Marketing-E-Mails abgemeldet.</p>
      <p>Transaktionale Nachrichten (Bestellungen, Tickets) erhältst du weiterhin.</p>
      <p><a href="/" style="color:#D4AF37;">Zurück zur Startseite</a></p>
    </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export async function POST(request: NextRequest) {
  // List-Unsubscribe-Post one-click handler
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await db.insert(consentLog).values({
      customerUid: user.id,
      consentType: 'marketing',
      granted: false,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      userAgent: request.headers.get('user-agent') || null,
    })
  }

  return NextResponse.json({ unsubscribed: true })
}
