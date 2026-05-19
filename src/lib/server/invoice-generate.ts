import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/server/db'
import { invoices, customers, plans, products } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { renderInvoicePdfBuffer } from './invoice-pdf'

// Seller details — move to env vars when the legal entity is finalized
const SELLER_NAME = process.env.INVOICE_SELLER_NAME || 'University Ecom GmbH'
const SELLER_ADDRESS = process.env.INVOICE_SELLER_ADDRESS || 'Musterstraße 1, 10115 Berlin, Deutschland'
const SELLER_TAX_ID = process.env.INVOICE_SELLER_TAX_ID || 'DE000000000'

interface GenerateParams {
  invoiceId: string
  invoiceNumber: string
  customerUid: string
  orderId: string
  totalCents: number
  netCents: number
  vatCents: number
  vatRate: number
  provider: string
  providerRef: string
  planId: string
}

export async function generateAndUploadInvoicePdf(params: GenerateParams): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null

  // Fetch customer + plan details for the invoice
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.uid, params.customerUid))
    .limit(1)

  const [plan] = await db
    .select({ code: plans.code, productTitle: products.title })
    .from(plans)
    .innerJoin(products, eq(plans.productId, products.id))
    .where(eq(plans.id, params.planId))
    .limit(1)

  if (!customer || !plan) return null

  // Build buyer address from billing JSONB
  const billing = customer.billing as Record<string, string> | null
  const buyerName = billing?.companyName
    ? `${billing.companyName}\nz.Hd. ${customer.firstName} ${customer.lastName}`
    : `${customer.firstName} ${customer.lastName}`
  const buyerAddress = billing
    ? [billing.street, `${billing.zipCode} ${billing.city}`, billing.country].filter(Boolean).join(', ')
    : customer.email

  // Render PDF
  const pdfBuffer = await renderInvoicePdfBuffer({
    invoiceNumber: params.invoiceNumber,
    invoiceDate: new Date().toLocaleDateString('de-DE'),
    sellerName: SELLER_NAME,
    sellerAddress: SELLER_ADDRESS,
    sellerTaxId: SELLER_TAX_ID,
    buyerName,
    buyerAddress,
    buyerTaxId: billing?.vatId || undefined,
    items: [{ description: `${plan.productTitle} — ${plan.code}`, netCents: params.netCents }],
    netTotalCents: params.netCents,
    vatRate: params.vatRate,
    vatCents: params.vatCents,
    grossTotalCents: params.totalCents,
    paymentMethod: params.provider === 'stripe' ? 'Kreditkarte / SEPA' : params.provider === 'paypal' ? 'PayPal' : 'Kryptowährung',
    paymentRef: params.providerRef,
  })

  // Upload to Supabase Storage
  const supabase = createClient(supabaseUrl, serviceKey)
  const filename = `invoices/${params.invoiceNumber}.pdf`

  await supabase.storage.from('invoices').upload(filename, pdfBuffer, {
    contentType: 'application/pdf',
    upsert: true,
  })

  // Create a signed URL valid for 10 years (effectively permanent for download)
  const { data: signed } = await supabase.storage
    .from('invoices')
    .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)

  const pdfUrl = signed?.signedUrl || null

  // Update invoice record with URL
  if (pdfUrl) {
    await db.update(invoices).set({ pdfUrl }).where(eq(invoices.id, params.invoiceId))
  }

  return pdfUrl
}
