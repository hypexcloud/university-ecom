import { pgTable, uuid, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { customers } from './customers'

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  mentorUid: uuid('mentor_uid')
    .notNull()
    .references(() => customers.uid),
  type: text('type').notNull(), // 'zoom' | 'meet' | 'discord'
  status: text('status').notNull().default('pending'), // pending | accepted | rejected | completed | missed | cancelled
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  notes: text('notes'),
  meetingUrl: text('meeting_url'),
  customerProposal: timestamp('customer_proposal', { withTimezone: true }), // alternative time proposed
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  customerScheduledIdx: index('idx_sessions_customer_scheduled').on(table.customerUid, table.scheduledAt),
}))

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorUid: uuid('mentor_uid')
    .notNull()
    .references(() => customers.uid),
  dayOfWeek: text('day_of_week').notNull(), // 'monday' | 'tuesday' | ...
  startTime: text('start_time').notNull(), // HH:mm
  endTime: text('end_time').notNull(), // HH:mm
  isActive: boolean('is_active').notNull().default(true),
})
