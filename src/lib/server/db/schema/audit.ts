import { pgTable, uuid, text, boolean, bigserial, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { customers } from './customers'

export const auditLog = pgTable('audit_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  actorUid: uuid('actor_uid').references(() => customers.uid),
  action: text('action').notNull(),
  targetType: text('target_type'),
  targetId: text('target_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  targetIdx: index('idx_audit_target').on(table.targetType, table.targetId, table.createdAt),
}))

export const analyticsEvents = pgTable('analytics_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  customerUid: uuid('customer_uid').references(() => customers.uid),
  name: text('name').notNull(), // page_view | checkout_started | order_paid | ...
  props: jsonb('props'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
})

export const consentLog = pgTable('consent_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  consentType: text('consent_type').notNull(), // essential | analytics | marketing
  granted: boolean('granted').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminNotes = pgTable('admin_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  authorUid: uuid('author_uid')
    .notNull()
    .references(() => customers.uid),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
