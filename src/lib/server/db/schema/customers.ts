import { pgTable, uuid, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  uid: uuid('uid').primaryKey(), // references auth.users(id)
  email: text('email').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  discordUsername: text('discord_username'),
  whatsapp: text('whatsapp'),
  status: text('status').notNull().default('active'), // active | suspended | deleted
  billing: jsonb('billing'), // {type, address, country, city, phone, company_name?, vat_id?}
  discordUserId: text('discord_user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminPermissions = pgTable('admin_permissions', {
  uid: uuid('uid')
    .primaryKey()
    .references(() => customers.uid, { onDelete: 'cascade' }),
  perms: jsonb('perms').notNull(), // {customers, products, payments, affiliate, tickets, videos, analytics}
})

export const mentors = pgTable('mentors', {
  uid: uuid('uid')
    .primaryKey()
    .references(() => customers.uid, { onDelete: 'cascade' }),
  isActive: boolean('is_active').notNull().default(true),
  specialties: jsonb('specialties'), // e.g. ['ai', 'dropshipping']
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
