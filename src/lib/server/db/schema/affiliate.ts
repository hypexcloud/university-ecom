import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { orders } from './commerce'

export const affiliateLinks = pgTable('affiliate_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .unique()
    .references(() => customers.uid),
  code: text('code').unique().notNull(),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 4 }).default('0.1500'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const affiliateReferrals = pgTable('affiliate_referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  linkId: uuid('link_id')
    .notNull()
    .references(() => affiliateLinks.id),
  referredCustomerUid: uuid('referred_customer_uid').references(() => customers.uid),
  orderId: uuid('order_id').references(() => orders.id),
  amountCents: integer('amount_cents'),
  status: text('status').default('pending'), // pending | approved | paid | rejected
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const payouts = pgTable('payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateUid: uuid('affiliate_uid')
    .notNull()
    .references(() => customers.uid),
  amountCents: integer('amount_cents').notNull(),
  status: text('status').default('pending'), // pending | paid
  paidAt: timestamp('paid_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
