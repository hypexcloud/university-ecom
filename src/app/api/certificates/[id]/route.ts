import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { certificates, products } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const [cert] = await db
      .select({
        id: certificates.id,
        customerUid: certificates.customerUid,
        productTitle: products.title,
        pdfUrl: certificates.pdfUrl,
        issuedAt: certificates.issuedAt,
      })
      .from(certificates)
      .innerJoin(products, eq(certificates.productId, products.id))
      .where(eq(certificates.id, id))
      .limit(1)

    if (!cert || cert.customerUid !== user.uid) {
      return NextResponse.json({ error: 'Zertifikat nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ certificate: cert })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
