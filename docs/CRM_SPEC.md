# CRM & Platform Spec — University Ecom

Status: planning doc for the next development phase
Audience: Claude Code (and any human dev)
Source: refined from the client Lastenheft (German), see [`LASTENHEFT.md`](./LASTENHEFT.md)
Companion analysis (categorized requirements + gaps not in Lastenheft): [`REQUIREMENTS_ANALYSIS.md`](./REQUIREMENTS_ANALYSIS.md)
Prerequisite reading: [`../CLAUDE.md`](../CLAUDE.md)

> **Heads-up**: the phase list below (1–10) covers the Lastenheft directly. `REQUIREMENTS_ANALYSIS.md` §24 defines additional phases (11–17) for DSGVO compliance, tax/invoicing, refunds/Widerruf, security hardening, video-provider migration, reliability, and compliance polish — most of these are **P0 and should be sequenced before Phase 2**, see §26 of that doc. Fold them in once the client has answered the open questions in §25.

The public marketing site is considered acceptable. **This spec focuses on the CRM/admin backbone**, plus the public-side features that the Lastenheft requires but are currently missing.

---

## 0. Gap matrix (current vs. target)

| # | Area | Today | Target | Priority |
|---|------|-------|--------|----------|
| 1 | Customer 360 (admin/benutzer) | List + filter UI on mock array | Real list, detail page, products owned, payments, sessions, internal notes, Discord roles, suspend/grant/revoke | **P0** |
| 2 | Internal admin notes | — | Notes per customer, admin-only, audit-logged | **P0** |
| 3 | Granular admin permissions | All admins = all access | 3 admins, per-module toggle (customers/products/payments/affiliate/tickets/videos/analytics) | **P0** |
| 4 | Tickets | No UI, partial schema | Full ticket system: categories, statuses, threads, customer + admin sides | **P0** |
| 5 | CRM analytics | Hardcoded mock stats | Real revenue, customers, conversion, tickets, affiliate, sales, sessions, creator data, time-series | **P0** |
| 6 | Notifications | Email only, ad-hoc | Unified events → in-app bell + email + Discord bot DM | **P1** |
| 7 | Upgrade pays difference | — | Fast → Business → Infinity, customer pays only delta | **P1** |
| 8 | Invoice PDFs | — | Auto-generated on order, downloadable from dashboard, billing address captured | **P1** |
| 9 | Discord integration | — | Auto role on purchase (Fast/Business/Infinity/TikTok/YouTube/Affiliate), lifetime, manual removal, bot DM bridge | **P1** |
| 10 | Sessions: customer accept/reject/propose alt | Admin can create | Customer can accept, reject, propose alternative; meeting types Zoom/Meet/Discord | **P1** |
| 11 | Creator auto-scheduling | — | After purchase: Call 1 = first Friday after, Call 2 = +1 month | **P1** |
| 12 | Creator briefing form | — | Briefing form with the 9 fields + optional file upload | **P1** |
| 13 | Giftcards | — | Buy → code → email → redeem at checkout → balance/status | **P2** |
| 14 | Certificates | — | Admin-issued PDF (name/course/date), dashboard download | **P2** |
| 15 | Affiliate leaderboard + payouts | Application + commission tracking | Leaderboard (username/rank/place, no real names), monthly top-3 reward, payout queue, 1st-of-month manual payout | **P2** |
| 16 | Community / News CMS | — | Admins create/edit/delete posts in News/Updates/Announcements/Erfolge | **P2** |
| 17 | Interview CMS | — | Admin upload videos, reorder, category | **P2** |
| 18 | Kundenerfolge slideshow | Static (assumed) | Admin-managed, 10+ entries, images/videos/revenue screenshots/social growth/testimonials | **P3** |
| 19 | PayPal | — | Checkout option | **P2** |
| 20 | Crypto payments (manual unlock) | — | Customer signals intent → admin verifies → grants access | **P3** |
| 21 | Livechat | — | Integrate (Crisp, Intercom, or Tawk.to) | **P3** |
| 22 | Video DRM-ish protection | URLs public | Signed URLs, login required, harder to download | **P2** |

