/**
 * Seed script for Supabase Postgres via Drizzle.
 *
 * Usage:
 *   npx tsx scripts/setup-supabase.ts
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - Supabase project created with Auth email provider enabled
 *   - SUPABASE_SERVICE_ROLE_KEY set (for admin user creation)
 *   - Tables pushed via `npm run db:push`
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { createClient } from '@supabase/supabase-js'
import * as schema from '../src/lib/server/db/schema'

const DATABASE_URL = process.env.DATABASE_URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!DATABASE_URL || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required env vars: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const client = postgres(DATABASE_URL, { prepare: false })
const db = drizzle(client, { schema })
// Node 20 lacks native WebSocket; provide ws for the Supabase Realtime client
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocketPolyfill = require('ws')
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocketPolyfill },
})

async function seed() {
  console.log('🌱 Seeding University Ecom database...\n')

  // 1. Create admin user in Supabase Auth
  console.log('👤 Creating admin user in Supabase Auth...')
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@university-ecom.de',
    password: 'Admin2026!Secure',
    email_confirm: true,
    user_metadata: { first_name: 'Admin', last_name: 'UniEC' },
  })

  if (authError && !authError.message.includes('already been registered')) {
    console.error('Auth error:', authError.message)
    process.exit(1)
  }

  const adminUid = authUser?.user?.id ?? (await getExistingUserId('admin@university-ecom.de'))
  console.log(`  ✓ Admin UID: ${adminUid}\n`)

  // 2. Insert customer row for admin
  console.log('📋 Inserting admin customer row...')
  await db.insert(schema.customers).values({
    uid: adminUid,
    email: 'admin@university-ecom.de',
    firstName: 'Admin',
    lastName: 'UniEC',
    status: 'active',
  }).onConflictDoNothing()

  // 3. Grant admin all permissions
  console.log('🔐 Granting admin permissions...')
  await db.insert(schema.adminPermissions).values({
    uid: adminUid,
    perms: {
      customers: true,
      products: true,
      payments: true,
      affiliate: true,
      tickets: true,
      videos: true,
      analytics: true,
    },
  }).onConflictDoNothing()

  // 4. Seed products
  console.log('\n📦 Seeding products...')
  const productValues = [
    { id: '00000000-0000-0000-0000-000000000001', kind: 'course', slug: 'ai-kurs', title: 'AI-Automatisierung Kurs' },
    { id: '00000000-0000-0000-0000-000000000002', kind: 'course', slug: 'dropshipping-kurs', title: 'EU-Dropshipping Kurs' },
    { id: '00000000-0000-0000-0000-000000000003', kind: 'creator', slug: 'tiktok-creator', title: 'TikTok Creator Programm' },
    { id: '00000000-0000-0000-0000-000000000004', kind: 'creator', slug: 'youtube-creator', title: 'YouTube Creator Programm' },
  ] as const

  for (const p of productValues) {
    await db.insert(schema.products).values(p).onConflictDoNothing()
  }
  console.log(`  ✓ ${productValues.length} products`)

  // 5. Seed plans
  console.log('💰 Seeding plans...')
  const planValues = [
    // AI Kurs plans
    { id: '10000000-0000-0000-0000-000000000001', productId: '00000000-0000-0000-0000-000000000001', code: 'fast', priceCents: 20000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: '10000000-0000-0000-0000-000000000002', productId: '00000000-0000-0000-0000-000000000001', code: 'business', priceCents: 100000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: '10000000-0000-0000-0000-000000000003', productId: '00000000-0000-0000-0000-000000000001', code: 'infinity', priceCents: 140000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    // Dropshipping Kurs plans
    { id: '10000000-0000-0000-0000-000000000004', productId: '00000000-0000-0000-0000-000000000002', code: 'fast', priceCents: 20000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: '10000000-0000-0000-0000-000000000005', productId: '00000000-0000-0000-0000-000000000002', code: 'business', priceCents: 100000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: '10000000-0000-0000-0000-000000000006', productId: '00000000-0000-0000-0000-000000000002', code: 'infinity', priceCents: 300000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    // Creator plans
    { id: '10000000-0000-0000-0000-000000000007', productId: '00000000-0000-0000-0000-000000000003', code: 'tiktok', priceCents: 7500, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: '10000000-0000-0000-0000-000000000008', productId: '00000000-0000-0000-0000-000000000004', code: 'youtube', priceCents: 10000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
  ] as const

  for (const p of planValues) {
    await db.insert(schema.plans).values(p).onConflictDoNothing()
  }
  console.log(`  ✓ ${planValues.length} plans`)

  // 6. Seed courses with modules
  console.log('📚 Seeding courses...')
  const courseValues = [
    { id: '20000000-0000-0000-0000-000000000001', productId: '00000000-0000-0000-0000-000000000001', title: 'AI-Automatisierung', slug: 'ai-automatisierung', description: 'Lerne AI-Automation für dein Business' },
    { id: '20000000-0000-0000-0000-000000000002', productId: '00000000-0000-0000-0000-000000000002', title: 'EU-Dropshipping', slug: 'eu-dropshipping', description: 'Baue dein EU-Dropshipping Business auf' },
  ]

  for (const c of courseValues) {
    await db.insert(schema.courses).values(c).onConflictDoNothing()
  }

  // Sample modules for AI course
  const aiModules = [
    { id: '30000000-0000-0000-0000-000000000001', courseId: '20000000-0000-0000-0000-000000000001', title: 'Einführung in AI-Automation', orderIndex: 0 },
    { id: '30000000-0000-0000-0000-000000000002', courseId: '20000000-0000-0000-0000-000000000001', title: 'ChatGPT & Prompting Mastery', orderIndex: 1 },
    { id: '30000000-0000-0000-0000-000000000003', courseId: '20000000-0000-0000-0000-000000000001', title: 'Automatisierte Workflows', orderIndex: 2 },
    { id: '30000000-0000-0000-0000-000000000004', courseId: '20000000-0000-0000-0000-000000000001', title: 'AI im E-Commerce', orderIndex: 3 },
  ]

  for (const m of aiModules) {
    await db.insert(schema.courseModules).values(m).onConflictDoNothing()
  }

  // Sample modules for Dropshipping course
  const dsModules = [
    { id: '30000000-0000-0000-0000-000000000005', courseId: '20000000-0000-0000-0000-000000000002', title: 'EU-Marktanalyse', orderIndex: 0 },
    { id: '30000000-0000-0000-0000-000000000006', courseId: '20000000-0000-0000-0000-000000000002', title: 'Lieferanten & Sourcing', orderIndex: 1 },
    { id: '30000000-0000-0000-0000-000000000007', courseId: '20000000-0000-0000-0000-000000000002', title: 'Shop Setup & Branding', orderIndex: 2 },
    { id: '30000000-0000-0000-0000-000000000008', courseId: '20000000-0000-0000-0000-000000000002', title: 'Marketing & Skalierung', orderIndex: 3 },
  ]

  for (const m of dsModules) {
    await db.insert(schema.courseModules).values(m).onConflictDoNothing()
  }

  console.log(`  ✓ 2 courses, ${aiModules.length + dsModules.length} modules`)

  console.log('\n✅ Seed complete!')
  console.log('\n📝 Admin credentials:')
  console.log('   Email: admin@university-ecom.de')
  console.log('   Password: Admin2026!Secure')
  console.log('   (Enable TOTP MFA in Supabase dashboard for this user)')

  await client.end()
}

async function getExistingUserId(email: string): Promise<string> {
  const { data } = await supabase.auth.admin.listUsers()
  const user = data?.users?.find((u) => u.email === email)
  if (!user) throw new Error(`User ${email} not found`)
  return user.id
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
