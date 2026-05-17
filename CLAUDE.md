# CLAUDE.md — University Ecom

You are working on **University Ecom**, a premium course + CRM + community platform (German market, inspired by TRW). This file is your standing brief. Read it at the start of every session before editing code.

For the full prioritized work plan, see [`docs/CRM_SPEC.md`](./docs/CRM_SPEC.md). For the original client requirements, see [`docs/LASTENHEFT.md`](./docs/LASTENHEFT.md) (the source-of-truth in German). For a categorized breakdown of every requirement plus the gaps the client didn't think about (DSGVO, GoBD, Widerruf, security, video infra, etc.), see [`docs/REQUIREMENTS_ANALYSIS.md`](./docs/REQUIREMENTS_ANALYSIS.md). **Read all three before starting Phase 1.**

---

## 1. Product in one paragraph

University Ecom is **not** a classic course site. It bundles: a course platform (AI-Kurs, Dropshipping-Kurs, each with Fast / Business / Infinity plans), creator programs (TikTok 75 €, YouTube 100 €), a **CRM + admin CMS** for 3 admins with granular permissions, a customer dashboard, an affiliate system (15 % commission), giftcards, a ticket system, a community/news area, an interview/video academy, payments (Stripe + PayPal + Crypto), and Discord role automation. Design: **black + royal gold**, chessboard aesthetic, premium look, modern animations, German UI.

## 2. Current state (May 2026)

**Stack already in place** (do not change without asking):

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives in `src/components/ui`)
- Stripe (`stripe`, `@stripe/react-stripe-js`)
- Resend (`resend`, `@react-email/render`) for transactional email
- `@react-pdf/renderer` (installed, not yet used)
- Deploy target: Vercel

> **2026-05-17 — Firebase deprecation.** The original prototype used Firebase Auth + Firestore + Firebase Storage. **All of this is being removed in Phase 1.** The locked replacement is **Supabase** (EU/Frankfurt). Do not write any new code against Firebase. If you see lingering Firebase imports (`firebase`, `firebase-admin`, `lib/firebase/*`, `firestore.rules`, `firebase.json`), delete them as part of the relevant Phase 1 task.

**Locked vendor stack** (full list and account-creation order in [`docs/CRM_SPEC.md`](./docs/CRM_SPEC.md) §5 Decision log + Annex A — do not re-evaluate without raising it explicitly):

- **Backend**: **Supabase** (Frankfurt region) — provides Postgres, Auth (email + password + TOTP MFA), Storage, Realtime. One vendor, one bill, EU data residency.
- **ORM**: **Drizzle** — connects directly to Supabase Postgres connection string. Ignore PostgREST.
- **Invoicing / GoBD**: Lexoffice API (legal record); render dashboard PDF separately with `@react-pdf/renderer`
- **Tax**: Stripe Tax (VAT calc, USt-IdNr validation via VIES, reverse-charge for B2B EU)
- **Video**: Bunny Stream (signed URLs, HLS, dynamic watermark)
- **Errors**: Sentry · **Uptime**: Better Stack · **Logs**: Axiom · **Analytics**: Plausible (EU)
- **Rate limiting**: Upstash Ratelimit · **2FA**: Supabase Auth MFA (TOTP) for admins
- **Animations**: Framer Motion · **Charts**: Recharts
- **Discord bot host**: Railway · **Crypto**: manual TX-hash verify in v1, NOWPayments later
- **Livechat**: Crisp (EU) · **Cookie consent**: self-rolled component (categories: essential / analytics / marketing)
- **Kleinunternehmer**: No — VAT-registered from day 1. **Refunds**: 14-day Widerruf with explicit waiver checkbox at checkout; no refunds after unless exceptional.

**What's roughly working** (note: was built on Firebase, all being migrated to Supabase in Phase 1)

- Public marketing pages (home, courses, pricing, about, interviews, reviews, creator programs, legal).
- Auth (register / login / reset) with the required fields (Vorname, Nachname, E-Mail, Passwort, Discord, WhatsApp) — **currently Firebase Auth, replaced by Supabase Auth in Phase 1**.
- Student dashboard, course player, progress, profile, book-session — **currently Firestore-backed, replaced by Supabase Postgres in Phase 1**.
- Stripe checkout + webhook → Firestore enrollment — **webhook target switches to Supabase Postgres in Phase 1**.
- Admin pages exist as **skeletons** for: `benutzer`, `courses`, `termine`, `availability`, `affiliates`, `intake`. ~40 % wired to Firestore, 60 % mock data — all migrating in Phase 1.

