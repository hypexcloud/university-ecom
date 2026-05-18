import { db } from '@/lib/server/db'
import { entitlements, invoices, auditLog } from '@/lib/server/db/schema'
import { generateInvoiceNumber } from './order-processing'

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
  await db.insert(invoices).values({
    orderId,
    number: invoiceNumber,
  })

  // Audit log
  await db.insert(auditLog).values({
    actorUid: adminUid,
    action: 'crypto.confirmed',
    targetType: 'order',
    targetId: orderId,
    after: { customerUid, planId, invoiceNumber },
  })
}
