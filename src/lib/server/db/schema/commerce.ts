import { pgTable, uuid, text, integer, boolean, jsonb, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { customers } from './customers'
import { plans } from './products'

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').notNull().default('EUR'),
  status: text('status').notNull(), // 'pending' | 'paid' | 'refunded' | 'awaiting_crypto'
  provider: text('provider').notNull(), // 'stripe' | 'paypal' | 'crypto'
  providerRef: text('provider_ref'),
  giftcardAppliedCents: integer('giftcard_applied_cents').default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  customerCreatedIdx: index('idx_orders_customer_created').on(table.customerUid, table.createdAt),
  statusIdx: index('idx_orders_status').on(table.status),
}))

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  priceCents: integer('price_cents').notNull(),
  isUpgrade: boolean('is_upgrade').default(false),
  upgradeFromPlanId: uuid('upgrade_from_plan_id').references(() => plans.id),
})

export const entitlements = pgTable('entitlements', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  sourceOrderId: uuid('source_order_id').references(() => orders.id),
  grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
}, (table) => ({
  activeEntitlement: uniqueIndex('uq_active_entitlement')
    .on(table.customerUid, table.planId)
    .where(sql`revoked_at IS NULL`),
  customerIdx: index('idx_entitlements_customer').on(table.customerUid),
}))

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  number: text('number').unique().notNull(), // INV-2026-000123
  pdfUrl: text('pdf_url'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
})

export const giftcards = pgTable('giftcards', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').unique().notNull(),
  initialCents: integer('initial_cents').notNull(),
  balanceCents: integer('balance_cents').notNull(),
  buyerUid: uuid('buyer_uid').references(() => customers.uid),
  recipientEmail: text('recipient_email'),
  status: text('status').default('active'), // active | redeemed | expired
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
