import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { products } from './products'

export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  issuedByUid: uuid('issued_by_uid')
    .notNull()
    .references(() => customers.uid),
  pdfUrl: text('pdf_url'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow(),
})
