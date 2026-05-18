import { pgTable, uuid, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { products } from './products'
import { plans } from './products'

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').unique().notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const courseModules = pgTable('course_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true),
})

export const courseWeeks = pgTable('course_weeks', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => courseModules.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
})

export const courseResources = pgTable('course_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  weekId: uuid('week_id')
    .notNull()
    .references(() => courseWeeks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'video' | 'pdf' | 'link' | 'quiz'
  url: text('url'),
  duration: integer('duration'), // seconds, for video
  metadata: jsonb('metadata'), // quiz questions, etc.
  orderIndex: integer('order_index').notNull().default(0),
})

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
})

export const moduleProgress = pgTable('module_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerUid: uuid('customer_uid')
    .notNull()
    .references(() => customers.uid),
  resourceId: uuid('resource_id')
    .notNull()
    .references(() => courseResources.id),
  completed: boolean('completed').default(false),
  progressPct: integer('progress_pct').default(0), // 0–100 for video
  quizScore: integer('quiz_score'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