**What's missing / weakest** (full breakdown in `docs/CRM_SPEC.md`)

- Real **customer 360 view** (profile, products owned, payments, sessions, internal notes, Discord roles).
- **Tickets** system (UI + admin queue).
- **CRM analytics** dashboard with real Postgres aggregations.
- **Notifications** (in-app bell + email + Discord bot) with event fan-out.
- **Giftcards**, **certificates**, **invoice PDFs**.
- **PayPal** and **Crypto** payment paths.
- **Upgrade pays difference** logic (Fast → Business pays delta).
- **Discord bot** integration (role auto-assignment, DM bridge).
- **Community / Interviews / Kundenerfolge CMS** (admin upload + ordering).
- **Granular admin permissions** for the 3 admins.

## 3. Data architecture — **single source of truth**

**Supabase Postgres is the only database.** Everything — auth, customers, course content, enrollments, sessions, payments, tickets, notifications, audit log — lives in one Postgres instance hosted in Frankfurt. Files (invoice PDFs, briefing uploads, Kundenerfolge media) live in Supabase Storage in the same project. Video stays out (Bunny Stream owns video).

**Layout**

- **Supabase Auth** → identity & passwords. Lives in the `auth.users` table managed by Supabase. The `auth.users.id` UUID is the canonical user id.
- **Public schema (your tables, managed by Drizzle)** → `customers` (1:1 with `auth.users` via `customers.uid = auth.users.id`), `admin_permissions`, `products`, `plans`, `entitlements`, `orders`, `order_items`, `invoices`, `payments`, `courses`, `course_modules`, `course_weeks`, `course_resources`, `enrollments`, `module_progress`, `sessions`, `availability`, `tickets`, `ticket_messages`, `notifications`, `admin_notes`, `audit_log`, `giftcards`, `certificates`, `affiliate_links`, `affiliate_referrals`, `payouts`, `community_posts`, `interviews`, `kundenerfolge`, `consent_log`, `analytics_events`. Full schema in [`docs/CRM_SPEC.md`](./docs/CRM_SPEC.md) §2.
- **Supabase Storage buckets** → `invoices` (private, signed URLs), `briefings` (private, signed URLs), `kundenerfolge` (private, signed URLs), `community-media` (private, signed URLs). No `public` buckets — every asset goes through a server-side signing endpoint.
- **Supabase Realtime** → for the in-app notifications bell (`notifications` table) and the admin ticket queue. Subscribe via the client SDK from `"use client"` components; gate via Postgres RLS so users only see their own rows.

**Why this isn't using PostgREST or RLS-as-API**: we use **Drizzle from Next.js API routes and Server Actions**. We do not let the client query Postgres directly. RLS is enabled on tables exposed via Realtime (notifications, tickets) so subscriptions are scoped; everything else is gated at the API layer by `requireAuth()` / `requireAdmin(perm)` middleware that verifies a Supabase JWT.

**Server-side Supabase client**: use `@supabase/ssr` for the App Router cookie/JWT plumbing. Drizzle connects via the direct Postgres connection string (not the Supabase REST URL).

**No more "sync to Firestore" rule.** One write, one source of truth.

## 4. Design system

- **Palette**: black background (`#0a0a0a`–`#111`), royal gold accent (`#D4AF37` / `#F1C232`), white text, muted gray for secondary.
- **Aesthetic**: chessboard pattern motifs, horse imagery in hero backgrounds, premium feel.
- **Buttons**: default gray; hover/active = royal gold glow.
- **Animations**: subtle, modern. Prefer `framer-motion` (add it if needed) over CSS-only when sequencing or scroll-linked.
- **Language**: UI strings in **German**. Use a constants file or i18n if you find yourself duplicating strings.
- **Components**: extend `src/components/ui/*` (shadcn). Never re-roll a Button, Card, or Input — wrap the shadcn one.

## 5. Conventions

