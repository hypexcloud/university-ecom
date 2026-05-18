import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { certificates, customers, products, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const issueSchema = z.object({
  customerUid: z.string().uuid(),
  productId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const admin = await requireAdmin('products')
    const data = issueSchema.parse(await request.json())

    // Verify customer and product exist
    const [customer] = await db.select().from(customers).where(eq(customers.uid, data.customerUid)).limit(1)
    const [product] = await db.select().from(products).where(eq(products.id, data.productId)).limit(1)

    if (!customer || !product) {
      return NextResponse.json({ error: 'Kunde oder Produkt nicht gefunden' }, { status: 404 })
    }

    // TODO: Generate PDF via @react-pdf/renderer and upload to Supabase Storage
    // For now, create the certificate row without PDF
    const [cert] = await db.insert(certificates).values({
      customerUid: data.customerUid,
      productId: data.productId,
      issuedByUid: admin.uid,
      pdfUrl: null, // Will be set when PDF generation is wired
    }).returning()

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'certificate.issue',
      targetType: 'certificate',
      targetId: cert.id,
      after: { customerUid: data.customerUid, productId: data.productId },
    })

    await emitNotification({
      recipientUid: data.customerUid,
      event: 'certificate_issued',
      title: `Zertifikat: ${product.title}`,
      body: 'Dein Zertifikat wurde ausgestellt und steht zum Download bereit.',
      link: '/student/certificates',
    }).catch(() => {})

    return NextResponse.json({ success: true, certificate: cert }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