Priorities: **P0** = unblocks daily admin operations; **P1** = revenue / customer experience; **P2** = full Lastenheft coverage; **P3** = nice-to-have.

---

## 1. Architecture summary

Read `CLAUDE.md §3` first. TL;DR:

```
Supabase project (Frankzfurt)
   ├── auth.users        ─── identity, passwords, MFA TOTP, password reset
   ├── Postgres (public) ─── everything else: customers, courses, enrollments,
   │                          sessions, orders, payments, tickets, affiliate,
   │                          notifications, audit_log, consent_log, ...
   ├── Storage           ─── invoices, briefings, kundenerfolge, community media
   └── Realtime          ─── notifications bell + admin ticket queue
   
Bunny Stream             ─── course/interview video (out of Supabase)
Lexoffice API            ─── GoBD-compliant invoicing (legal record)
Stripe + PayPal          ─── payments
Discord (via Railway bot)─── role automation + DM notifications
```

ORM: **Drizzle**. Migrations checked into `drizzle/`. Schema lives in `src/lib/server/db/schema/*.ts`. Drizzle connects directly to the Supabase Postgres connection string (NOT via PostgREST). The `@supabase/ssr` browser client is only used for auth and Realtime subscriptions.

---

## 2. Postgres schema sketch

Names are indicative; refine during implementation. All tables include `created_at timestamptz default now()`, `updated_at timestamptz`. Schema lives under `public.*`; Supabase Auth lives under `auth.*` (managed, do not migrate).

```sql
-- Identity extension (1:1 with auth.users)
customers (
  uid uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,         -- mirrored from auth.users.email for query convenience
  first_name text, last_name text,
  discord_username text, whatsapp text,
  status text not null default 'active',  -- active | suspended | deleted
  billing jsonb,                  -- {type:'private'|'company', address, country, city, phone, company_name?, vat_id?}
  discord_user_id text,           -- linked after OAuth, optional
  created_at timestamptz, updated_at timestamptz
);

admin_permissions (
  uid uuid primary key references customers(uid),
  perms jsonb not null            -- {customers:true, products:false, payments:true, affiliate:true, tickets:true, videos:false, analytics:true}
);

products (
  id uuid primary key,
  kind text not null,             -- 'course' | 'creator' | 'giftcard' | 'addon'
  slug text unique not null,      -- 'ai-kurs' | 'dropshipping' | 'tiktok-creator' | 'youtube-creator'
  title text not null,
  is_active boolean default true
);

plans (
  id uuid primary key,
  product_id uuid references products(id),
  code text not null,             -- 'fast' | 'business' | 'infinity' | 'tiktok' | 'youtube'
  price_cents integer not null,
  currency text default 'EUR',
  features jsonb,
  unique(product_id, code)
);

orders (
  id uuid primary key,
  customer_uid uuid references customers(uid),
  total_cents integer not null,
  currency text default 'EUR',
  status text not null,           -- 'pending' | 'paid' | 'refunded' | 'awaiting_crypto'
  provider text not null,         -- 'stripe' | 'paypal' | 'crypto'
  provider_ref text,
  giftcard_applied_cents integer default 0,
  metadata jsonb,
  created_at timestamptz
);

order_items (
  id uuid primary key,
  order_id uuid references orders(id) on delete cascade,
  plan_id uuid references plans(id),
  price_cents integer not null,
  is_upgrade boolean default false,
  upgrade_from_plan_id uuid references plans(id)
);

entitlements (
  id uuid primary key,
  customer_uid uuid references customers(uid),
  plan_id uuid references plans(id),
  source_order_id uuid references orders(id),
  granted_at timestamptz default now(),
  revoked_at timestamptz,
  unique(customer_uid, plan_id) where revoked_at is null
);

invoices (
  id uuid primary key,
  order_id uuid references orders(id),
  number text unique not null,    -- INV-2026-000123
  pdf_url text,                   -- in Supabase Storage 'invoices' bucket (signed URLs)
  issued_at timestamptz default now()
);

giftcards (
  id uuid primary key,
  code text unique not null,
  initial_cents integer not null,
  balance_cents integer not null,
  buyer_uid uuid references customers(uid),
  recipient_email text,
  status text default 'active',   -- active | redeemed | expired
  created_at timestamptz
);

certificates (
  id uuid primary key,
  customer_uid uuid references customers(uid),
  product_id uuid references products(id),
  issued_by_uid uuid references customers(uid),
  pdf_url text,
  issued_at timestamptz default now()
);

tickets (
  id uuid primary key,
  customer_uid uuid references customers(uid),
  category text not null,         -- support | hilfe | feedback | kursfrage | affiliate | creator | technisches_problem
  subject text not null,
  status text not null default 'offen',  -- offen | in_bearbeitung | geschlossen
  assignee_uid uuid references customers(uid),
  last_message_at timestamptz,
  created_at timestamptz
);

ticket_messages (
  id uuid primary key,
  ticket_id uuid references tickets(id) on delete cascade,
  author_uid uuid references customers(uid),
  body text not null,
  attachments jsonb,              -- [{url, name, size}]
  is_internal boolean default false,
  created_at timestamptz
);

admin_notes (
  id uuid primary key,
  customer_uid uuid references customers(uid),
  author_uid uuid references customers(uid),
  body text not null,
  created_at timestamptz
);

affiliate_links (
  id uuid primary key,
  customer_uid uuid references customers(uid) unique,
  code text unique not null,
  commission_rate numeric(5,4) default 0.15
);

affiliate_referrals (
  id uuid primary key,
  link_id uuid references affiliate_links(id),
  referred_customer_uid uuid references customers(uid),
  order_id uuid references orders(id),
  amount_cents integer,
  status text default 'pending',  -- pending | approved | paid | rejected
  created_at timestamptz
);

payouts (
  id uuid primary key,
  affiliate_uid uuid references customers(uid),
  amount_cents integer not null,
  status text default 'pending',  -- pending | paid
  paid_at timestamptz,
  notes text
);

notifications (
  id uuid primary key,
  recipient_uid uuid references customers(uid),
  event text not null,            -- 'message_new' | 'ticket_reply' | 'invoice_ready' | 'course_unlocked' | 'appointment_*'
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  channels jsonb,                 -- {bell:true, email:true, discord:true}
  created_at timestamptz
);

audit_log (
  id bigserial primary key,
  actor_uid uuid references customers(uid),
  action text not null,
  target_type text, target_id text,
  before jsonb, after jsonb,
  ip text, user_agent text,
  created_at timestamptz default now()
);

analytics_events (
  id bigserial primary key,
  customer_uid uuid references customers(uid),
  name text not null,             -- 'page_view' | 'checkout_started' | 'order_paid' | ...
  props jsonb,
  occurred_at timestamptz default now()
);
```