- **Routes**: App Router. Public pages directly under `src/app/`. Student app under `src/app/student/`. Admin under `src/app/admin/`. API routes under `src/app/api/`.
- **Server-only code** (Drizzle client, Supabase service-role client, secrets) lives under `src/lib/server/` and is imported only from Route Handlers / Server Components / Server Actions. Never import it from a `"use client"` file.
- **Client Supabase access**: only via `@supabase/ssr` browser client created in `src/lib/supabase/client.ts`. Use it for auth (sign in/up/reset) and Realtime subscriptions only — never for reading business data.
- **Types**: TypeScript strict. Shared types in `src/lib/types/`. Drizzle schema generates types — use those for DB rows, don't hand-roll. Supabase auth types from `@supabase/supabase-js`.
- **Auth on admin routes**: every `src/app/admin/**` page and `src/app/api/admin/**` route MUST go through `requireAdmin(perm: keyof Permissions)` from `src/lib/server/auth.ts`, which verifies the Supabase JWT and checks `admin_permissions.perms[perm] === true`. No exceptions.
- **Auth on student routes**: `src/app/student/**` and `src/app/api/student/**` go through `requireAuth()` from the same file.
- **Mock data**: any new admin page must hit real APIs. If the API isn't ready, build the API first. Do not ship another mock-array page.
- **Validation**: Zod schemas at the route boundary, both request and response. Already in deps.
- **Emails**: build with `@react-email/render`, send via Resend. Templates live in `src/lib/email/templates/`.
- **PDFs** (invoices, certificates): `@react-pdf/renderer`, generated server-side on demand, signed URL or streamed.
- **Money**: store as integer cents in Postgres. Display via a single `formatEuro()` helper in `src/lib/format.ts`.
- **Dates**: store as `timestamptz` in Postgres; serialize as ISO strings over the wire; `date-fns` for formatting.
- **Logs / audit**: every admin write action (grant access, revoke product, change price, suspend user, manual crypto unlock) inserts a row in `audit_log` with actor uid, target, action, before/after JSON.

## 6. Operating rules for Claude Code

1. **Read `docs/CRM_SPEC.md` before starting any task.** It defines phases, priorities, and acceptance criteria.
2. **Ask before scope creep.** If a task implies touching the public marketing site, confirm first — the user has flagged that the public site is mostly fine.
3. **One vertical slice at a time.** Prefer "ticket system end-to-end (schema → API → admin UI → customer UI → notifications)" over "schema for everything, then APIs for everything".
4. **Always start a feature by**:
   a. defining the Postgres schema (Drizzle migration),
   b. writing API route handlers with Zod,
   c. then building the UI against the live API.
5. **Test acceptance** for each phase using the criteria in `docs/CRM_SPEC.md`. Don't mark a phase done until those pass.
6. **Don't introduce new top-level dependencies** without noting why in the PR description / chat. Specifically: don't add a second ORM, second UI library, or alternative payment SDK.
7. **Secrets**: read from `.env.local` only via `process.env`. Update `.env.example` whenever you add a new var. Never log secrets.
8. **German strings**: keep them German. If you need to add UI text, match the existing tone (direct, premium, no fluff).
9. **Clean up the doc graveyard**: the project root currently has 30+ ad-hoc `*.md` files (COURSE_*, FIREBASE_*, IMPLEMENTATION_*, etc.). When you touch a related feature, move the still-relevant content into `docs/` and delete the rest. Do not create more root-level markdown files.

## 7. Commands

```bash
npm run dev          # local dev
npm run build        # production build (run before declaring a phase done)
npm run type-check   # tsc --noEmit, must pass
npm run lint         # eslint, must pass
```

After introducing Drizzle:

```bash
npm run db:generate  # generate migration from schema
npm run db:push      # apply migration to Postgres
npm run db:studio    # Drizzle Studio
```

## 8. Definition of Done (every task)

- TypeScript compiles (`npm run type-check`).
- Lint passes (`npm run lint`).
- Build passes (`npm run build`).
- Admin routes are gated behind admin auth + permission check.
- New env vars are in `.env.example`.
- New schema has a checked-in Drizzle migration.
- Acceptance criteria from `docs/CRM_SPEC.md` for the phase are demonstrably met (describe in the PR / chat).
- Audit-log row written for every admin mutation.
