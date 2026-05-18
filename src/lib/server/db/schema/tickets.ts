import { pgTable, uuid, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { customers } from './customers'

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  category: text('category').notNull(), // support | hilfe | feedback | kursfrage | affiliate | creator | technisches_problem
  subject: text('subject').notNull(),
  status: text('status').notNull().default('offen'), // offen | in_bearbeitung | geschlossen
  assigneeUid: uuid('assignee_uid').references(() => customers.uid),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  customerStatusIdx: index('idx_tickets_customer_status').on(table.customerUid, table.status),
}))

export const ticketMessages = pgTable('ticket_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  authorUid: uuid('author_uid')
    .notNull()
    .references(() => customers.uid),
  body: text('body').notNull(),
  attachments: jsonb('attachments'), // [{url, name, size}]
  isInternal: boolean('is_internal').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