Add indexes liberally on `customer_uid`, `status`, `created_at`. Use partial unique indexes (e.g. one active entitlement per (customer, plan)).

---

## 3. Build phases & acceptance criteria

Each phase is a vertical slice. Don't start phase N+1 until N's acceptance criteria pass.

### Phase 1 — Foundation + Firebase removal (P0)

**Goal**: stand up Supabase (Auth + Postgres + Storage), remove all Firebase code, build customer 360. Combined with what was originally "Phase 0 — Migration" because there are no real users to preserve.

**Pre-flight (do once, before any code)**:
- Create Supabase project, region **EU Central (Frankfurt)**, plan: Free for dev.
- Copy `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `DATABASE_URL` (Connection string → URI mode) to `.env.local`. Add placeholders to `.env.example`.
- Enable email/password auth in Supabase dashboard. Enable TOTP MFA.
- Create Storage buckets (all private): `invoices`, `briefings`, `kundenerfolge`, `community-media`.

**Tasks**:

**Tear down Firebase**
1. Delete `src/lib/firebase/` (config, firestore, courses, seed, test, mentoring).
2. Delete `src/lib/auth/auth-context.tsx` AND `src/contexts/AuthContext.tsx` (consolidate into one Supabase-backed context in task 6).
3. Delete `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `storage.rules`.
4. Remove `firebase` and `firebase-admin` from `package.json`; run `npm install` to clean lockfile.
5. Strip `firebase`-related env vars from `.env.example`.

