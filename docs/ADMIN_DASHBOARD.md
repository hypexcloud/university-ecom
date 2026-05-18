# Admin & Mentor Dashboard — Information Architecture & Spec

Source-of-truth for everything the admin (and mentor variant) sees inside the CRM. Structures the Lastenheft "Admin Funktionen" requirements at the page/route level, fills the gaps the client didn't think about, and defines the granular-permission model.

Companion docs:
- [`LASTENHEFT.md`](./LASTENHEFT.md) — original client requirements
- [`CRM_SPEC.md`](./CRM_SPEC.md) — phase plan and Postgres schema
- [`REQUIREMENTS_ANALYSIS.md`](./REQUIREMENTS_ANALYSIS.md) — gap catalog
- [`STUDENT_DASHBOARD.md`](./STUDENT_DASHBOARD.md) — student-facing counterpart

Use this doc when building any page under `src/app/admin/**`.

---

## 0. How to read this doc

Each page section follows the same template:

```
### Route
- Route: /admin/...
- Phase: in CRM_SPEC.md
- Permission required: admin_permissions.perms.<key>
- Contents: what the admin sees
- Acceptance: pass/fail tests for "done"
- Audit: which actions write to audit_log
```

**UI language is German**, same tone as the student dashboard (direct, premium, no fluff).

**All admin routes** go through `requireAdmin(perm: keyof Permissions)` from `src/lib/server/auth.ts`. Without the matching permission, the route returns 403 and the sidebar item is not rendered.

---

## 1. Permission model

Per Lastenheft: "3 Admins, Rechte vollständig konfigurierbar und individuell aktivierbar / deaktivierbar." Implemented as a JSONB column on `admin_permissions.perms`:

```ts
type Permissions = {
  // Core admin areas (from Lastenheft)
  customers:        boolean   // /admin/benutzer
  products:         boolean   // /admin/produkte
  courses:          boolean   // /admin/kurse
  payments:         boolean   // /admin/zahlungen
  affiliate:        boolean   // /admin/affiliate
  tickets:          boolean   // /admin/tickets
  videos:           boolean   // /admin/interviews + course videos
  analytics:        boolean   // /admin/analytics
  
  // Operational roles
  mentor:           boolean   // assigned sessions; lighter view
  community_cms:    boolean   // /admin/community
  kundenerfolge:    boolean   // /admin/kundenerfolge
  certificates:     boolean   // /admin/zertifikate (issue/revoke)
  giftcards:        boolean   // /admin/giftcards
  
  // Power actions
  super_admin:      boolean   // manage other admins + system settings
  refunds:          boolean   // approve refund requests
  crypto_unlock:    boolean   // approve manual crypto orders
  impersonate:      boolean   // "Login as user" capability
  bulk_ops:         boolean   // bulk grant/revoke/email
}
```

**Recommended default permission sets** (seed three admins this way at launch):

| Admin profile | Perms granted |
|---|---|
| **Owner** (you) | `super_admin: true` plus every other perm `true` |
| **Operator** (day-to-day support + finance) | `customers, payments, tickets, affiliate, refunds, crypto_unlock, giftcards, certificates, community_cms` |
| **Mentor-only** | `mentor: true`, everything else `false` |

The `super_admin` flag is the only perm that can grant/revoke other admins' perms. Without it, an admin cannot escalate themselves or others.

**Mentors as admins**: per locked decision in `CRM_SPEC.md §5`, mentor is just a perm flag on the admin table. A "mentor-only" admin sees a narrower nav (only sessions/customers assigned to them) but uses the same `/admin/**` shell. No separate route tree.

---

## 2. Sitemap

```
/admin
├── /                                Dashboard home (KPIs scoped by perms)
│
├── /benutzer                        [customers] perm
│   ├── /                            list + search + filters + segments
│   └── /[uid]                       customer 360 with 8 tabs (see §4.2)
│
├── /produkte                        [products] perm
│   ├── /                            product list
│   ├── /[slug]                      edit product + plans
│   └── /neu                         create product
│
├── /kurse                           [courses] perm (overlaps products)
│   ├── /                            course list
│   ├── /[courseId]                  course editor (weeks, modules, resources)
│   ├── /[courseId]/modul/[moduleId] module editor (video upload, quiz, resources)
│   └── /neu                         create course
│
├── /zahlungen                       [payments] perm
│   ├── /                            order list
│   ├── /[orderId]                   order detail
│   ├── /refunds                     refund request queue [refunds]
│   └── /crypto                      manual crypto unlock queue [crypto_unlock]
│
├── /rechnungen                      [payments] perm
│   ├── /                            invoice list (Lexoffice sync status)
│   └── /[invoiceId]                 invoice detail
│
├── /affiliate                       [affiliate] perm
│   ├── /                            overview KPIs
│   ├── /partner                     affiliate list + application queue
│   ├── /payouts                     monthly payout queue (1st of month)
│   └── /leaderboard                 internal full view (with real names — admin only)
│
├── /tickets                         [tickets] perm
│   ├── /                            queue (filters: status / category / assignee / SLA)
│   ├── /assigned-to-me              my tickets
│   └── /[ticketId]                  ticket thread (with internal messages)
│
├── /termine                         [customers] OR [mentor] perm
│   ├── /                            calendar (all sessions OR my-only for mentor)
│   ├── /[sessionId]                 session detail + admin actions
│   └── /availability                mentor availability editor
│
├── /creator                         [customers] perm OR [mentor] for own
│   ├── /                            creator customers list
│   ├── /briefings                   briefing review queue
│   └── /[customerId]                creator progress detail + comments
│
├── /community                       [community_cms] perm
│   ├── /                            post list
│   ├── /neu                         create post (scheduled publishing)
│   └── /[postId]                    edit / delete post
│
├── /interviews                      [videos] perm
│   ├── /                            interview video list
│   ├── /neu                         upload (Bunny Stream)
│   └── /[videoId]                   edit (title, category, order)
│
├── /kundenerfolge                   [kundenerfolge] perm
│   ├── /                            success story slides list
│   ├── /neu                         add slide
│   └── /[slideId]                   edit + consent record link
│
├── /giftcards                       [giftcards] perm
│   ├── /                            issued giftcards list
│   ├── /neu                         issue manually
│   └── /[code]                      giftcard detail + transaction history
│
├── /zertifikate                     [certificates] perm
│   ├── /                            issued certificates list
│   ├── /neu                         issue (select customer + course + date)
│   └── /[certId]                    detail + revoke option
│
├── /analytics                       [analytics] perm
│   ├── /                            overview dashboard
│   ├── /umsatz                      revenue deep-dive
│   ├── /kunden                      customer/cohort analytics
│   ├── /conversion                  funnel analysis
│   ├── /tickets                     support KPIs (SLA, CSAT)
│   ├── /affiliate                   affiliate program ROI
│   ├── /creator                     creator program metrics
│   └── /export                      CSV/Excel export builder
│
├── /benachrichtigungen              [super_admin] perm
│   ├── /                            outbound system announcement composer (banner)
│   └── /broadcasts                  history of past broadcasts
│
├── /audit                           [super_admin] perm
│   └── /                            audit log viewer + filters
│
├── /einstellungen                   [super_admin] perm
│   ├── /                            general settings
│   ├── /admins                      manage admin accounts + permissions
│   ├── /admins/neu                  invite new admin
│   ├── /admins/[uid]                edit admin perms + suspend
│   ├── /email-templates             template editor (Resend + DE/EN)
│   ├── /maintenance                 maintenance mode toggle
│   ├── /feature-flags               feature flag controls
│   ├── /integrations
│   │   ├── /stripe                  Stripe Tax + webhook config
│   │   ├── /paypal                  PayPal API + webhook
│   │   ├── /lexoffice               Lexoffice API key + org
│   │   ├── /bunny                   Bunny Stream library + signing key
│   │   ├── /discord                 Discord bot status + role mapping
│   │   ├── /resend                  Resend domain + DKIM status
│   │   └── /crisp                   Crisp website ID
│   └── /legal
│       ├── /sub-processors          sub-processor registry (DSGVO)
│       ├── /dpa                     uploaded DPAs library
│       └── /consent-log             search/export consent records
│
└── /profil                          personal admin profile + 2FA
```

