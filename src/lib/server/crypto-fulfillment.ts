import { db } from '@/lib/server/db'
import { entitlements, invoices, auditLog, orders, orderItems } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { generateInvoiceNumber } from './order-processing'
import { generateAndUploadInvoicePdf } from './invoice-generate'

export async function fulfillCryptoOrder(
  customerUid: string,
  planId: string,
  orderId: string,
  adminUid: string,
) {
  // Grant entitlement
  await db.insert(entitlements).values({
    customerUid,
    planId,
    sourceOrderId: orderId,
  })

  // Generate invoice
  const invoiceNumber = await generateInvoiceNumber()
  const [invoice] = await db.insert(invoices).values({
    orderId,
    number: invoiceNumber,
  }).returning()

  // Fetch order for totals
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  const totalCents = order?.totalCents || 0
  const vatRate = 0.19
  const netCents = Math.round(totalCents / (1 + vatRate))
  const vatCents = totalCents - netCents

  // Generate PDF (non-fatal)
  generateAndUploadInvoicePdf({
    invoiceId: invoice.id,
    invoiceNumber,
    customerUid,
    orderId,
    totalCents,
    netCents,
    vatCents,
    vatRate: 19,
    provider: 'crypto',
    providerRef: order?.providerRef || '',
    planId,
  }).catch(() => {})

  // Audit log
  await db.insert(auditLog).values({
    actorUid: adminUid,
    action: 'crypto.confirmed',
    targetType: 'order',
    targetId: orderId,
    after: { customerUid, planId, invoiceNumber },
  })
}