**Stand up Supabase + Drizzle**
6. Install: `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-orm`, `drizzle-kit`, `pg`, `postgres`.
7. Create `src/lib/supabase/client.ts` (browser client via `@supabase/ssr`) and `src/lib/supabase/server.ts` (server client). Set up the Next.js middleware (`middleware.ts`) for auth cookie refresh per Supabase's App Router guide.
8. Create `src/lib/server/db/index.ts` (Drizzle client using the direct Postgres URL) and `src/lib/server/db/schema/` (one file per logical area: `customers.ts`, `products.ts`, `courses.ts`, `commerce.ts`, `tickets.ts`, `audit.ts`, etc.).
9. Add `npm run db:generate / db:push / db:studio` scripts (drizzle-kit).
10. Define the **full** schema from §2 — not just the customer-360 subset. Include course content tables (`courses`, `course_modules`, `course_weeks`, `course_resources`) so the rest of the app can stop touching Firestore. Push to Supabase.

**Auth, middleware, and access control**
11. Build `src/lib/server/auth.ts` exporting `requireAuth()` and `requireAdmin(perm: keyof Permissions)`. Both verify the Supabase JWT from cookies, look up the customer in Postgres, and check `admin_permissions`.
12. New single Supabase-backed React context (`src/lib/auth/auth-provider.tsx`) replacing the two deleted contexts. Expose `useUser()`, `useCustomer()`, `signIn / signUp / signOut / resetPassword / verifyOtp`.
13. Wire registration form to `supabase.auth.signUp` + simultaneously insert `customers` row via a server action. Capture Discord username + WhatsApp here.
14. Wire login, password reset, MFA enrollment flows.

**Seed + reseed the existing dataset**
15. Port `scripts/setup-firebase.js` to `scripts/setup-supabase.ts`. Seed: 2 courses (AI, Dropshipping) with modules, the 6 plans (3 per course), 2 creator products, default `admin_settings`, default `email_templates`. Use Drizzle.
16. Delete the old `scripts/setup-firebase.js` and `scripts/test-firebase.js`.

**Refactor every API route that was Firestore-backed**
17. Walk the codebase: every `import { ... } from '@/lib/firebase/...'` → replace with Drizzle queries via `src/lib/server/db/queries/*.ts`. Likely 15–20 API routes affected.
18. Refactor `/api/webhooks/stripe` to write to Postgres (orders / order_items / entitlements) instead of Firestore. Keep Stripe signature verification.
19. Refactor `/api/student/*`, `/api/admin/*`, `/api/intake/*`, `/api/affiliate/*` similarly.