---

## 3. Global shell

Same `<DashboardShell>` pattern as student but with admin-specific top bar. Lives in `src/app/admin/layout.tsx`.

- **Top bar**: logo · global search (jump to customer / order / ticket / invoice by ID or email) · notifications bell · "Logged in as ADMIN" badge with avatar dropdown (Profil / Abmelden)
- **Sidebar**: nav items per §1 sitemap, filtered by perms (see §4.0 below). Section dividers between business areas.
- **Main content**: page body, breadcrumbs at top
- **Status strip** (bottom): connection health indicators (Postgres ✓ · Stripe ✓ · Lexoffice ✓ · Bunny ✓ · Discord bot ✓). Red dot = degraded.

Shared admin components (build once, reuse):

| Component | Path | Used by |
|---|---|---|
| `<DataTable>` | `src/components/admin/data-table.tsx` | every list page |
| `<FilterBar>` | `src/components/admin/filter-bar.tsx` | every list page |
| `<CustomerHeader>` | `src/components/admin/customer-header.tsx` | every customer-scoped page |
| `<EntitlementGrid>` | `src/components/admin/entitlement-grid.tsx` | customer detail |
| `<AuditTrail>` | `src/components/admin/audit-trail.tsx` | customer detail, settings |
| `<KpiCard>` | `src/components/admin/kpi-card.tsx` | dashboard home, analytics |
| `<TimeSeriesChart>` | `src/components/admin/time-series-chart.tsx` | analytics |
| `<StatusBadge>` | `src/components/admin/status-badge.tsx` | every list |
| `<ConfirmDangerousAction>` | `src/components/admin/confirm-dangerous.tsx` | revoke / suspend / refund / delete |
| `<ImpersonateButton>` | `src/components/admin/impersonate-button.tsx` | customer header |

---

## 4. Pages

### 4.0 Sidebar visibility rules

The sidebar renders only sections the admin has at least one matching perm for. The exact mapping:

| Section | Required perm (any of) |
|---|---|
| Übersicht | always |
| Benutzer | `customers` |
| Produkte | `products` |
| Kurse | `courses` OR `products` |
| Zahlungen | `payments` |
| Rechnungen | `payments` |
| Affiliate | `affiliate` |
| Tickets | `tickets` |
| Termine | `customers` OR `mentor` |
| Creator | `customers` OR `mentor` |
| Community | `community_cms` |
| Interviews | `videos` |
| Kundenerfolge | `kundenerfolge` |
| Giftcards | `giftcards` |
| Zertifikate | `certificates` |
| Analytics | `analytics` |
| Benachrichtigungen | `super_admin` |
| Audit | `super_admin` |
| Einstellungen | `super_admin` |
| Profil | always |

A mentor-only admin (`{ mentor: true, ...all others false }`) sees only: Übersicht, Termine (filtered to own), Creator (filtered to own), Profil.

---

### 4.1 Übersicht (admin dashboard home)

- **Route**: `/admin`
- **Phase**: 1 (skeleton with real counts from Postgres)
- **Permission**: always

Tile grid scoped to admin's perms. Each tile shows live data via Postgres aggregations:

**Top KPI row** (4 `<KpiCard>` tiles):
- Umsatz heute / dieser Monat
- Neue Kunden (24h / 30d)
- Offene Tickets (mit SLA-Warnungen)
- Heutige Sessions / Termine

**Mid grid** (perm-scoped):

| Tile | Shown if | Content |
|---|---|---|
| Heutige Termine | `mentor` OR `customers` | List of today's sessions with quick-join button |
| Offene Tickets (kategorisiert) | `tickets` | Stacked bar: count per category |
| Wartende Refund-Anfragen | `refunds` | Count + "Zur Warteschlange" link |
| Krypto-Bestellungen wartend | `crypto_unlock` | Count + link |
| Briefings zur Freigabe | `customers` OR `mentor` | List of creator briefings in "Eingereicht" status |
| Affiliate-Anwendungen | `affiliate` | Pending count + link |
| Auszahlungen fällig (1. nächsten Monat) | `affiliate` | Total amount + count |
| Letzte Admin-Aktionen | `super_admin` | Last 10 audit_log rows |
| System-Status | `super_admin` | Sentry error count last hour + uptime |

