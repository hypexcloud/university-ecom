import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { certificates, customers, products, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { generateCertificatePdf } from '@/lib/server/certificate-pdf'
import { createClient } from '@supabase/supabase-js'
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

    const [customer] = await db.select().from(customers).where(eq(customers.uid, data.customerUid)).limit(1)
    const [product] = await db.select().from(products).where(eq(products.id, data.productId)).limit(1)

    if (!customer || !product) {
      return NextResponse.json({ error: 'Kunde oder Produkt nicht gefunden' }, { status: 404 })
    }

    const [cert] = await db.insert(certificates).values({
      customerUid: data.customerUid,
      productId: data.productId,
      issuedByUid: admin.uid,
    }).returning()

    // Generate PDF and upload to Supabase Storage
    let pdfUrl: string | null = null
    try {
      const pdfBuffer = await generateCertificatePdf({
        customerName: `${customer.firstName} ${customer.lastName}`,
        productTitle: product.title,
        issuedDate: new Date().toLocaleDateString('de-DE'),
        certificateId: cert.id,
      })

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (supabaseUrl && serviceKey) {
        const supabase = createClient(supabaseUrl, serviceKey)
        const filename = `certificates/${cert.id}.pdf`

        await supabase.storage.from('invoices').upload(filename, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

        const { data: signed } = await supabase.storage
          .from('invoices')
          .createSignedUrl(filename, 60 * 60 * 24 * 365)

        pdfUrl = signed?.signedUrl || null
      }
    } catch {
      // PDF generation failure is non-fatal
    }

    if (pdfUrl) {
      await db.update(certificates).set({ pdfUrl }).where(eq(certificates.id, cert.id))
    }

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

    return NextResponse.json({ success: true, certificate: { ...cert, pdfUrl } }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
