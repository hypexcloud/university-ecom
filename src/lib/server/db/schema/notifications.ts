import { pgTable, uuid, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { customers } from './customers'

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipientUid: uuid('recipient_uid')
    .notNull()
    .references(() => customers.uid),
  event: text('event').notNull(), // message_new | ticket_reply | invoice_ready | course_unlocked | appointment_*
  title: text('title').notNull(),
  body: text('body'),
  link: text('link'),
  readAt: timestamp('read_at', { withTimezone: true }),
  channels: jsonb('channels'), // {bell:true, email:true, discord:true}
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  recipientReadIdx: index('idx_notifications_recipient_read').on(table.recipientUid, table.readAt),
}))
