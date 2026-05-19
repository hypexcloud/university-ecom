/**
 * Seed script for Supabase Postgres via Drizzle.
 *
 * Usage:
 *   npm run db:seed
 *   (or: npx tsx scripts/setup-supabase.ts)
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - Supabase project running with Auth email provider
 *   - SUPABASE_SERVICE_ROLE_KEY set
 *   - Tables pushed via `npm run db:push`
 *
 * This script is idempotent — safe to run multiple times.
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
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Fixed UUIDs for deterministic seed
const ID = {
  // Products
  aiKurs: '00000000-0000-0000-0000-000000000001',
  dsKurs: '00000000-0000-0000-0000-000000000002',
  tiktok: '00000000-0000-0000-0000-000000000003',
  youtube: '00000000-0000-0000-0000-000000000004',
  // Plans
  aiFast: '10000000-0000-0000-0000-000000000001',
  aiBusiness: '10000000-0000-0000-0000-000000000002',
  aiInfinity: '10000000-0000-0000-0000-000000000003',
  dsFast: '10000000-0000-0000-0000-000000000004',
  dsBusiness: '10000000-0000-0000-0000-000000000005',
  dsInfinity: '10000000-0000-0000-0000-000000000006',
  tiktokPlan: '10000000-0000-0000-0000-000000000007',
  youtubePlan: '10000000-0000-0000-0000-000000000008',
  // Courses
  aiCourse: '20000000-0000-0000-0000-000000000001',
  dsCourse: '20000000-0000-0000-0000-000000000002',
  // Modules
  aiMod1: '30000000-0000-0000-0000-000000000001',
  aiMod2: '30000000-0000-0000-0000-000000000002',
  aiMod3: '30000000-0000-0000-0000-000000000003',
  aiMod4: '30000000-0000-0000-0000-000000000004',
  dsMod1: '30000000-0000-0000-0000-000000000005',
  dsMod2: '30000000-0000-0000-0000-000000000006',
  dsMod3: '30000000-0000-0000-0000-000000000007',
  dsMod4: '30000000-0000-0000-0000-000000000008',
  // Weeks
  aiW1: '40000000-0000-0000-0000-000000000001',
  aiW2: '40000000-0000-0000-0000-000000000002',
  aiW3: '40000000-0000-0000-0000-000000000003',
  aiW4: '40000000-0000-0000-0000-000000000004',
  dsW1: '40000000-0000-0000-0000-000000000005',
  dsW2: '40000000-0000-0000-0000-000000000006',
  dsW3: '40000000-0000-0000-0000-000000000007',
  dsW4: '40000000-0000-0000-0000-000000000008',
}

async function createAuthUser(email: string, password: string, meta: { first_name: string; last_name: string }): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  })
  if (error && !error.message.includes('already been registered')) {
    console.error(`  ✗ Auth error for ${email}:`, error.message)
    // Try to find existing
    const { data: list } = await supabase.auth.admin.listUsers()
    const existing = list?.users?.find((u) => u.email === email)
    if (existing) return existing.id
    throw error
  }
  if (data?.user) return data.user.id
  // Existing user
  const { data: list } = await supabase.auth.admin.listUsers()
  const existing = list?.users?.find((u) => u.email === email)
  if (existing) return existing.id
  throw new Error(`Could not resolve UID for ${email}`)
}

async function seed() {
  console.log('🌱 Seeding University Ecom database...\n')

  // ─── 1. Users ───────────────────────────────────────────────
  console.log('👤 Creating users in Supabase Auth...')

  const adminUid = await createAuthUser('admin@university-ecom.de', 'Admin2026!Secure', { first_name: 'Admin', last_name: 'UniEC' })
  console.log(`  ✓ Admin: ${adminUid}`)

  const mentorUid = await createAuthUser('mentor@university-ecom.de', 'Mentor2026!Secure', { first_name: 'Max', last_name: 'Mentor' })
  console.log(`  ✓ Mentor: ${mentorUid}`)

  const student1Uid = await createAuthUser('student1@test.de', 'Student2026!', { first_name: 'Anna', last_name: 'Testkundin' })
  console.log(`  ✓ Student 1 (Business): ${student1Uid}`)

  const student2Uid = await createAuthUser('student2@test.de', 'Student2026!', { first_name: 'Tom', last_name: 'Tester' })
  console.log(`  ✓ Student 2 (Fast): ${student2Uid}`)

  const student3Uid = await createAuthUser('creator@test.de', 'Student2026!', { first_name: 'Lisa', last_name: 'Creator' })
  console.log(`  ✓ Student 3 (Creator): ${student3Uid}`)

  // ─── 2. Customer rows ───────────────────────────────────────
  console.log('\n📋 Inserting customer rows...')
  const customerRows = [
    { uid: adminUid, email: 'admin@university-ecom.de', firstName: 'Admin', lastName: 'UniEC', discordUsername: 'admin_uniec', status: 'active' },
    { uid: mentorUid, email: 'mentor@university-ecom.de', firstName: 'Max', lastName: 'Mentor', discordUsername: 'max_mentor', status: 'active' },
    { uid: student1Uid, email: 'student1@test.de', firstName: 'Anna', lastName: 'Testkundin', discordUsername: 'anna_test', whatsapp: '+491701234567', status: 'active',
      billing: { street: 'Musterstraße 1', zipCode: '10115', city: 'Berlin', country: 'Deutschland' } },
    { uid: student2Uid, email: 'student2@test.de', firstName: 'Tom', lastName: 'Tester', discordUsername: 'tom_tester', status: 'active' },
    { uid: student3Uid, email: 'creator@test.de', firstName: 'Lisa', lastName: 'Creator', discordUsername: 'lisa_creates', status: 'active' },
  ]
  for (const c of customerRows) {
    await db.insert(schema.customers).values(c).onConflictDoNothing()
  }
  console.log(`  ✓ ${customerRows.length} customers`)

  // ─── 3. Admin permissions ───────────────────────────────────
  console.log('🔐 Granting permissions...')
  await db.insert(schema.adminPermissions).values({
    uid: adminUid,
    perms: { customers: true, products: true, payments: true, affiliate: true, tickets: true, videos: true, analytics: true },
  }).onConflictDoNothing()

  // ─── 4. Mentor ──────────────────────────────────────────────
  console.log('🎓 Setting up mentor...')
  await db.insert(schema.mentors).values({
    uid: mentorUid, isActive: true, specialties: ['ai', 'dropshipping'], bio: 'Erfahrener E-Commerce Coach',
  }).onConflictDoNothing()

  // Mentor availability: Mon-Fri, 10:00-17:00
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  for (const day of days) {
    await db.insert(schema.availability).values({
      mentorUid, dayOfWeek: day, startTime: '10:00', endTime: '17:00', isActive: true,
    }).onConflictDoNothing()
  }
  console.log('  ✓ Mentor with Mon-Fri 10:00-17:00 availability')

  // ─── 5. Products ────────────────────────────────────────────
  console.log('\n📦 Seeding products...')
  const productValues = [
    { id: ID.aiKurs, kind: 'course', slug: 'ai-kurs', title: 'AI-Automatisierung Kurs' },
    { id: ID.dsKurs, kind: 'course', slug: 'dropshipping-kurs', title: 'EU-Dropshipping Kurs' },
    { id: ID.tiktok, kind: 'creator', slug: 'tiktok-creator', title: 'TikTok Creator Programm' },
    { id: ID.youtube, kind: 'creator', slug: 'youtube-creator', title: 'YouTube Creator Programm' },
  ] as const
  for (const p of productValues) {
    await db.insert(schema.products).values(p).onConflictDoNothing()
  }
  console.log(`  ✓ ${productValues.length} products`)

  // ─── 6. Plans ───────────────────────────────────────────────
  console.log('💰 Seeding plans...')
  const planValues = [
    { id: ID.aiFast, productId: ID.aiKurs, code: 'fast', priceCents: 20000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.aiBusiness, productId: ID.aiKurs, code: 'business', priceCents: 100000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.aiInfinity, productId: ID.aiKurs, code: 'infinity', priceCents: 140000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.dsFast, productId: ID.dsKurs, code: 'fast', priceCents: 20000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.dsBusiness, productId: ID.dsKurs, code: 'business', priceCents: 100000, currency: 'EUR', releaseStrategy: { type: 'mentor_gated' } },
    { id: ID.dsInfinity, productId: ID.dsKurs, code: 'infinity', priceCents: 300000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.tiktokPlan, productId: ID.tiktok, code: 'tiktok', priceCents: 7500, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
    { id: ID.youtubePlan, productId: ID.youtube, code: 'youtube', priceCents: 10000, currency: 'EUR', releaseStrategy: { type: 'all_unlocked' } },
  ] as const
  for (const p of planValues) {
    await db.insert(schema.plans).values(p).onConflictDoNothing()
  }
  console.log(`  ✓ ${planValues.length} plans`)

  // ─── 7. Courses + Modules + Weeks + Resources ──────────────
  console.log('📚 Seeding courses...')
  await db.insert(schema.courses).values([
    { id: ID.aiCourse, productId: ID.aiKurs, title: 'AI-Automatisierung', slug: 'ai-automatisierung', description: 'Lerne AI-Automation für dein Business' },
    { id: ID.dsCourse, productId: ID.dsKurs, title: 'EU-Dropshipping', slug: 'eu-dropshipping', description: 'Baue dein EU-Dropshipping Business auf' },
  ]).onConflictDoNothing()

  const modules = [
    { id: ID.aiMod1, courseId: ID.aiCourse, title: 'Einführung in AI-Automation', description: 'Grundlagen der AI und was Automatisierung für dein Business bedeutet.', orderIndex: 0 },
    { id: ID.aiMod2, courseId: ID.aiCourse, title: 'ChatGPT & Prompting Mastery', description: 'Prompts schreiben, die echte Ergebnisse liefern.', orderIndex: 1 },
    { id: ID.aiMod3, courseId: ID.aiCourse, title: 'Automatisierte Workflows', description: 'Make, Zapier, n8n — verbinde deine Tools zu automatisierten Pipelines.', orderIndex: 2 },
    { id: ID.aiMod4, courseId: ID.aiCourse, title: 'AI im E-Commerce', description: 'Produkttexte, Ads, Kundenservice — AI in der Praxis.', orderIndex: 3 },
    { id: ID.dsMod1, courseId: ID.dsCourse, title: 'EU-Marktanalyse', description: 'Finde profitable Nischen im europäischen Markt.', orderIndex: 0 },
    { id: ID.dsMod2, courseId: ID.dsCourse, title: 'Lieferanten & Sourcing', description: 'EU-Lieferanten finden, verhandeln, Verträge aufsetzen.', orderIndex: 1 },
    { id: ID.dsMod3, courseId: ID.dsCourse, title: 'Shop Setup & Branding', description: 'Shopify aufsetzen, Brand Identity, Conversion-Optimierung.', orderIndex: 2 },
    { id: ID.dsMod4, courseId: ID.dsCourse, title: 'Marketing & Skalierung', description: 'Facebook Ads, TikTok Ads, Google Ads — skaliere deinen Shop.', orderIndex: 3 },
  ]
  for (const m of modules) {
    await db.insert(schema.courseModules).values(m).onConflictDoNothing()
  }

  // Weeks (1 per module for simplicity)
  const weeks = [
    { id: ID.aiW1, moduleId: ID.aiMod1, title: 'Woche 1 — Grundlagen', orderIndex: 0 },
    { id: ID.aiW2, moduleId: ID.aiMod2, title: 'Woche 2 — Prompting', orderIndex: 0 },
    { id: ID.aiW3, moduleId: ID.aiMod3, title: 'Woche 3 — Workflows', orderIndex: 0 },
    { id: ID.aiW4, moduleId: ID.aiMod4, title: 'Woche 4 — E-Commerce', orderIndex: 0 },
    { id: ID.dsW1, moduleId: ID.dsMod1, title: 'Woche 1 — Marktanalyse', orderIndex: 0 },
    { id: ID.dsW2, moduleId: ID.dsMod2, title: 'Woche 2 — Sourcing', orderIndex: 0 },
    { id: ID.dsW3, moduleId: ID.dsMod3, title: 'Woche 3 — Shop', orderIndex: 0 },
    { id: ID.dsW4, moduleId: ID.dsMod4, title: 'Woche 4 — Marketing', orderIndex: 0 },
  ]
  for (const w of weeks) {
    await db.insert(schema.courseWeeks).values(w).onConflictDoNothing()
  }

  // Resources (2-3 per week)
  const resources = [
    // AI Woche 1
    { weekId: ID.aiW1, title: 'Was ist AI-Automation?', type: 'video', orderIndex: 0, duration: 900 },
    { weekId: ID.aiW1, title: 'Deine erste Automatisierung', type: 'video', orderIndex: 1, duration: 1200 },
    { weekId: ID.aiW1, title: 'Checkliste: Tools einrichten', type: 'pdf', orderIndex: 2 },
    // AI Woche 2
    { weekId: ID.aiW2, title: 'Prompt Engineering Basics', type: 'video', orderIndex: 0, duration: 1500 },
    { weekId: ID.aiW2, title: 'Fortgeschrittene Prompts', type: 'video', orderIndex: 1, duration: 1100 },
    // AI Woche 3
    { weekId: ID.aiW3, title: 'Make.com Setup', type: 'video', orderIndex: 0, duration: 1800 },
    { weekId: ID.aiW3, title: 'Zapier Workflows', type: 'video', orderIndex: 1, duration: 1400 },
    { weekId: ID.aiW3, title: 'Workflow-Vorlagen', type: 'pdf', orderIndex: 2 },
    // AI Woche 4
    { weekId: ID.aiW4, title: 'AI-Produkttexte generieren', type: 'video', orderIndex: 0, duration: 1200 },
    { weekId: ID.aiW4, title: 'Kundenservice mit AI', type: 'video', orderIndex: 1, duration: 900 },
    // DS Woche 1
    { weekId: ID.dsW1, title: 'EU-Markt verstehen', type: 'video', orderIndex: 0, duration: 1100 },
    { weekId: ID.dsW1, title: 'Nischen-Research Tools', type: 'video', orderIndex: 1, duration: 800 },
    { weekId: ID.dsW1, title: 'Nischen-Analyse Template', type: 'pdf', orderIndex: 2 },
    // DS Woche 2
    { weekId: ID.dsW2, title: 'EU-Lieferanten finden', type: 'video', orderIndex: 0, duration: 1600 },
    { weekId: ID.dsW2, title: 'Verhandlungstipps', type: 'video', orderIndex: 1, duration: 900 },
    // DS Woche 3
    { weekId: ID.dsW3, title: 'Shopify einrichten', type: 'video', orderIndex: 0, duration: 2400 },
    { weekId: ID.dsW3, title: 'Brand Design Guide', type: 'pdf', orderIndex: 1 },
    // DS Woche 4
    { weekId: ID.dsW4, title: 'Facebook Ads Basics', type: 'video', orderIndex: 0, duration: 1800 },
    { weekId: ID.dsW4, title: 'TikTok Ads Guide', type: 'video', orderIndex: 1, duration: 1500 },
    { weekId: ID.dsW4, title: 'Ad-Creatives Vorlagen', type: 'pdf', orderIndex: 2 },
  ]
  for (const r of resources) {
    await db.insert(schema.courseResources).values(r).onConflictDoNothing()
  }
  console.log(`  ✓ 2 courses, ${modules.length} modules, ${weeks.length} weeks, ${resources.length} resources`)

  // ─── 8. Entitlements (purchases) ───────────────────────────
  console.log('\n🎟️  Seeding entitlements...')
  const entitlementValues = [
    { customerUid: student1Uid, planId: ID.aiBusiness },    // Anna → AI Business
    { customerUid: student2Uid, planId: ID.dsFast },         // Tom → DS Fast
    { customerUid: student3Uid, planId: ID.tiktokPlan },     // Lisa → TikTok Creator
  ]
  for (const e of entitlementValues) {
    await db.insert(schema.entitlements).values(e).onConflictDoNothing()
  }
  console.log(`  ✓ ${entitlementValues.length} entitlements`)

  // ─── 9. Orders ──────────────────────────────────────────────
  console.log('💳 Seeding orders...')
  const orderValues = [
    { customerUid: student1Uid, totalCents: 100000, currency: 'EUR', status: 'paid', provider: 'stripe', providerRef: 'pi_seed_001' },
    { customerUid: student2Uid, totalCents: 20000, currency: 'EUR', status: 'paid', provider: 'stripe', providerRef: 'pi_seed_002' },
    { customerUid: student3Uid, totalCents: 7500, currency: 'EUR', status: 'paid', provider: 'paypal', providerRef: 'PAY_seed_003' },
  ]
  for (const o of orderValues) {
    await db.insert(schema.orders).values(o).onConflictDoNothing()
  }
  console.log(`  ✓ ${orderValues.length} orders`)

  // ─── 10. Sessions ───────────────────────────────────────────
  console.log('📅 Seeding sessions...')
  const nextMonday = new Date()
  nextMonday.setDate(nextMonday.getDate() + ((8 - nextMonday.getDay()) % 7 || 7))
  nextMonday.setHours(14, 0, 0, 0)

  const nextWednesday = new Date(nextMonday)
  nextWednesday.setDate(nextWednesday.getDate() + 2)

  await db.insert(schema.sessions).values([
    { customerUid: student1Uid, mentorUid, type: 'zoom', status: 'accepted', scheduledAt: nextMonday, meetingUrl: 'https://zoom.us/j/example1' },
    { customerUid: student1Uid, mentorUid, type: 'zoom', status: 'pending', scheduledAt: nextWednesday },
    { customerUid: student3Uid, mentorUid, type: 'discord', status: 'pending', scheduledAt: nextMonday, metadata: { creatorProgram: 'tiktok', callNumber: 1 } },
  ]).onConflictDoNothing()
  console.log('  ✓ 3 sessions (1 accepted, 2 pending)')

  // ─── 11. Tickets ────────────────────────────────────────────
  console.log('🎫 Seeding tickets...')
  const [ticket1] = await db.insert(schema.tickets).values({
    customerUid: student1Uid, category: 'kursfrage', subject: 'Modul 2 Video lädt nicht',
    status: 'offen', lastMessageAt: new Date(),
  }).returning()

  await db.insert(schema.ticketMessages).values([
    { ticketId: ticket1.id, authorUid: student1Uid, body: 'Hallo, das Video in Modul 2 "Fortgeschrittene Prompts" lädt bei mir nicht. Ich nutze Chrome auf macOS.' },
    { ticketId: ticket1.id, authorUid: adminUid, body: 'Danke für die Meldung! Wir schauen uns das an. Könntest du bitte deinen Cache leeren und es nochmal versuchen?' },
  ])

  const [ticket2] = await db.insert(schema.tickets).values({
    customerUid: student2Uid, category: 'hilfe', subject: 'Wie finde ich EU-Lieferanten?',
    status: 'in_bearbeitung', lastMessageAt: new Date(),
  }).returning()

  await db.insert(schema.ticketMessages).values({
    ticketId: ticket2.id, authorUid: student2Uid, body: 'Ich bin in Woche 2 und finde keine guten Lieferanten für meine Nische. Gibt es da Tipps?',
  })

  console.log('  ✓ 2 tickets with messages')

  // ─── 12. Community posts ────────────────────────────────────
  console.log('📝 Seeding community posts...')
  await db.insert(schema.communityPosts).values([
    { authorUid: adminUid, category: 'news', title: 'Willkommen bei University Ecom!', body: 'Wir freuen uns, euch auf unserer Plattform begrüßen zu dürfen. Hier findet ihr News, Updates und Erfolgsgeschichten.', publishedAt: new Date() },
    { authorUid: adminUid, category: 'updates', title: 'Neue Kursmodule verfügbar', body: 'Die Module 3 und 4 des AI-Kurses sind jetzt freigeschaltet. Viel Spaß beim Lernen!', publishedAt: new Date(Date.now() - 86400000) },
    { authorUid: adminUid, category: 'ankuendigungen', title: 'Live Q&A nächste Woche', body: 'Nächsten Mittwoch um 19:00 Uhr findet unser monatliches Live Q&A mit den Coaches statt. Tragt euch ein!', publishedAt: new Date(Date.now() - 2 * 86400000) },
    { authorUid: adminUid, category: 'erfolge', title: 'Anna hat ihren ersten AI-Workflow erstellt!', body: 'Herzlichen Glückwunsch an Anna, die innerhalb von 2 Wochen ihren ersten vollautomatischen E-Mail-Workflow aufgesetzt hat.', publishedAt: new Date(Date.now() - 3 * 86400000) },
  ]).onConflictDoNothing()
  console.log('  ✓ 4 community posts')

  // ─── 13. Notifications ──────────────────────────────────────
  console.log('🔔 Seeding notifications...')
  await db.insert(schema.notifications).values([
    { recipientUid: student1Uid, event: 'entitlement_granted', title: 'Zugang freigeschaltet', body: 'Dein AI-Business Plan wurde aktiviert.', link: '/student/kurse' },
    { recipientUid: student1Uid, event: 'appointment_created', title: 'Session geplant', body: `Deine nächste Session ist am ${nextMonday.toLocaleDateString('de-DE')}.`, link: '/student/termine' },
    { recipientUid: student2Uid, event: 'entitlement_granted', title: 'Zugang freigeschaltet', body: 'Dein Dropshipping-Fast Plan wurde aktiviert.', link: '/student/kurse' },
    { recipientUid: student3Uid, event: 'entitlement_granted', title: 'Creator Programm aktiviert', body: 'Dein TikTok Creator Programm wurde freigeschaltet.', link: '/student/creator' },
  ])
  console.log('  ✓ 4 notifications')

  // ─── 14. Affiliate link for student1 ───────────────────────
  console.log('🔗 Seeding affiliate link...')
  await db.insert(schema.affiliateLinks).values({
    customerUid: student1Uid, code: 'ANNA15', commissionRate: '0.1500',
  }).onConflictDoNothing()
  console.log('  ✓ Affiliate code ANNA15')

  // ─── Done ───────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('✅ Seed complete!\n')
  console.log('Test accounts:')
  console.log('┌────────────────────────────────────┬─────────────────────┬──────────────────┐')
  console.log('│ Email                              │ Password            │ Role             │')
  console.log('├────────────────────────────────────┼─────────────────────┼──────────────────┤')
  console.log('│ admin@university-ecom.de           │ Admin2026!Secure    │ Admin (all)      │')
  console.log('│ mentor@university-ecom.de          │ Mentor2026!Secure   │ Mentor           │')
  console.log('│ student1@test.de                   │ Student2026!        │ AI Business      │')
  console.log('│ student2@test.de                   │ Student2026!        │ DS Fast          │')
  console.log('│ creator@test.de                    │ Student2026!        │ TikTok Creator   │')
  console.log('└────────────────────────────────────┴─────────────────────┴──────────────────┘')
  console.log('\nAffiliate code: ANNA15 (student1@test.de)')
  console.log('Mentor availability: Mon-Fri 10:00-17:00')
  console.log('\n⚠️  Remember to enable TOTP MFA for admin user in Supabase dashboard.')

  await client.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