**Recent activity feed** (right column): admin-scoped activity stream (other admins' actions, customer registrations, refund requests). Pulled from `audit_log` and `analytics_events`.

**Acceptance**:
- Every tile pulls real Postgres data — no mocks
- Tiles render only if matching perm is set
- Mentor-only admin sees only `Termine`, `Briefings`, recent personal activity
- Page loads under 1s with 10k customers in DB

**Audit**: page view itself not audited; tile click-throughs follow target route's rules.

---

### 4.2 Benutzer (customer 360)

#### 4.2a — List view

- **Route**: `/admin/benutzer`
- **Phase**: 1
- **Permission**: `customers`

`<DataTable>` columns: Avatar · Name · E-Mail · Discord · Lifecycle-Stage · Produkte-Count · Status (active/suspended/deleted) · Letzter Login · Aktionen.

`<FilterBar>` chips:
- Search: email, name, Discord, WhatsApp, customer UID, phone, order ID
- Status filter: active / suspended / deleted
- Lifecycle stage: Lead / Customer / Power user / Inactive / Churned (per `REQUIREMENTS_ANALYSIS.md §2`)
- Plan filter: Fast / Business / Infinity / TikTok / YouTube / Affiliate
- Country (from billing address)
- Tags (multi-select from admin-defined tags)
- Created date range
- Sort: newest / oldest / last login / lifetime value

**Saved filter views** (per `REQUIREMENTS_ANALYSIS.md §2 [RECOMMENDED]`):
- "Alle Business-Kunden in DACH"
- "Offene Tickets > 48h"
- "Affiliate Empfehlungen letzte 30 Tage"
- Admin can save current filter combo with a name

**Bulk actions** (require `bulk_ops` perm, checkbox column):
- Bulk email (select recipients → opens compose dialog using a Resend template)
- Bulk tag (add/remove tag from selection)
- Bulk grant entitlement (e.g. "give bonus module to selected")
- Bulk Discord role sync
- CSV export of selection

**Acceptance**:
- Search returns first 50 results in < 500ms with 10k customers
- All filter combinations work (test the 4-filter combo)
- Saved filters persist per admin in DB
- Bulk action shows confirmation dialog with count + dry-run preview before commit
- Bulk action writes one `audit_log` row per affected customer

**Audit**: bulk operations (tag, grant, email, role sync).

#### 4.2b — Customer detail

- **Route**: `/admin/benutzer/[uid]`
- **Phase**: 1 (basic tabs) → expanded across all later phases
- **Permission**: `customers`

`<CustomerHeader>` (sticky, top of every tab):
- Avatar · Name · E-Mail · UID (copy button) · `<StatusBadge>` (Aktiv / Gesperrt / Gelöscht)
- Lifecycle stage chip
- Tags (editable inline)
- Action row: `<ImpersonateButton>` (if `impersonate` perm) · Sperren / Entsperren · Konto löschen
- Quick stats strip: Mitglied seit · LTV · Produkte (count) · Offene Tickets (count)

**Tabs** (each its own sub-route for shareable links):

##### Tab 1: Übersicht — `/admin/benutzer/[uid]/uebersicht` (default)

- Profilkarte (Vorname, Nachname, E-Mail, Discord, WhatsApp, Sprache)
- Adresskarte (Privat oder Firma + alle Felder, USt-ID validation status)
- Lifecycle-Timeline (visual): Lead → First Purchase → Active → … with dates
- Letzte 10 Aktivitäten (from `analytics_events`)

##### Tab 2: Produkte — `/admin/benutzer/[uid]/produkte`

- `<EntitlementGrid>` showing every entitlement: product · plan · since · status (active / revoked) · source order (link)
- Per row actions: Entziehen (revoke) — requires confirmation, writes `audit_log`
- "Produkt manuell gewähren" button → modal: pick product + plan + reason (free text, mandatory) → grants entitlement + writes `audit_log`
- Upgrade history visualized as breadcrumb chain: Fast (200€) → Business (+800€) → Infinity (+1500€)

##### Tab 3: Zahlungen — `/admin/benutzer/[uid]/zahlungen`

- All orders + payments + invoices for this customer
- Columns: Datum · Order-ID · Produkte · Betrag · Provider (Stripe/PayPal/Crypto) · Status · Rechnung (PDF link) · Aktionen
- Per row: "Rückerstattung initiieren" button → opens refund flow (requires `refunds` perm)
- Aggregate stats: LTV · refund rate · pending amount · giftcard credits used

##### Tab 4: Sessions — `/admin/benutzer/[uid]/sessions`

- All sessions (past + upcoming) for this customer
- Per row: title · datum · mentor · status · `<MeetingTypeIcon>` · Aktionen
- Actions: Reschedule (proposes new slot to customer) · Cancel (with reason) · Mark completed
- "Neue Session ansetzen" CTA → modal

##### Tab 5: Tickets — `/admin/benutzer/[uid]/tickets`

- All tickets opened by this customer
- Columns: Subject · Kategorie · Status · Erstellt · Letzte Aktivität
- Inline link to ticket thread
- "Internes Ticket erstellen" button — admin opens a ticket on customer's behalf (e.g. follow-up flag)

##### Tab 6: Notizen — `/admin/benutzer/[uid]/notizen`

Per Lastenheft: "interne Notizen speichern" — admin-only.

- Threaded note list (newest first): author admin · timestamp · body (markdown supported) · edit/delete (own only, super_admin can edit any)
- "Neue Notiz" composer at top
- Pin important notes to top
- Mentions: @other-admin-username sends a notification to them
- **Customers never see this tab**

##### Tab 7: Discord — `/admin/benutzer/[uid]/discord`

- Linked? Yes/No (with Discord User ID if yes)
- Currently assigned roles in your server (live from Discord API): Fast · Business · Infinity · TikTok · YouTube · Affiliate · Custom
- "Rollen neu synchronisieren" button (re-runs bot's role-grant logic idempotently)
- "Rolle manuell hinzufügen / entfernen" — for ad-hoc roles
- DM-Test button: sends a test message to confirm bot can reach them

##### Tab 8: Audit — `/admin/benutzer/[uid]/audit`

- Audit_log entries scoped to this customer (target_id = customer.uid)
- Columns: Datum · Aktion · Akteur (admin name) · Vorher / Nachher diff (collapsible JSON viewer)
- Filters: action type, date range, actor
- Export to CSV

**Acceptance for entire detail page**:
- All tabs share the customer header; switching tabs doesn't reload header
- Every mutation in any tab writes audit_log with `target_type='customer'`, `target_id=customer.uid`, before/after JSON
- Suspended customers show banner across all tabs ("Dieser Kunde ist gesperrt")
- Deleted customers show in muted state, PII redacted, all actions disabled except "Daten exportieren" (DSGVO compliance)
- Per-tab loading happens lazily (initial load = header + Übersicht; other tabs load on click)

**Audit**: every entitlement grant/revoke, status change, note add/edit/delete, Discord role change, impersonation start/end.

---

### 4.3 Produkte CMS

#### 4.3a — Product list

- **Route**: `/admin/produkte`
- **Phase**: 1 (read-only) → 3 (full editing)
- **Permission**: `products`

`<DataTable>`: Slug · Title · Kind (course / creator / giftcard / addon) · Plans count · Active · Sales count (lifetime) · Aktionen.

"Neues Produkt" CTA → `/admin/produkte/neu`.

#### 4.3b — Product editor

- **Route**: `/admin/produkte/[slug]`
- **Phase**: 3
- **Permission**: `products`

Form sections:
- Grunddaten: slug (immutable after creation), title, kind, beschreibung (rich text), thumbnail (Supabase Storage), is_active
- Pläne (per product): list of plans with code (fast/business/infinity), price_cents (integer cents in form input formatted with `formatEuro()`), features (JSON-edit), release_strategy (JSON per `STUDENT_DASHBOARD §6.3`)
- Per-plan actions: archive (sets is_active = false, preserves history), edit, delete (only if 0 entitlements)
- Sales preview: chart of monthly sales last 12 months
- "Preis ändern" workflow: prompts for new price + reason + "Apply to existing entitlements? (default no)" — versioning per `REQUIREMENTS_ANALYSIS.md §3`

**Acceptance**:
- Price change creates new plan version row, old version preserved
- Existing entitlements grandfathered to old plan version unless admin explicitly migrates
- Archiving a plan removes it from public pages and checkout but doesn't break historical reports

**Audit**: every price change, plan archive, product activation toggle.

#### 4.3c — Create product

- **Route**: `/admin/produkte/neu`
- **Phase**: 3
- **Permission**: `products`

Wizard: kind → slug + title → plans → confirm.

---

### 4.4 Kurse (course content CMS)

#### 4.4a — Course list

- **Route**: `/admin/kurse`
- **Phase**: 1 (overlaps with existing courses skeleton)
- **Permission**: `courses` OR `products`

Existing implementation lives at `src/app/admin/courses/page.tsx` with `<CourseContentManagement>`. Needs port to Postgres in Phase 1 (this is already in Phase 1 task list).

`<DataTable>`: Title · Slug · Wochen (count) · Module (count) · Aktive Einschreibungen · Aktionen.

#### 4.4b — Course editor

- **Route**: `/admin/kurse/[courseId]`
- **Phase**: 1
- **Permission**: `courses`

Layout: three-column

```
┌─────────────┬──────────────────────────┬─────────────┐
│ Wochen list │ Selected week / module   │ Properties  │
│             │ editor                   │ panel       │
│  W1 (3 Mod) │                          │             │
│  W2 (2 Mod) │  Module: M1 — Einführung │  Video URL  │
│  W3 (4 Mod) │  Title: …                │  Duration   │
│             │  Description: …          │  Resources  │
│  + Woche    │  + Modul                 │  Quiz       │
└─────────────┴──────────────────────────┴─────────────┘
```

Drag-and-drop reordering of weeks and modules. Inline rename. Duplicate module button.

#### 4.4c — Module editor

- **Route**: `/admin/kurse/[courseId]/modul/[moduleId]`
- **Phase**: 1 (basic) → 15 (Bunny upload UI)
- **Permission**: `courses`

Sections:
- Grunddaten: title, description (rich text), duration, sort order
- Video: upload to Bunny Stream (Phase 15) — drag-drop UI shows upload progress, transcoding status, then signed-URL preview
- Ressourcen: PDFs / templates — upload to Supabase Storage `course-resources` bucket
- Quiz: questions list, add/edit/delete, set passing_score, is_required toggle
- Gating: time-drip days OR mentor-gated (per plan release_strategy)

---

### 4.5 Zahlungen

#### 4.5a — Order list

- **Route**: `/admin/zahlungen`
- **Phase**: 3
- **Permission**: `payments`

`<DataTable>`: Date · Order ID · Customer (link) · Items · Total · Provider · Status · Invoice · Aktionen.

Filters: status, provider, date range, customer search, amount range, country.

KPI row at top: revenue today / month / YTD · pending orders · refunded total · chargeback count.

#### 4.5b — Order detail

- **Route**: `/admin/zahlungen/[orderId]`
- **Phase**: 3
- **Permission**: `payments`

Sections:
- Order summary: customer · items with prices · totals · taxes (VAT or reverse-charge) · giftcards applied
- Payment details: provider · provider_ref · payment status · payment events timeline (from Stripe/PayPal webhooks)
- Invoice: link to PDF · Lexoffice sync status (synced / pending / failed)
- Entitlements granted by this order
- Actions: Rückerstattung initiieren (refunds perm) · Storno-Rechnung erstellen · Resend invoice email

**Acceptance**:
- Refund button only visible with `refunds` perm
- Refund flow shows preview: amount, affected entitlements, credit-note number, customer notification
- Storno creates a new sequential invoice number (GoBD)

**Audit**: refund initiated, storno created, manual status change.

#### 4.5c — Refund queue

- **Route**: `/admin/zahlungen/refunds`
- **Phase**: 13
- **Permission**: `refunds`

Per `CRM_SPEC.md` Phase 13:

Tabs: Eingegangen (customer-requested) · Genehmigt · Bezahlt · Abgelehnt · Chargeback (auto-flagged from Stripe).

Per row: customer · order · requested amount · reason · 14-day-Widerruf eligibility flag · waiver-was-signed flag.

Approve flow:
- Confirm refund amount (full / partial)
- Select which entitlements to revoke
- Add admin note
- Triggers: Stripe/PayPal refund API call → Storno-Rechnung → entitlement revoke → customer notification email + Discord DM

**Acceptance**:
- Auto-detect Widerruf eligibility (purchase < 14 days ago AND no waiver signed = required to grant refund)
- Decline reason required if declining
- Chargeback flow auto-revokes entitlement on Stripe webhook event

**Audit**: every refund action with before/after amounts + entitlement deltas.

#### 4.5d — Crypto unlock queue

- **Route**: `/admin/zahlungen/crypto`
- **Phase**: 3 (manual flow) → later add NOWPayments automation
- **Permission**: `crypto_unlock`

Customer-initiated crypto orders in `awaiting_crypto` status.

Per row:
- Order · Customer · Items · Total in EUR · Selected chain (BTC/ETH/USDT-ERC20/USDT-TRC20)
- Customer-pasted TX hash (if provided)
- Generated receiving address (from your wallet)
- "Auf Blockchain prüfen" button → opens block explorer in new tab pre-filled
- "Als bezahlt markieren" → grants entitlements, marks order paid
- "Ablehnen" → cancels order, notifies customer

**Acceptance**:
- Block-explorer link works per chain
- Confirmation modal shows: TX hash · amount received · admin name · "I verified this on-chain" checkbox required
- Marking paid auto-issues invoice via Lexoffice

**Audit**: every crypto verification with TX hash + admin attestation.

---

### 4.6 Rechnungen (invoice admin)

- **Route**: `/admin/rechnungen`
- **Phase**: 12
- **Permission**: `payments`

`<DataTable>`: Invoice number (sequential, GoBD) · Date · Customer · Order · Amount · VAT · Lexoffice sync status · PDF link · Aktionen.

Filters: date range, status, sync status (synced/pending/failed), Lexoffice number.

Per row actions:
- Open PDF (signed URL, TTL 5 min)
- "Lexoffice-Sync wiederholen" if failed
- "Storno erstellen" → creates credit note

Aggregate KPI: total revenue this month · unsynced count · failed-sync count.

**Acceptance**:
- All invoices have sequential numbers with no gaps (run a daily integrity check)
- Failed Lexoffice sync surfaces alert
- Invoice PDFs immutable (cannot edit, only Storno)

---

### 4.7 Affiliate

#### 4.7a — Overview

- **Route**: `/admin/affiliate`
- **Phase**: 6
- **Permission**: `affiliate`

KPIs: aktive Partner count · Klicks this month · Conversions this month · Provisionen pending · Provisionen paid (lifetime) · Top performer this month.

Charts: monthly conversion trend, top 10 affiliates by revenue.

#### 4.7b — Partner / application queue

- **Route**: `/admin/affiliate/partner`
- **Phase**: 6
- **Permission**: `affiliate`

Tabs: Aktive · Beantragt (applications pending review) · Gesperrt.

Per row (active): Username · E-Mail · joined date · this-month clicks/conversions/earnings · status · Aktionen (edit commission rate · suspend · view details).

Application review:
- Application form data (intro, channels they'll promote on, expected volume)
- Approve → creates `affiliate_links` row with personalized code + sends welcome email
- Reject → email with reason

**Audit**: every approval, rejection, suspension, commission rate change.

#### 4.7c — Payout queue

- **Route**: `/admin/affiliate/payouts`
- **Phase**: 6
- **Permission**: `affiliate`

Per Lastenheft: manual payout, immer 1. des Monats.

Top-of-page: "Auszahlungslauf für [Monat] vorbereiten" button (only available on/after 1st of month). Generates batch of payouts:
- Group all approved-but-not-paid commissions per affiliate
- Subtract clawbacks (refunds, chargebacks)
- Apply withholding / VAT rules
- Generates downloadable CSV for bank-import (SEPA pain.001 XML in future)

Per row: Affiliate · period · amount · "Als bezahlt markieren" (uploads bank confirmation file or paste TX ref) → marks paid + sends notification.

**Acceptance**:
- Cannot mark paid without confirmation reference
- Mark-paid writes `payouts.status='paid'` + `paid_at` + `notes`
- Affiliate sees payout reflected in their dashboard within 30s

**Audit**: every payout marking.

#### 4.7d — Internal leaderboard

- **Route**: `/admin/affiliate/leaderboard`
- **Phase**: 6
- **Permission**: `affiliate`

Same data as public leaderboard but **with real names + emails** (admin view only). For monthly reward distribution.

---

### 4.8 Tickets (admin queue)

#### 4.8a — Queue

- **Route**: `/admin/tickets`
- **Phase**: 2
- **Permission**: `tickets`

`<DataTable>`: Subject · Customer · Kategorie · Status · Assignee · SLA-Status (green/yellow/red per `REQUIREMENTS_ANALYSIS.md §9`) · Letzte Aktivität · Aktionen.

Filters: status (Offen/In Bearbeitung/Geschlossen) · kategorie · assignee (me / unassigned / all) · SLA breach · age (>24h / >48h / >7d) · customer.

Bulk actions: assign to admin · change status · close with canned response.

Realtime: queue refreshes via Supabase Realtime on `tickets` table for new opens / status changes.

#### 4.8b — My tickets

- **Route**: `/admin/tickets/assigned-to-me`
- **Phase**: 2
- **Permission**: `tickets`

Same queue, prefiltered to current admin's assignments. Default landing for support-focused admins.

#### 4.8c — Ticket thread (admin view)

- **Route**: `/admin/tickets/[ticketId]`
- **Phase**: 2
- **Permission**: `tickets`

Layout:
- Header: subject · status · category · customer (link to customer 360) · SLA timer · assignee dropdown
- Message list: customer + admin replies + **internal-only messages** (visually distinct, customer cannot see)
- Composer: rich text · attach file · "Interne Notiz" toggle · "Vorlage einfügen" (canned responses dropdown) · "Antworten & schließen" combo button
- Right rail: customer mini-card (name, email, products, lifetime value, open tickets count) · "Zum Kunden 360" link · related tickets (same customer, same category)

Actions:
- Reassign to another admin
- Change status (Offen / In Bearbeitung / Geschlossen)
- Convert to bug ticket (internal feature flag)
- "Eskalieren" — pings super_admin via notification

**Acceptance**:
- Internal messages never appear in customer's view of the same ticket
- Reply triggers `ticket_reply` notification to customer (bell + email + Discord per their prefs)
- SLA breach triggers `ticket_sla_warning` notification to assignee + super_admin
- Status change to Geschlossen prompts canned response selection

**Audit**: status changes, reassignments, escalations.

---

### 4.9 Termine (sessions admin)

#### 4.9a — Calendar / list

- **Route**: `/admin/termine`
- **Phase**: 1 (existing) → 5 (full feature set)
- **Permission**: `customers` OR `mentor`

Already implemented as skeleton (`<AdminAppointmentView>`). Phase 1 ports to Postgres.

Calendar view (default), filterable by mentor (current admin if mentor-only).

Per session: title · customer (link) · mentor · date/time · status badge · meeting-type icon.

#### 4.9b — Session detail (admin view)

- **Route**: `/admin/termine/[sessionId]`
- **Phase**: 5
- **Permission**: `customers` OR `mentor`

Admin actions beyond what the student sees:
- Reschedule (admin-initiated, sends new proposal to customer)
- Mark as completed → triggers `course_unlocked` for Business plan mentor-gating
- Add mentor notes: private vs. "share with customer" toggle
- Upload recording link
- Mark no-show (with policy: warning vs. paid-no-show)

**Audit**: status changes, no-show flags, recording uploads.

#### 4.9c — Mentor availability

- **Route**: `/admin/termine/availability`
- **Phase**: 5
- **Permission**: `mentor`

Weekly recurring schedule editor:
- Day · From · To · Repeating · Time-off blocks
- One-off date overrides
- Buffer between sessions (15 / 30 min)
- Max sessions per day
- Calendar preview showing how customers will see availability

---

### 4.10 Creator

#### 4.10a — Creator customers list

- **Route**: `/admin/creator`
- **Phase**: 5
- **Permission**: `customers` (or `mentor` for own only)

`<DataTable>`: Customer · Product (TikTok / YouTube) · Briefing status · Call 1 date · Call 2 date · Fortschritt (follower delta since signup).

#### 4.10b — Briefing review queue

- **Route**: `/admin/creator/briefings`
- **Phase**: 5
- **Permission**: `customers` OR `mentor`

Filter: status = Eingereicht (default — needs review).

Per row: customer · product · submitted date · "Prüfen" → opens detail with comment thread + "In Bearbeitung markieren" + "Als bereit markieren".

#### 4.10c — Creator detail

- **Route**: `/admin/creator/[customerId]`
- **Phase**: 5
- **Permission**: `customers` OR (mentor AND assigned to this customer)

Sections:
- Briefing (read with admin comments)
- Fortschritts-Charts (follower/views over time)
- Sessions history + recordings
- Goals tracking (admin can mark goals achieved)
- Internal notes specific to this creator engagement

---

### 4.11 Community CMS

#### 4.11a — Post list

- **Route**: `/admin/community`
- **Phase**: 8
- **Permission**: `community_cms`

`<DataTable>`: Title · Kategorie (News/Updates/Ankündigungen/Erfolge) · Author · Published / Scheduled date · Views · Aktionen.

Filters: kategorie, status (Entwurf/Geplant/Veröffentlicht), date range.

#### 4.11b — Post composer

- **Route**: `/admin/community/neu` or `/admin/community/[postId]`
- **Phase**: 8
- **Permission**: `community_cms`

Form:
- Title
- Kategorie select
- Body (rich text editor with image / video / link support)
- Featured image (Supabase Storage)
- Publish date: now / schedule for later
- Notification toggle: "Benachrichtige alle Kunden über diesen Post" (sends bell + optional email)
- Preview button (renders in student-view styling)

**Acceptance**:
- Scheduled posts publish at the scheduled time (cron job)
- Draft auto-saves every 10s
- Realtime: when published, student feeds update via Supabase Realtime on `community_posts`

**Audit**: publish, edit (with diff), delete.

---

### 4.12 Interviews CMS

- **Route**: `/admin/interviews` (list) + `/admin/interviews/neu` + `/admin/interviews/[videoId]`
- **Phase**: 8
- **Permission**: `videos`

Per Lastenheft: admins can upload, reorder, edit, delete, change categories.

Upload UI integrates with Bunny Stream:
- Drag-drop file → upload progress bar → "Wird transkodiert" → "Bereit"
- Title · Beschreibung · Kategorie (Podcast / Kundenvideos / Meetings / Interviews / Erfolgsvideos) · Thumbnail (auto-extracted or manual) · Sort order

List view: drag-to-reorder per category.

---

### 4.13 Kundenerfolge CMS

- **Route**: `/admin/kundenerfolge`
- **Phase**: 8
- **Permission**: `kundenerfolge`

`<DataTable>`: Customer name (if linked) · Image preview · Type (Image / Video / Revenue screenshot / Social growth / Testimonial) · Display order · Active · Consent recorded.

**DSGVO requirement** (per `REQUIREMENTS_ANALYSIS.md §13`):
- Each slide MUST have a `consent_record_url` field linking to the signed Einwilligungserklärung PDF stored in Supabase Storage
- Cannot publish a slide without consent on file
- Audit log shows when consent was uploaded and by whom

---

### 4.14 Giftcards admin

- **Route**: `/admin/giftcards` (list) + `/admin/giftcards/neu` + `/admin/giftcards/[code]`
- **Phase**: 8
- **Permission**: `giftcards`

List columns: Code (masked) · Buyer · Recipient · Initial Wert · Restwert · Status · Erstellt · Aktionen.

"Neue Giftcard manuell erstellen" — for promotions: amount · expiration · recipient email · note.

Per giftcard detail: full code (revealable + audit) · transaction history (which orders applied it) · resend email.

Anti-fraud:
- Rate limit redemption attempts (Upstash)
- Log every redemption attempt (success or fail)
- Flag giftcards with > 5 failed redemption attempts in 1 hour

---

### 4.15 Zertifikate

- **Route**: `/admin/zertifikate` (list) + `/admin/zertifikate/neu` + `/admin/zertifikate/[certId]`
- **Phase**: 8
- **Permission**: `certificates`

Per Lastenheft: admin-issued only.

Issue form: select customer · select product/course · issue date · optional notes (private).

On issue:
- Generates PDF via `@react-pdf/renderer` with: name, course, date, signature (your logo + admin name), QR code linking to verification URL
- Stores in Supabase Storage `certificates` bucket
- Notifies customer (bell + email)
- Writes `audit_log`

Per certificate detail: download PDF · view verification URL · **Widerrufen** button (with reason) — sets `revoked_at`, verification URL then shows revoked status.

---

### 4.16 Analytics

- **Route**: `/admin/analytics`
- **Phase**: 9
- **Permission**: `analytics`

Per Lastenheft: Umsatz, Kunden, Conversion, Tickets, Affiliate, Verkäufe, Creator Daten, Termine, Statistiken.

Plus `REQUIREMENTS_ANALYSIS.md §16` additions: refund rate, LTV, CAC (if tracked), cohort retention, conversion funnel, per-mentor performance, CSAT.

Overview page: KPI grid + 3-4 hero charts (MRR if any, new customer trend, top products by revenue).

Sub-routes for deep-dives (`/umsatz`, `/kunden`, `/conversion`, etc.) — each with date range picker, plan/product filter, CSV export.

**Acceptance**:
- All metrics computed from Postgres queries (verifiable in Drizzle Studio)
- Date range picker default: last 30 days
- CSV export downloads full filtered data
- Charts under 2s load time with 10k orders

---

### 4.17 Benachrichtigungen (broadcast composer)

- **Route**: `/admin/benachrichtigungen`
- **Phase**: 4 (basic) → 8 (with audience targeting)
- **Permission**: `super_admin`

For platform-wide announcements (separate from the per-event notifications system):

Composer:
- Audience: All customers / By plan / By lifecycle stage / By saved filter / Custom CSV
- Channels: in-app banner · email · Discord broadcast
- Subject / body (rich text)
- Schedule: now / specific time
- Preview

Broadcast history table at `/admin/benachrichtigungen/broadcasts`.

**Audit**: every broadcast.

---

### 4.18 Audit log

- **Route**: `/admin/audit`
- **Phase**: 1 (basic) → expanded as more actions log
- **Permission**: `super_admin`

`<DataTable>`:
- Datum · Akteur (admin) · Aktion · Ziel (type + ID, link) · Vorher (collapsible JSON) · Nachher (collapsible JSON) · IP · User-Agent

Filters: actor, action type, target type, date range, free-text JSON search.

Export to CSV.

**Acceptance**:
- Every admin mutation in the system appears here
- Read-only (no edit/delete capability even for super_admin)
- Retention: forever (legal record)

---

### 4.19 Einstellungen

#### 4.19a — Allgemein

- **Route**: `/admin/einstellungen`
- **Phase**: 1
- **Permission**: `super_admin`

Company / brand settings: legal name (for invoices) · St.-Nr. · USt-IdNr. · imprint contact · default currency · default timezone.

#### 4.19b — Admins

- **Route**: `/admin/einstellungen/admins`
- **Phase**: 1
- **Permission**: `super_admin`

List of all admins with permission summary chips, status, last login, 2FA enabled flag.

"Admin einladen" → email-based invite flow: enter email + initial perms → sends Supabase Auth invite → on accept, admin is created with the chosen perms + must set up 2FA before first action.

Per admin detail: edit each perm toggle · suspend · view audit log filtered to their actions.

**Acceptance**:
- Cannot remove the last super_admin (UI prevents it)
- 2FA enrollment is enforced on first login for any admin
- Permission changes notify the affected admin

**Audit**: every perm change, suspension, invitation.

#### 4.19c — E-Mail-Templates

- **Route**: `/admin/einstellungen/email-templates`
- **Phase**: 4 (when Resend templates centralize)
- **Permission**: `super_admin`

List of all transactional + marketing templates: name · last edited · used in (which event).

Per template editor: subject · body (React Email JSX with preview) · variables list · "Test senden" → sends to admin's email.

#### 4.19d — Maintenance mode

- **Route**: `/admin/einstellungen/maintenance`
- **Phase**: 14 (Security hardening)
- **Permission**: `super_admin`

Toggle: enable maintenance mode → shows full-page banner to all logged-in customers · disables checkout · pauses Stripe webhook processing.

Optional message field shown to customers.

**Acceptance**:
- Admins can still log in and access /admin during maintenance
- Banner persists until explicitly disabled

#### 4.19e — Feature flags

- **Route**: `/admin/einstellungen/feature-flags`
- **Phase**: 14
- **Permission**: `super_admin`

Toggle list of feature flags (with rollout % for gradual rollouts):
- `new_checkout_v2` · 0–100%
- `discord_dm_quiet_hours` · on/off
- `kundenerfolge_v2` · on/off
- etc.

Store in Vercel Edge Config or `feature_flags` Postgres table.

#### 4.19f — Integrations

Per-vendor configuration pages — read-only display of connection status + masked credentials (with regenerate button).

Sub-routes:
- `/stripe` — Stripe Tax settings, webhook endpoints, public/secret key status, supported currencies
- `/paypal` — same
- `/lexoffice` — API key + org ID · "Test-Sync starten" button · last sync timestamp
- `/bunny` — library ID · signing key status · last upload
- `/discord` — bot status (online/offline) · role mapping config (Lastenheft roles → Discord role IDs)
- `/resend` — sending domain · DKIM/SPF/DMARC verification status
- `/crisp` — website ID

**Audit**: integration config changes.

#### 4.19g — Legal (DSGVO admin)

- **Route**: `/admin/einstellungen/legal`
- **Phase**: 11 (DSGVO)
- **Permission**: `super_admin`

Sub-pages:

**Sub-processors registry** (`/sub-processors`):
- List of every third-party processing customer data: name · purpose · data categories · location · last reviewed
- "Neuen Sub-Prozessor hinzufügen" form
- Sync with privacy policy at `/legal/datenschutz` (or note where to update)

**DPAs library** (`/dpa`):
- Upload PDF DPAs per sub-processor: vendor · signed date · expiry · file (Supabase Storage)
- Reminder cron 60 days before expiry

**Consent log** (`/consent-log`):
- Searchable log of every consent event: customer · timestamp · action (granted/withdrawn) · scope (marketing/cookies/etc) · IP · user-agent
- Export to CSV

---

### 4.20 Profil (admin's own profile)

- **Route**: `/admin/profil`
- **Phase**: 1 (basic) → 14 (2FA mandatory)
- **Permission**: always

Same surface as student profile but admin-flavored:
- Persönliche Daten
- 2FA enrollment (mandatory — cannot disable without super_admin approval)
- Active sessions
- API tokens (for personal scripts, scoped to own perms)
- "Mein Audit-Log" — all my own actions

---

## 5. Mentor view — what changes

A mentor-only admin (`{ mentor: true, customers: false, ... }`) sees:

**Sidebar**:
- Übersicht (with mentor-scoped tiles)
- Termine (filtered to own sessions only)
- Creator (filtered to own assigned customers)
- Profil

**Hidden / 403'd**:
- Benutzer list (cannot browse all customers — only those assigned via session/enrollment)
- All admin areas (Produkte, Zahlungen, Affiliate, Tickets, etc.)

**Limited customer access**:
- A mentor can view a customer's 360 page **only if** they have a session or active mentor-gated enrollment with that customer
- Even then, restricted to tabs: Übersicht (read-only profile) · Sessions (their own only) · Notizen (their own only)
- No Produkte / Zahlungen / Discord / Audit tabs

**Mentor-specific tiles on Übersicht**:
- Heutige Sessions (only own)
- Eingereichte Briefings für meine Kunden
- Bevorstehende Calls (next 7 days)
- "Mein Rating" (placeholder if not implemented yet)

**No bulk operations, no impersonation, no refunds, no payouts.**

---

## 6. Phase-by-phase build order

| Phase | Admin pages that land |
|---|---|
| **1 — Foundation + Firebase removal** | `/admin` (real KPIs), `/admin/benutzer` list + customer 360 with all 8 tabs (basic editing for grant/revoke/notes), `/admin/kurse` (Postgres-backed editor), `/admin/audit`, `/admin/einstellungen` (general + admins), `/admin/profil` |
| **2 — Tickets** | `/admin/tickets/**` (queue, my tickets, thread with internal messages) |
| **3 — Payments hardened** | `/admin/zahlungen/**` (orders, order detail), `/admin/zahlungen/crypto`, partial refund-queue stub |
| **4 — Notifications** | `<NotificationBell>` in admin top bar, `/admin/benachrichtigungen` broadcast composer (basic), `/admin/einstellungen/email-templates` |
| **5 — Sessions & Creator program** | `/admin/termine/**` full feature, `/admin/creator/**`, mentor-only view filters land here |
| **6 — Affiliate full loop** | `/admin/affiliate/**` (partners, payouts, internal leaderboard) |
| **7 — Discord bot** | `/admin/einstellungen/integrations/discord`, customer 360 Discord tab full feature |
| **8 — CMS modules** | `/admin/community/**`, `/admin/interviews/**`, `/admin/kundenerfolge/**`, `/admin/giftcards/**`, `/admin/zertifikate/**` |
| **9 — Analytics dashboard** | `/admin/analytics/**` with deep-dives |
| **11 — DSGVO Foundation** | `/admin/einstellungen/legal/**` (sub-processors, DPA library, consent log) |
| **12 — Tax & Invoicing** | `/admin/rechnungen`, `/admin/einstellungen/integrations/lexoffice`, Lexoffice sync status in order detail |
| **13 — Refunds & Widerruf** | `/admin/zahlungen/refunds` full queue, refund flow in order detail |
| **14 — Security Hardening** | `/admin/einstellungen/maintenance`, `/admin/einstellungen/feature-flags`, 2FA enforcement on all admin accounts |
| **15 — Video provider migration** | Bunny upload UI in `/admin/kurse/[courseId]/modul/[moduleId]` and `/admin/interviews/neu`, `/admin/einstellungen/integrations/bunny` |
| **16 — Reliability** | Status strip at bottom of admin shell (Sentry health, integration health) |

---

## 7. What admin does NOT see (boundaries)

- Other admins' personal API tokens
- Other admins' password resets / 2FA recovery codes
- Customers' raw passwords (never, anywhere)
- Stripe webhook signing secret (admin sees masked + regenerate button only)
- Database connection strings
- Customer's encrypted personal messages with another customer (no DM system in v1; if added later, admins should not have read access without legal cause)
- Real-time customer browsing activity (no live-tracking; only audit-log style events)

Mentors additionally cannot see:
- Customers they're not actively working with
- Refund / payment data even for customers they mentor
- Discord-tab data for any customer (Discord-management is sensitive)
- Any audit log entries other than their own actions

---

## 8. Component contracts to stub during Phase 1

Phase 1 builds the customer 360 (`/admin/benutzer/[uid]`). While doing so, prompt Claude Code to also stub these shared admin components:

| Component | Stub? | Used from |
|---|---|---|
| `<DataTable>` | Yes — fully featured | Every list page (Phases 1-9) |
| `<FilterBar>` | Yes | Same |
| `<CustomerHeader>` | Yes | Customer 360 |
| `<EntitlementGrid>` | Yes | Phase 1 |
| `<AuditTrail>` | Yes | Phase 1 |
| `<KpiCard>` | Yes | Phase 1 dashboard home |
| `<TimeSeriesChart>` | Phase 9 | Analytics |
| `<StatusBadge>` | Yes | Every list |
| `<ConfirmDangerousAction>` | Yes | Phase 1 (revoke, suspend) |
| `<ImpersonateButton>` | Stub interface only | Phase 1 stub, Phase 14 wires impersonation logic |

---

## 9. Acceptance criteria — meta-version

Before declaring the admin/mentor dashboard "complete" (end of Phase 16):

- [ ] Every section in §2 sitemap reachable
- [ ] Every page in §4 has its acceptance criteria green
- [ ] Sidebar respects permission rules in §4.0 for both regular admins and mentor-only profile
- [ ] Mentor-only profile cannot access any restricted route (returns 403 + sidebar hidden)
- [ ] `requireAdmin(perm)` middleware in front of every route + every API endpoint
- [ ] Every state-changing action writes a meaningful `audit_log` row with actor / target / action / before / after
- [ ] 2FA enforced on every admin login (Supabase MFA TOTP)
- [ ] Impersonation produces a visible banner in the impersonated customer's view AND audit log
- [ ] Bulk operations show dry-run preview + per-row outcome
- [ ] Saved filter views persist per admin
- [ ] Realtime: ticket queue, refund queue, crypto queue all push updates via Supabase Realtime
- [ ] All copy German, tone consistent
- [ ] AgentShield scan returns zero critical findings on admin routes
- [ ] Manual end-to-end smoke: super_admin invites operator → operator accepts → 2FA-enrolls → can view ticket queue but not refund queue → super_admin grants refunds perm → operator now sees refund queue → refund approved → entitlement revoked → audit log shows full chain → operator log out → super_admin reviews operator's actions in audit log

---

## 10. Cross-references

- Customer 360 ties to schema in `CRM_SPEC.md §2` tables: `customers`, `admin_permissions`, `entitlements`, `orders`, `payments`, `sessions`, `tickets`, `admin_notes`, `audit_log`
- Refund / crypto / payout queues tie to `CRM_SPEC.md` Phases 3, 6, 12, 13
- Mentor permission model resolved in `CRM_SPEC.md §5` decision log row 3
- DSGVO admin tooling specified in `REQUIREMENTS_ANALYSIS.md §19.1`
- Analytics metrics list in `REQUIREMENTS_ANALYSIS.md §16`