**Build customer 360 (original Phase 1 deliverable)**
20. Replace `src/app/admin/page.tsx` mock stats with real counts from Postgres (customers, active entitlements, open tickets, today's sessions).
21. Build `/admin/benutzer` list (server component, Postgres-backed, search by email/name/Discord).
22. Build `/admin/benutzer/[uid]` detail page with tabs: **Übersicht** (profile + status), **Produkte** (entitlements grant/revoke), **Zahlungen** (orders), **Sessions**, **Tickets**, **Notizen** (internal admin notes), **Discord** (linked id, current roles, sync button — stub if Phase 7 not built).
23. Implement grant/revoke entitlement server actions with `audit_log` writes.
24. Admin nav respects `admin_permissions` — hidden sections not rendered.

**Verify**
25. `npm run type-check && npm run lint && npm run build` all pass.
26. Manual smoke: register → login → MFA enroll → admin view → grant entitlement → audit log entry visible → log out → re-login → see entitlement in dashboard.
27. Grep the repo for `firebase` and `firestore` (case-insensitive). Zero hits in `src/`, `scripts/`, `package.json`.

**Acceptance**:
- No Firebase code remains anywhere (`grep -ri firebase src/ scripts/` returns nothing).
- All env vars for Firebase are gone from `.env.local` and `.env.example`; Supabase env vars are in.
- Drizzle Studio shows all core tables populated by seed.
- Login via Supabase Auth works; MFA TOTP enrollment works.
- Customer 360 acceptance from original Phase 1: admin can view customer, add internal note, grant "Dropshipping Fast" → audit log shows both actions; non-admin gets 403 on `/admin/**`; admin nav respects permissions.

### Phase 2 — Tickets (P0)

Tasks:
1. Schema: `tickets`, `ticket_messages` (already in §2).
2. Customer side: `/student/support` (list + new ticket form with category dropdown), `/student/support/[id]` (thread view).
3. Admin side: `/admin/tickets` (queue with filters by status/category/assignee), `/admin/tickets/[id]` (thread + assign + status change + internal-only messages).
4. Email on every reply (Resend template `ticket-reply`).
5. Realtime: ticket list in admin auto-refreshes (poll every 30 s is acceptable; SSE/Pusher is overkill for now).

**Acceptance**:
- Customer opens a ticket with category "Affiliate"; admin sees it in the queue within 30 s; admin replies; customer gets an email and sees the reply in the dashboard; both bell notifications appear (once phase 4 lands).

### Phase 3 — Payments hardened: upgrades, invoices, Postgres source-of-truth (P0/P1)

Tasks:
1. Move order creation fully to Postgres. Stripe webhook → upsert `orders`, `order_items`, `entitlements` in a single transaction. The student player reads enrollments directly from Postgres — no Firestore mirror.
2. **Upgrade-pays-difference**: when customer with `entitlements[product, fast]` buys `[product, business]`, server computes price minus the original `paid` amount for `fast`, creates a Stripe PaymentIntent for the delta, on success replaces the entitlement.
3. **Invoice PDF**: `@react-pdf/renderer` template (`InvoicePDF`). Generated on `order.status='paid'`, stored in Supabase Storage `invoices` bucket (private), signed URL saved on `invoices.pdf_url`. Customer downloads via a server-side endpoint that re-signs at request time (TTL 5 min).
4. Billing address form at checkout: private vs. company (`USt-ID` required for company).
5. PayPal: add `@paypal/react-paypal-js`, mirror Stripe's flow.
6. Crypto: customer selects → order goes to `awaiting_crypto` → admin queue at `/admin/payments` to mark paid → grants entitlement.

**Acceptance**:
- Buy AI Fast (200 €), then upgrade to AI Business (1000 €): customer pays 800 €. Entitlements correct. Invoice PDF generated for both orders.
- PayPal and Stripe both end in a `paid` order. Crypto ends in `awaiting_crypto` and an admin can flip it to `paid`.

### Phase 4 — Notifications (P1)

Tasks:
1. Schema: `notifications` table in Postgres. Enable RLS so a user only sees their own rows (`auth.uid() = recipient_uid`). Enable Realtime on this table in the Supabase dashboard.
2. Server helper `emitNotification(uid, event, payload)` that writes to Postgres (RLS-scoped Realtime fans out automatically), fires email via Resend (if user preference), and queues Discord DM (if bot online; fail-soft otherwise).
3. Bell component in dashboard header (real-time, unread count, click → mark read → link).
4. User preferences page `/student/profile/notifications` to toggle channels per event type.
5. Wire events: `message_new`, `ticket_reply`, `invoice_ready`, `course_unlocked`, `appointment_created`, `appointment_reminder`.

**Acceptance**: ticket reply (Phase 2) lights up bell + email + Discord DM ("Du hast eine neue Nachricht im University Ecom Dashboard."), respecting prefs.

### Phase 5 — Sessions & Creator Program (P1)

Tasks:
1. Customer accept / reject / propose-alternative flows on `/student/termine`.
2. Meeting type selector (Zoom / Meet / Discord) on session create.
3. Creator program logic: on purchase of TikTok/YouTube Creator, auto-create `Call 1` (first Friday after purchase) and `Call 2` (+1 month) — both as pending sessions requiring customer acceptance.
4. Creator dashboard page with sections: **Zoom Bereich**, **Briefing**, **Fortschritt**, **Termine**. Briefing form fields: Vorname, Nachname, Social Link, Nische, Follower, Views, Ziele, Probleme, Erfahrungen, optional file upload to Supabase Storage `briefings` bucket (private, signed URLs).

**Acceptance**: buy "TikTok Creator", see two auto-scheduled sessions in dashboard, fill briefing, admin sees briefing in customer 360 → Creator tab.

### Phase 6 — Affiliate full loop (P2)

Tasks:
1. Affiliate tables (`affiliate_links`, `affiliate_referrals`, `payouts`) already created in Phase 1. Build the application code on top.
2. Referral attribution at checkout (cookie or `?ref=` param → `affiliate_referrals.pending`).
3. On `order.paid`, flip referrals to `approved`, compute 15 % of net revenue.
4. **Leaderboard page** `/affiliate/leaderboard`: username + rank + placement, no real names. Monthly window.
5. Monthly job (1st of month) flagging top 3 + producing a payout report at `/admin/affiliates/payouts`. Admin marks paid manually.

**Acceptance**: referral cookie attributes purchase → commission row created → leaderboard updates → monthly payout report includes top 3.

### Phase 7 — Discord bot (P1/P2 — can run partly in parallel)

Tasks:
1. Discord OAuth flow on customer profile: link Discord account → store `discord_user_id`.
2. Bot service (separate small Node process or Vercel cron + serverless invocation; recommend a tiny long-running Fly.io / Railway worker since bot needs a gateway connection). Document the deploy step in `docs/DISCORD_DEPLOY.md`.
3. On `entitlement granted` event: bot assigns role(s): Fast / Business / Infinity / TikTok / YouTube / Affiliate. Roles **never auto-removed** (Lifetime). Admin can manually remove.
4. DM bridge: when our app fires a `notification` with channel `discord:true`, send DM "Du hast eine neue Nachricht im University Ecom Dashboard."

**Acceptance**: buy Business → role appears within 60 s → keeps role indefinitely.

### Phase 8 — CMS modules: Community, Interviews, Kundenerfolge, Giftcards, Certificates (P2)

Each is a small CRUD admin page backed by Postgres for both the admin (write) and public (read) sides. Realtime publishing via Supabase Realtime on the `community_posts` table if you want news to appear instantly without a refresh. Giftcards and Certificates also tie into Postgres tables in §2.

**Acceptance per submodule**:
- Community: admin posts News → it appears in `/community` instantly.
- Interview: admin uploads a video, sets order — it appears in `/interviews` in that order.
- Kundenerfolge: admin manages slides, public slideshow shows ≥ 10.
- Giftcard: I can buy one, recipient gets code by email, redeem at checkout reduces total.
- Certificate: admin issues from customer 360 → student downloads PDF.

### Phase 9 — Analytics dashboard (P0 but lighter version OK after Phase 1) (P1)

Tasks:
1. Time-series aggregations on Postgres: revenue/day, new customers/day, conversion (orders ÷ checkouts), open tickets, affiliate revenue, sessions/day.
2. Chart library: `recharts` (already common in this stack) or `tremor`. Pick one.
3. Date range picker, course/plan filters.
4. CSV export button per chart.

**Acceptance**: numbers match Postgres queries (verifiable from `npm run db:studio`).

### Phase 10 — Hardening (P2/P3)

- Video signed URLs + login-gated playback.
- Livechat widget (Crisp recommended for German market).
- Rate limiting on public APIs.
- Daily DB backup job.

---

## 4. Out of scope for now

- Mobile native apps.
- Multi-language. Keep German.
- Google / Apple / Magic-link auth (explicitly excluded by the client).

---

## 5. Decision log (resolved)

These decisions are locked. Claude Code should **not** re-ask — implement against them. If you believe one is wrong, raise it explicitly and wait for the user to confirm a change before deviating.

| # | Decision | Picked | Notes |
|---|---|---|---|
| 1 | Backend platform | **Supabase**, Frankfurt region | Postgres + Auth + Storage + Realtime in one project. Drizzle connects via direct Postgres URL; we ignore PostgREST. |
| 2 | ORM | **Drizzle** | Schema in `src/lib/server/db/schema/*.ts`, migrations in `drizzle/`. Drizzle queries from Next.js API routes / Server Actions only — never from the browser. |
| 3 | Mentor modeling | Same table as admins | `admin_permissions.perms.mentor = true`. Split into separate table only when non-admin mentors exist. |
| 4 | Video hosting | **Bunny Stream** | Signed playback URLs (TTL 5 min), HLS, dynamic watermark with viewer email. EU PoPs. Out of Supabase — videos are too big to live in Storage. |
| 5 | Invoicing / GoBD | **Lexoffice** via API | Lexoffice is the legal record. Mirror PDFs to Supabase Storage `invoices` bucket (private, signed URLs) as backup. Build customer-facing dashboard PDF separately if Lexoffice's template is too plain. |
| 6 | Cookie consent | Self-rolled component | Categories: `essential`, `analytics`, `marketing`. Block all non-essential scripts until consent. Store consent log in Postgres `consent_log` table. |
| 7 | Error tracking | **Sentry** | Free tier (5k errors/mo). Separate DSN per env (dev/preview/prod). |
| 8 | Uptime monitoring | **Better Stack** | Free tier, status page, Discord/Slack alerts. Health endpoint at `/api/health`. |
| 9 | Product analytics | **Plausible** (EU-hosted) | Cookie-free, no consent banner overhead. |
| 10 | Rate limiting | **Upstash Ratelimit** | Edge-friendly, drop-in. Apply to `/api/auth/*`, `/api/checkout/*`, `/api/admin/*`. |
| 11 | Admin 2FA | **Supabase Auth MFA (TOTP)** | Built into Supabase Auth. Mandatory for admin role; enforce in `requireAdmin()` middleware. |
| 12 | Animations | **Framer Motion** | Already in CLAUDE.md. |
| 13 | Charts | **Recharts** | Switch to Tremor only if Recharts gets painful. |
| 14 | Discord bot host | **Railway** | Long-running gateway connection. ~$5/mo. |
| 15 | Crypto processor | **Manual TX-hash verification for v1**; NOWPayments later | v1: customer pastes TX hash, admin verifies on block explorer, marks order paid. Chains: BTC, ETH, USDT-ERC20, USDT-TRC20. |
| 16 | Livechat | **Crisp** | EU-hosted, free tier viable, Pro €25/mo. Load only after marketing consent. |
| 17 | Email infra | **Resend** (already in stack) + SPF/DKIM/DMARC DNS records | Use Resend audiences for marketing emails. Separate template namespace for transactional vs marketing. |
| 18 | Affiliate cookie window | **60 days**, last-touch wins | Stored as `AFFILIATE_COOKIE_DAYS` env var. |
| 19 | Drip release | Per-product `release_strategy` JSON on `plans` | Defaults: Fast/Infinity = `all_unlocked`; Business = `first_then_mentor_gated`. |
| 20 | Kleinunternehmer | **No** — VAT-registered from day 1 | Avoids painful migration once Infinity sales push past €22k. |
| 21 | Widerruf waiver at checkout | **Yes**, checkbox required | German lawyer to sign off on exact wording before launch. |
| 22 | Refund policy | Within 14 d: full. After: none unless exceptional. Partial: admin discretion. Chargeback: auto-revoke. | Write into AGB. |
| 23 | Tax handling | **Stripe Tax** for VAT calc + reverse-charge | Validates USt-IdNr via VIES, applies destination VAT for B2C, reverse-charge for B2B EU. |
| 24 | Logging / structured logs | Vercel logs + **Axiom** (EU) | $25/mo Pro when free tier outgrown. |
| 25 | Plan upgrade direction | Forward only (Fast → Business → Infinity). | No downgrade with credit. Confirm in AGB. |
| 26 | Discord access | Deferred to Phase 7 | Need server owner to invite bot with `Manage Roles` + `Send Messages` when phase starts. |

---

## Annex A — Vendor accounts to create (in order)

Create these accounts as you reach each phase. Add the env vars to `.env.local` and `.env.example` (placeholders only in `.env.example`).

### Before Phase 1 (Foundation + Firebase removal)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Supabase](https://supabase.com) | Free → Pro €25/mo | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (direct Postgres URI) | Free for dev. Create a **separate Supabase project** for prod when you're ready to launch; the staging branch lives in the dev project. |
| [Sentry](https://sentry.io) | Free (5k errors/mo) | `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN` | Free |

**Supabase project setup checklist** (do once in the dashboard, before any code):
- Region: EU Central (Frankfurt) ← **critical for DSGVO**
- Auth → Providers: enable Email; disable everything else (Google/Apple/GitHub etc.)
- Auth → Email Templates: translate to German (signup confirm, password reset, magic link). Tone matches the rest of the site.
- Auth → MFA: enable TOTP
- Auth → URL Configuration: site URL + redirect URLs for both `localhost:3000` and your Vercel preview/prod domains
- Storage → create 4 buckets, all **private**: `invoices`, `briefings`, `kundenerfolge`, `community-media`. Default to admin-only RLS; signed URLs issued by your server.
- Database → enable `pgcrypto` extension (for `gen_random_uuid()`)
- Project Settings → API → take note of: Project URL, anon key, service-role key
- Project Settings → Database → take note of: connection string (URI mode, port 6543 = pooled, port 5432 = direct). Use the 6543 pooled URL for `DATABASE_URL` in serverless contexts.

### Before Phase 11 (DSGVO)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Plausible](https://plausible.io) | EU instance, Growth €9/mo | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | €9/mo |

### Before Phase 14 (Security)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Upstash](https://upstash.com) | Free → pay per request | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | ~Free |
| [Better Stack](https://betterstack.com) | Free (10 monitors) | n/a (configured in dashboard) | Free |

### Before Phase 12 (Tax & Invoicing)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Lexoffice](https://lexoffice.de) | Standard €16/mo | `LEXOFFICE_API_KEY`, `LEXOFFICE_ORG_ID` | €16/mo |
| Stripe Tax (in Stripe dashboard) | 0.5% per transaction | already covered by `STRIPE_*` | 0.5% |

### Before Phase 3 (Payments hardened)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [PayPal Developer](https://developer.paypal.com) | n/a | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` | per-tx fee |

### Before Phase 15 (Video provider)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Bunny Stream](https://bunny.net) | Pay-as-you-go | `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_API_KEY`, `BUNNY_STREAM_PULL_ZONE`, `BUNNY_STREAM_SIGNING_KEY` | ~$0.005/GB |

### Before Phase 7 (Discord)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Discord Developer Portal](https://discord.com/developers/applications) | Free | `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID`, role IDs (`DISCORD_ROLE_FAST`, `DISCORD_ROLE_BUSINESS`, etc.) | Free |
| [Railway](https://railway.app) | Hobby ~$5/mo | n/a (project-scoped) | $5/mo |

### Before Phase 10 (Hardening — Livechat)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [Crisp](https://crisp.chat) | Free → Pro €25/mo | `NEXT_PUBLIC_CRISP_WEBSITE_ID` | Free → €25/mo |

### After launch (deferred)

| Service | Plan | Env vars | Cost |
|---|---|---|---|
| [NOWPayments](https://nowpayments.io) | 0.5% fee | `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` | 0.5% |
| [Axiom](https://axiom.co) | Free → Pro $25/mo | `AXIOM_TOKEN`, `AXIOM_DATASET` | Free → $25/mo |

### Estimated monthly tooling spend

- **Pre-launch (Phases 1–14)**: ~€10–20 (Supabase Free until you hit the 500 MB DB / 50k MAU limit; Sentry/Better Stack/Upstash/Plausible all free or trivial; Lexoffice €16 when Phase 12 lands)
- **At launch (post-Phase 15)**: ~**€80–100** (Supabase Pro €25 + Lexoffice €16 + Crisp €25 + Railway $5 + Plausible €9 + first Bunny bills)
- **Scaling (10k MAU, 50h video catalog)**: ~**€180–280** (Supabase scales by per-MAU + storage, Sentry Team $26, Axiom Pro $25, Bunny scaling, Better Stack paid)

---

## Annex B — Decision change protocol

If during implementation a locked decision turns out to be wrong (e.g. Bunny's signed URLs don't support a feature you need, Lexoffice's API can't model some invoice scenario):

1. Stop work on the affected phase.
2. Write the issue + proposed alternative as a one-paragraph note at the bottom of this file under "## Annex C — Open change requests".
3. Wait for user confirmation before deviating.
4. Once approved, update the row in §5 and the affected Annex A entry.
