import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { invoices, orders, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const [invoice] = await db
      .select({
        id: invoices.id,
        number: invoices.number,
        pdfUrl: invoices.pdfUrl,
        issuedAt: invoices.issuedAt,
        orderId: invoices.orderId,
        orderCustomerUid: orders.customerUid,
      })
      .from(invoices)
      .innerJoin(orders, eq(invoices.orderId, orders.id))
      .where(eq(invoices.id, id))
      .limit(1)

    if (!invoice) {
      return NextResponse.json({ error: 'Rechnung nicht gefunden' }, { status: 404 })
    }

    // Customer can only access their own invoices
    if (invoice.orderCustomerUid !== user.uid) {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 })
    }

    if (!invoice.pdfUrl) {
      return NextResponse.json({ error: 'PDF noch nicht generiert' }, { status: 404 })
    }

    // Return the signed URL (Supabase Storage signed URLs are already time-limited)
    return NextResponse.json({
      invoice: {
        id: invoice.id,
        number: invoice.number,
        pdfUrl: invoice.pdfUrl,
        issuedAt: invoice.issuedAt,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
