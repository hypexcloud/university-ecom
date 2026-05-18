import { pgTable, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { customers } from './customers'

export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorUid: uuid('author_uid')
    .notNull()
    .references(() => customers.uid),
  category: text('category').notNull(), // news | updates | ankuendigungen | erfolge
  title: text('title').notNull(),
  body: text('body').notNull(),
  mediaUrls: jsonb('media_urls'), // string[]
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const kundenerfolge = pgTable('kundenerfolge', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid').references(() => customers.uid),
  title: text('title').notNull(),
  description: text('description'),
  mediaType: text('media_type').notNull(), // 'image' | 'video'
  mediaUrl: text('media_url').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
