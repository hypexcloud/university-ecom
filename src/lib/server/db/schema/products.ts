import { pgTable, uuid, text, integer, boolean, jsonb, unique } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  kind: text('kind').notNull(), // 'course' | 'creator' | 'giftcard' | 'addon'
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  isActive: boolean('is_active').default(true),
})

export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  code: text('code').notNull(), // 'fast' | 'business' | 'infinity' | 'tiktok' | 'youtube'
  priceCents: integer('price_cents').notNull(),
  currency: text('currency').notNull().default('EUR'),
  features: jsonb('features'),
  releaseStrategy: jsonb('release_strategy'), // e.g. {type:'all_unlocked'} or {type:'mentor_gated'}
}, (table) => ({
  productCode: unique('uq_plans_product_code').on(table.productId, table.code),
}))
