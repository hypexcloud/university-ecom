# Student Dashboard — Information Architecture & Spec

Source-of-truth for everything the logged-in customer sees inside the platform. Refines and structures the Lastenheft requirements at the page/route level. Use as the implementation reference when building any page under `src/app/student/**`.

Companion docs:
- [`LASTENHEFT.md`](./LASTENHEFT.md) — original client requirements (immutable)
- [`CRM_SPEC.md`](./CRM_SPEC.md) — phase plan and Postgres schema
- [`REQUIREMENTS_ANALYSIS.md`](./REQUIREMENTS_ANALYSIS.md) — gap catalog

---

## 0. Reading this doc

Each page section follows the same template:

```
### Route
- Route: /student/...
- Phase: in CRM_SPEC.md
- Plan-gate: what entitlement is required (if any)
- Role-gate: what role flag (if any)
- Contents: what the user sees
- Acceptance: pass/fail tests for "done"
```

**UI language is German.** Every label, button, error message, and email subject is German. Existing tone is direct + premium (no fluff, no patronizing copy).

**All routes are server-rendered by default** unless interactivity demands `"use client"`. Auth gate at the layout level via `requireAuth()` from `src/lib/server/auth.ts`. Plan-gating happens inside the page via the user's entitlements lookup.

---

## 1. Sitemap

```
/student
├── /                              Übersicht (home, 3 states)
├── /kurse
│   └── /[courseId]                course player (modules tree + video)
│       └── /modul/[moduleId]      individual module deep-link
├── /termine                       sessions list + calendar (Business+)
│   └── /[sessionId]               session detail
├── /creator                       Creator dashboard (TikTok/YouTube only)
│   ├── /briefing                  briefing form
│   ├── /fortschritt               progress self-report
│   └── /termine                   creator calls (auto-scheduled)
├── /community                     news/updates/announcements/successes
│   └── /[postId]                  post detail
├── /interviews                    video library
│   └── /[videoId]                 video player
├── /affiliate                     affiliate dashboard (role-gated)
│   ├── /leaderboard               username-only rankings
│   └── /materialien               banners + swipe copy + link generator
├── /giftcards                     active + redeemed giftcards
├── /support                       my tickets list
│   ├── /neu                       open new ticket
│   └── /[ticketId]                ticket thread
├── /profil
│   ├── /                          Persönliche Daten (default)
│   ├── /rechnungen                invoices list + download
│   ├── /zertifikate               certificates list + download
│   ├── /discord                   Discord link + roles
│   ├── /termine-einstellungen     timezone + booking prefs
│   ├── /benachrichtigungen        per-event channel toggles
│   ├── /sicherheit                password, 2FA, active sessions
│   └── /datenschutz               data export, account deletion, consent log
└── /benachrichtigungen            full notifications list (linked from bell)

/checkout                          cart + billing + payment (separate from /student)
/checkout/success
```

---

## 2. Global shell (every `/student/**` page)

Lives in `src/app/student/layout.tsx`. Renders:

- **Top bar** (sticky): logo (left) · search (later phase) · notifications bell · profile avatar dropdown (Profil / Abmelden)
- **Sidebar** (collapsible on mobile): nav items per §3 below, with active-state highlight + section dividers
- **Main content area**: page body, max-width container, breadcrumbs at top for nested routes
- **Bottom-right widget**: Crisp livechat (lazy-loaded only after marketing-cookie consent)

Shared components to build once and reuse:

| Component | Path | Used by |
|---|---|---|
| `<DashboardShell>` | `src/components/dashboard/shell.tsx` | layout.tsx |
| `<SidebarNav>` | `src/components/dashboard/sidebar.tsx` | DashboardShell |
| `<NotificationBell>` | `src/components/dashboard/notification-bell.tsx` | TopBar |
| `<ProductCard>` | `src/components/dashboard/product-card.tsx` | Übersicht, Kurse |
| `<SessionCard>` | `src/components/dashboard/session-card.tsx` | Übersicht, Termine, Creator |
| `<EmptyState>` | `src/components/dashboard/empty-state.tsx` | first-time states |
| `<ProgressBar>` | `src/components/ui/progress-bar.tsx` | course cards, module list |
| `<PlanBadge>` | `src/components/dashboard/plan-badge.tsx` | course cards |
| `<MeetingTypeIcon>` | `src/components/dashboard/meeting-type-icon.tsx` | sessions |
| `<GiftcardCode>` | `src/components/dashboard/giftcard-code.tsx` | Giftcards, Checkout |

**Never re-roll** any of those — extend instead.

---

## 3. Navigation rules

Sidebar items appear conditionally based on the user's entitlements and role flags. The full ruleset:

| Nav item | Condition |
|---|---|
| Übersicht | always |
| Meine Kurse | user has ≥1 entitlement on any `course` product (AI Kurs or Dropshipping) |
| Termine | user has entitlement on a `business` or `infinity` plan |
| Creator Programm | user has entitlement on `tiktok-creator` or `youtube-creator` product |
| Community | always |
| Interviews | always |
| Affiliate | `admin_permissions.perms.affiliate_member` is `true`, or row exists in `affiliate_links` for this customer |
| Giftcards | user owns ≥1 active giftcard with `balance_cents > 0` |
| Support | always |
| Profil | always |

Hidden items are not rendered (not just disabled) — keeps the UI clean and prevents teasing locked features.

**Mobile behavior**: sidebar collapses into a hamburger drawer. Same items, same rules.

---

## 4. Pages

### 4.1 Übersicht (Dashboard home)

- **Route**: `/student`
- **Phase**: 1 (skeleton with real counts) → 4 (notifications widget) → 6 (affiliate widget if affiliate)
- **Plan-gate**: none
- **Role-gate**: none

Three render states, branched on entitlement count:

**State A — No entitlements**

```
H1: Willkommen bei University Ecom
Subhead: Du hast aktuell noch keinen Kurs ausgewählt.

Grid of 4 large CTA cards:
- AI Kurs              → /courses/ai
- Dropshipping         → /courses/dropshipping
- Creator Programm     → /creator
- Erstgespräch         → /intake

Below the fold:
- Kundenerfolge slideshow preview (10+ slides)
- "Was du verpasst" promo banner (admin-editable, scheduled)
- FAQ shortcut → /faq
```

**State B — Has entitlements + progress**

Personalized sections, top-to-bottom:

1. **Heutige Aufgaben** — context-aware bullet list:
   - "Modul 3 von AI Kurs Business steht zur Hälfte" + CTA "Weiterlernen"
   - "Termin am Fr 22.05. um 14:00 — bitte bestätigen" + CTA "Akzeptieren / Ablehnen"
   - "Dein Creator-Briefing ist leer" + CTA "Jetzt ausfüllen"
2. **Meine Kurse** — horizontal card row, one card per enrolled course (uses `<ProductCard>`)
3. **Nächste Termine** — up to 3 upcoming sessions/creator calls (uses `<SessionCard>`)
4. **Letzte Benachrichtigungen** — top 5 unread + "Alle anzeigen"
5. **Community Highlights** — last 3 News / Erfolge posts
6. **Affiliate widget** (conditional) — referral link + this-month earnings

**State C — Has entitlement, zero progress**

Hybrid of A + B: one big course card with "Jetzt starten" + 5-step onboarding checklist (complete profile, join Discord, watch intro video, attend Q&A, set first goal).

**Acceptance**:
- All counts (course progress %, unread notif count, this-month earnings) come from live Postgres queries — no mocks.
- Each state renders correctly with seed-data variations.
- Sidebar nav reflects entitlements (e.g. no Termine for Fast-only users).

---

### 4.2 Meine Kurse — list

- **Route**: `/student/kurse`
- **Phase**: 1
- **Plan-gate**: ≥1 course entitlement (else 404 + sidebar item hidden)
- **Contents**: grid of `<ProductCard>` for each enrolled course. Card shows: thumbnail, title, `<PlanBadge>` (Fast / Business / Infinity), `<ProgressBar>`, last accessed date, primary CTA "Weiterlernen" (deep-links to last-viewed module).

---

### 4.3 Meine Kurse — course player

- **Route**: `/student/kurse/[courseId]`
- **Phase**: 1 (basic) → 8 (drip/gating refined) → 15 (Bunny Stream video)
- **Plan-gate**: entitlement on this course

Layout:

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumb · Course title · Plan badge                   │
├──────────┬───────────────────────────────────────┬───────┤
│ Sidebar  │ Video player                          │ Right │
│ (Wochen  │ (Bunny Stream signed URL, watermark)  │ rail  │
│  + Mod.) │                                       │       │
│          │ Title · Duration · "Modul abschließen"│       │
│  W1      │                                       │ Prev/ │
│   M1 ✓   │ Tabs:                                 │ Next  │
│   M2 ▶   │  - Beschreibung                       │       │
│   M3 🔒  │  - Ressourcen (PDFs, downloads)       │ Disc. │
│  W2      │  - Notizen (private)                  │ link  │
│   …      │  - Quiz (if exists)                   │       │
│          │                                       │ Frage │
│          │                                       │ stell.│
└──────────┴───────────────────────────────────────┴───────┘
```

**Module sidebar gating** (icons):
- ✓ completed
- ▶ current / available
- 🔒 locked + tooltip explaining: "Verfügbar in X Tagen" (drip) or "Verfügbar nach Termin mit deinem Mentor" (Business mentor-gated) or "Schließe vorheriges Modul ab" (sequential)

**Video player requirements** (Phase 15):
- Bunny Stream signed URL, TTL 5 min, re-signed on each playback start
- Dynamic watermark: viewer's email overlaid bottom-right with 30% opacity
- HLS adaptive bitrate
- Resume from last position (`module_progress.video_progress`)
- "Modul abschließen" disabled until video ≥ 90% watched

**Resources tab** (downloads):
- PDFs / templates listed
- Each download is server-side: API generates a PDF copy stamped with viewer email + download timestamp (basic deterrent watermark, not DRM)
- Server-side audit log entry on each download

**Notes tab**: textarea per module, autosaves every 5 s, stored in `module_progress.notes`

**Quiz tab** (if module has one):
- Multiple choice questions, single answer
- Submit shows score
- Pass threshold from `module.quiz.passing_score`
- Retry allowed (max 3 attempts logged)
- Completion of quiz is required for module completion if `module.quiz.is_required = true`

**"Frage stellen" CTA**: opens new ticket pre-filled with `category: Kursfrage` + `subject: "Frage zu Modul X — <module title>"`.

**Plan-gating in player**:
- Fast: all modules unlocked at enrollment, no mentor-gating
- Business: first module unlocked, subsequent unlock after the mentor marks the next session `completed`
- Infinity: all unlocked at enrollment + additional "Custom-Website-Projekt" panel above the video player showing project status (Briefing / Design / Develop / Launch — admin-controlled milestones)

**Acceptance**:
- Module sidebar shows correct lock state per plan
- Video player loads with signed URL and watermark
- Completing a module increments progress in Postgres + fires `course_unlocked` notification if it unlocks a new module
- Resource downloads include the per-user watermark

---

### 4.4 Termine — list + calendar

- **Route**: `/student/termine`
- **Phase**: 5
- **Plan-gate**: Business or Infinity entitlement

Layout:
- View toggle: Monat / Woche / Liste (default Liste)
- Calendar grid (Monat/Woche) using `react-big-calendar` (already in deps)
- List view: upcoming first (chronological), then past (reverse chronological), grouped by month

Per `<SessionCard>`:
- Title (e.g. "Wöchentlicher Check-in mit Anna")
- Date + time in user's timezone (timezone shown explicitly)
- Duration
- Mentor name + avatar
- `<MeetingTypeIcon>` (Zoom / Google Meet / Discord)
- Status badge: Ausstehend / Bestätigt / Abgeschlossen / Abgesagt / Verpasst
- Action buttons depending on status (see §4.5)

---

### 4.5 Termine — session detail

- **Route**: `/student/termine/[sessionId]`
- **Phase**: 5
- **Plan-gate**: own this session (own entitlement that produced it)

Per Lastenheft (Business plan): customer can akzeptieren / ablehnen / Alternativen vorschlagen.

State-machine actions:

| Status | Visible actions |
|---|---|
| Ausstehend (admin proposed) | Akzeptieren · Ablehnen · Alternativen vorschlagen (opens form with 3 alt slots) |
| Bestätigt | Beitreten (deep-link to Zoom/Meet/Discord) · `.ics` download · Absagen (with reason) |
| Abgeschlossen | View summary + mentor notes (if shared) + recording link (if recorded, with consent banner) |
| Abgesagt | Read-only history |
| Verpasst | "Erneut anfragen" CTA (creates a new pending session request to mentor) |

**Reminder cadence**: email + Discord DM 24 h before + 1 h before. From `/api/cron/session-reminders`. Respect quiet-hours setting.

**Acceptance**:
- All four state transitions wired (accept, reject, propose, cancel)
- "Beitreten" deep-link works for all three meeting types
- `.ics` download includes correct timezone, mentor, location/URL
- Past sessions are read-only

---

### 4.6 Creator Programm — dashboard

- **Route**: `/student/creator`
- **Phase**: 5
- **Plan-gate**: entitlement on `tiktok-creator` or `youtube-creator`

Per Lastenheft sections: Zoom Bereich, Briefing Bereich, Fortschritt, Termine.

Layout: 2×2 grid of cards, each a preview + CTA to its dedicated sub-page:

| Card | Preview | CTA |
|---|---|---|
| Zoom Bereich | Pinned Zoom room URL + dial-in | "Zoom-Raum öffnen" |
| Briefing Bereich | Status indicator (Entwurf / Eingereicht / In Bearbeitung / Bereit) | "Briefing bearbeiten" |
| Fortschritt | Mini-chart of follower/views over last 30 days | "Fortschritt aktualisieren" |
| Termine | Next call (date + countdown) | "Alle Termine anzeigen" |

---

### 4.7 Creator — Briefing

- **Route**: `/student/creator/briefing`
- **Phase**: 5
- **Plan-gate**: Creator entitlement

Per Lastenheft 9 fields:

| Field | Type | Validation |
|---|---|---|
| Vorname | text | required, prefilled from profile |
| Nachname | text | required, prefilled from profile |
| Social Link | URL | required, must match TikTok or YouTube URL pattern for their product |
| Nische | text | required, 200 char max |
| Follower | number | required, ≥ 0 |
| Views | number | required, ≥ 0 |
| Ziele | textarea | required, 1000 char max |
| Probleme | textarea | optional, 1000 char max |
| Erfahrungen | textarea | optional, 1000 char max |
| Optional file upload | file | max 10 MB, allowed types: pdf/jpg/png/mp4. Uploaded to Supabase Storage `briefings` bucket (private) |

Workflow:
- Status: Entwurf → "Einreichen" → Eingereicht → admin reviews → In Bearbeitung → Bereit für Call 1
- Admin can leave comments visible to customer
- Customer can edit while Entwurf; locked while In Bearbeitung+

---

### 4.8 Creator — Fortschritt (self-report)

- **Route**: `/student/creator/fortschritt`
- **Phase**: 5
- **Plan-gate**: Creator entitlement

Weekly self-report fields the customer updates manually:
- Follower count
- Total views
- Watch-time (YouTube) or views/day (TikTok)
- Notable wins this week (textarea)
- Blockers (textarea)

Renders historical chart: line graph of follower count, bar chart of views/week. Compares against goals from the briefing.

**Future**: TikTok / YouTube Data API integration to auto-pull these. Stub the buttons now ("Mit TikTok verbinden" — disabled with "Bald verfügbar" badge).

---

### 4.9 Creator — Termine

Reuses `/student/termine` UI but filtered to Creator-product sessions. The two auto-scheduled calls live here:
- **Call 1**: first Friday after purchase (per Lastenheft)
- **Call 2**: +1 month after Call 1

Edge cases (per `REQUIREMENTS_ANALYSIS.md §8`):
- If first Friday already passed at time of scheduling, use next Friday
- Skip German public holidays (Karfreitag, Maifeiertag, etc.) — use `date-fns-holiday-de` or hard-coded list
- Customer can accept / reject / propose alternative same as Business sessions

---

### 4.10 Community

- **Route**: `/student/community`
- **Phase**: 8 (CMS comes online here)
- **Plan-gate**: none

Tabs: News · Updates · Ankündigungen · Erfolge

Per tab: paginated list, 20 posts per page, newest first.

Per post card:
- Title (bold, gold accent on hover)
- Author (admin name + avatar)
- Published date
- Body preview (first 200 chars + "Weiterlesen")
- Thumbnail (if post has media)
- Reactions count (heart icon — read-only for now, interactive in future)

`/student/community/[postId]` — full post view with rich text body, images/videos inline, "Zurück zur Community" link.

Realtime: Supabase Realtime subscription on `community_posts` for instant feed updates when admin publishes.

---

### 4.11 Interviews — video library

- **Route**: `/student/interviews`
- **Phase**: 8
- **Plan-gate**: none (all logged-in users)

Per Lastenheft categories: Podcast Inhalte · Kundenvideos · Meetings · Interviews · Erfolgsvideos.

Grid layout: thumbnail + title + duration + category badge. Filter chips above grid by category.

`/student/interviews/[videoId]` — Bunny Stream signed-URL player, same protections as course videos (watermark, signed TTL).

---

### 4.12 Affiliate — dashboard

- **Route**: `/student/affiliate`
- **Phase**: 6
- **Role-gate**: customer has an `affiliate_links` row OR `admin_permissions.perms.affiliate_member = true`

Cards / sections:

**Top — Referral Link**
- Large display of personalized link (e.g. `university-ecom.com/?ref=DEINNAME`)
- "Kopieren" button (with success toast)
- Share buttons: WhatsApp / Discord / E-Mail / X
- Cookie window note: "Empfehlungen werden 60 Tage lang verfolgt."

**Stats grid (4 cards)**:
- Klicks (this month / lifetime)
- Conversions (this month / lifetime) + conversion-rate %
- Verdienst (Ausstehend · Zu Auszahlung · Bezahlt)
- Nächste Auszahlung: "1. Juni 2026" (1st of next month)

**Verkäufe table** (recent 50):
- Date · Anonymized customer name (e.g. "M. K. aus DE") · Product · Order amount · Commission · Status (pending/approved/paid/refunded)
- Refunded line items shown with strikethrough + red clawback badge

**Statistik charts** (Recharts):
- Klicks per Tag (line, last 30 days)
- Conversions per Tag (bar, last 30 days)
- Top-Performing-Kanäle (pie, source attribution)

**Materialien shortcut** → `/student/affiliate/materialien`

---

### 4.13 Affiliate — Leaderboard

- **Route**: `/student/affiliate/leaderboard`
- **Phase**: 6
- **Role-gate**: affiliate

Per Lastenheft: Username, Rang, Platzierung. **Keine Klarnamen.**

Top-30 monthly window. Top 3 highlighted with gold/silver/bronze badge + this-month reward note (e.g. "Platz 1: 500 € Bonus").

Reset cadence visible: "Aktueller Monat: Mai 2026 · Reset am 1. Juni 00:00 Uhr Berlin."

Your own row highlighted in gold with a sticky-bottom variant if you're not in the top 30.

---

### 4.14 Affiliate — Materialien (recommended)

- **Route**: `/student/affiliate/materialien`
- **Phase**: 6 (P2)
- **Role-gate**: affiliate

Per `REQUIREMENTS_ANALYSIS.md §12 [RECOMMENDED]`:
- Banner library: downloadable image assets (1080×1080, 1080×1920, 1200×628 etc.)
- Swipe copy: copy-paste captions for Instagram/TikTok/Twitter, in German
- UTM-tagged link generator: form with source/medium/campaign inputs, outputs the personalized link with UTM params

---

### 4.15 Giftcards

- **Route**: `/student/giftcards`
- **Phase**: 8
- **Plan-gate**: owns ≥1 giftcard (active or used)

Two tables:

**Aktive Giftcards**
- Code (masked: `UECM-****-XYZ4`, full code revealable on click + audit log)
- Ursprünglicher Wert
- Aktueller Restwert
- Status (Aktiv / Eingelöst / Abgelaufen)
- Ablaufdatum (Lastenheft doesn't define expiration — apply 3-year default per German law, configurable per giftcard)
- "Im Checkout einlösen" → deep-link to /checkout if cart exists

**Eingelöste Giftcards**
- Code
- Eingelöst am
- Auftragsnummer (link to /student/profil/rechnungen filtered to that order)

---

### 4.16 Support — my tickets

- **Route**: `/student/support`
- **Phase**: 2
- **Plan-gate**: none

Tabs by status: Alle · Offen · In Bearbeitung · Geschlossen.

Table columns:
- Subject
- Kategorie badge (Support / Hilfe / Feedback / Kursfrage / Affiliate / Creator / Technisches Problem)
- Status badge + last activity time
- Unread indicator (bold row if has unread admin reply)

"Neues Ticket" button (top-right) → `/student/support/neu`.

Empty state (no tickets ever): "Du hast noch kein Ticket erstellt. Brauchst du Hilfe?" + CTA.

---

### 4.17 Support — new ticket

- **Route**: `/student/support/neu`
- **Phase**: 2
- **Plan-gate**: none

Form:

| Field | Type |
|---|---|
| Kategorie | select (the 7 from Lastenheft) — auto-prefilled if deep-linked from another page (e.g. course player) |
| Subject | text, required, 120 char max |
| Body | textarea / rich text, required, 5000 char max |
| Datei anhängen | file, optional, max 10 MB, PDF/PNG/JPG only |

On submit:
- Inserts `tickets` + first `ticket_messages` row
- Status: Offen
- Fires `ticket_created` notification to admin queue
- Redirects to `/student/support/[ticketId]`

---

### 4.18 Support — ticket thread

- **Route**: `/student/support/[ticketId]`
- **Phase**: 2
- **Plan-gate**: own this ticket

Layout:
- Header: subject + category badge + status badge + opened-at date
- Message list (chronological): customer + admin messages, distinct styling, avatars, timestamps, attachments rendered inline (image preview) or as download link (PDF)
- Composer at bottom: textarea + attach-file + "Antworten" button
- Status header changes by admin trigger fire `ticket_status_changed` notification

Realtime: Supabase Realtime on `ticket_messages` filtered by ticket_id → new admin reply appears without refresh.

---

### 4.19 Profil — Persönliche Daten (default)

- **Route**: `/student/profil`
- **Phase**: 1 (basic edit) → 11 (DSGVO additions)
- **Plan-gate**: none

Form:
- Vorname · Nachname (editable, autosave on blur)
- E-Mail (change requires email verification flow — Supabase Auth's `updateUser({ email })`)
- Discord Username (editable, plus separate /profil/discord page for OAuth linking)
- WhatsApp Nummer (editable, validated with libphonenumber-js)
- Sprache (de / en — stub for future i18n)

---

### 4.20 Profil — Rechnungen

- **Route**: `/student/profil/rechnungen`
- **Phase**: 3 (invoice generation lands)
- **Plan-gate**: none

Table:
- Rechnungsnummer (sequential, GoBD-compliant — see `REQUIREMENTS_ANALYSIS.md §5`)
- Datum
- Bezugsobjekt (e.g. "AI Kurs Business")
- Betrag (formatted via `formatEuro()`)
- Status (Bezahlt / Storniert / Offen)
- "PDF herunterladen" button → server endpoint signs Supabase Storage URL with 5-min TTL, redirects

Storno-Rechnungen (credit notes) appear as separate rows with explicit "Storno-Rechnung" badge and reference to original invoice.

---

### 4.21 Profil — Zertifikate

- **Route**: `/student/profil/zertifikate`
- **Phase**: 8
- **Plan-gate**: has ≥1 issued certificate

Per Lastenheft: PDF mit Name, Kurs, Datum. Admin-issued only.

List view:
- Kursname
- Ausstellungsdatum
- Aussteller (admin name)
- "PDF herunterladen" (signed URL)
- "Verifikation öffnen" (public URL with QR-code-style hash check)
- Revoked certificates shown with red "Widerrufen" badge

---

### 4.22 Profil — Discord

- **Route**: `/student/profil/discord`
- **Phase**: 7
- **Plan-gate**: none

If not linked:
- "Verbinde dein Discord-Konto" CTA → Discord OAuth flow
- Explainer: "Damit erhältst du automatisch deine Rollen im Server (Fast, Business, etc.) sowie Benachrichtigungen per DM."

If linked:
- Discord username (live from Discord API)
- Currently assigned roles (e.g. "Business, Affiliate")
- "Rollen synchronisieren" button (re-runs bot role assignment idempotently)
- "Verknüpfung aufheben" (per Lastenheft Lifetime, roles stay on Discord server but DMs stop)

---

### 4.23 Profil — Termine-Einstellungen

- **Route**: `/student/profil/termine-einstellungen`
- **Phase**: 5
- **Plan-gate**: Business or Infinity or Creator (any plan that uses sessions)

Form:
- Zeitzone (default: detected from browser, e.g. "Europe/Berlin")
- Bevorzugte Termin-Slots (multi-select: morning / afternoon / evening, weekday)
- Bevorzugte Meeting-Plattform (Zoom / Google Meet / Discord)
- Maximum-Termine-pro-Woche (defaults: 1 for Business, 3 for Infinity)

---

### 4.24 Profil — Benachrichtigungen

- **Route**: `/student/profil/benachrichtigungen`
- **Phase**: 4
- **Plan-gate**: none

Per Lastenheft events (rows) × 3 channels (columns) toggle grid:

|              | Bell | E-Mail | Discord |
|---|---|---|---|
| Neue Nachricht (Ticket Antwort) | ✓ | ✓ | ✓ |
| Rechnung erstellt | ✓ | ✓ | — |
| Kursfreischaltung | ✓ | ✓ | ✓ |
| Termin erstellt / geändert | ✓ | ✓ | ✓ |
| Termin-Erinnerung (24h / 1h) | ✓ | ✓ | ✓ |
| Affiliate-Provision freigegeben | ✓ | ✓ | — |
| Community Post (News/Erfolge) | ✓ | — | — |

Plus settings:
- Ruhezeiten: keine Discord-DMs zwischen 22:00–08:00 (Toggle + time-range picker)
- Marketing-Newsletter: separate explicit consent toggle (opt-in only — legal requirement)

---

### 4.25 Profil — Sicherheit

- **Route**: `/student/profil/sicherheit`
- **Phase**: 1 (password change) → 14 (2FA + sessions)
- **Plan-gate**: none

Sections:

**Passwort ändern**
- Aktuelles Passwort · Neues Passwort · Bestätigen
- HIBP check on new password
- On success: notification "Dein Passwort wurde geändert" via all channels + invalidate all other sessions

**Zwei-Faktor-Authentifizierung (2FA)**
- TOTP enrollment via Supabase Auth MFA
- QR code + manual setup key
- Recovery codes (10, single-use, downloadable as txt)
- Disable 2FA requires re-auth

**Aktive Sitzungen**
- Table: Gerät · Browser · Standort (geolocated from IP, opt-in) · Letzte Aktivität · "Abmelden" button per row
- "Von allen anderen Geräten abmelden" master button

---

### 4.26 Profil — Datenschutz

- **Route**: `/student/profil/datenschutz`
- **Phase**: 11
- **Plan-gate**: none

Per DSGVO requirements:

**Meine Daten exportieren** (Auskunft)
- "Datenexport anfordern" button → kicks off async job → emails the user a download link within 24h
- Format: ZIP containing JSON (all DB records) + PDFs (their invoices/certificates) + Storage files (their uploads)

**Konto löschen** (Recht auf Vergessenwerden)
- "Löschung beantragen" button → modal with consequences explained (invoices retained 10 years per GoBD, but PII scrubbed; Discord roles preserved; affiliate referrals attributed to a generic "Ehemaliger Affiliate")
- Reason field (free text)
- Submits to admin queue for review (not auto-deleted — admin reviews for refund/dispute conflicts)
- Status indicator: "Anfrage in Bearbeitung" or "Anfrage abgelehnt (Grund: …)"

**Marketing-Einwilligung**
- Single toggle: "Ich möchte Marketing-E-Mails erhalten."
- Revoking adds email to global suppression list

**Einwilligungsverlauf**
- Read-only table of every consent event: timestamp + what was consented to + IP + user-agent

---

### 4.27 Benachrichtigungen — full list

- **Route**: `/student/benachrichtigungen`
- **Phase**: 4
- **Plan-gate**: none

Full paginated list (50/page). Filter chips: Alle · Ungelesen · Pro Kategorie.

Each row: icon (event type) · title · body · time-ago · deep-link · "Als gelesen markieren" / "Löschen".

"Alle als gelesen markieren" bulk action.

---

## 5. Checkout (outside `/student/`)

- **Route**: `/checkout`
- **Phase**: 3 (Stripe wired, PayPal added) → 12 (Stripe Tax + invoice gen) → 13 (Widerruf waiver)

Steps (single page, accordion if needed):

1. **Warenkorb** — line items, quantity adjust, remove, upgrade detection (if cart includes higher-tier plan of already-owned product, render upgrade-pays-difference math: "Upgrade von Fast → Business: Du zahlst nur die Differenz (800 €)")
2. **Rechnungsdaten** — Privat vs Firma toggle:
   - Privat: Adresse · Telefonnummer · Land · Stadt
   - Firma: + Firmenname · USt-ID (validated via VIES through Stripe Tax for reverse-charge)
3. **Zahlung** — Stripe (card / SEPA / Apple Pay / Google Pay) · PayPal · Krypto (manual)
4. **Giftcard einlösen** — code field, applies balance, shows discounted total
5. **Steuer** — auto-calculated: VAT line OR "Reverse-Charge nach §13b UStG" note for valid B2B-EU
6. **Rechtliches** — two mandatory checkboxes:
   - "Ich akzeptiere die AGB und Datenschutzbestimmungen."
   - **Widerruf waiver**: "Ich willige ausdrücklich ein, dass die Ausführung des Vertrages vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass mein Widerrufsrecht mit Beginn der Ausführung erlischt."
7. **Zusammenfassung + Bezahlen** — totals breakdown, primary CTA

On success → `/checkout/success` with order ref, entitlements granted, redirect to `/student` in 5 seconds.

---

## 6. Phase-by-phase build order for student dashboard

Maps directly to `CRM_SPEC.md` phases. Each page lands in the listed phase — don't build out of order.

| Phase | Student pages that land |
|---|---|
| **1 — Foundation + Firebase removal** | `/student`, `/student/kurse`, `/student/kurse/[courseId]` (basic), `/student/profil` (basic edit + persönliche Daten), `/student/profil/sicherheit` (password only) |
| **2 — Tickets** | `/student/support`, `/student/support/neu`, `/student/support/[ticketId]` |
| **3 — Payments hardened** | `/checkout` (full flow with PayPal), `/student/profil/rechnungen` (with PDF download) |
| **4 — Notifications** | `<NotificationBell>` in top bar, `/student/benachrichtigungen`, `/student/profil/benachrichtigungen` |
| **5 — Sessions & Creator program** | `/student/termine`, `/student/termine/[sessionId]`, `/student/creator/**`, `/student/profil/termine-einstellungen` |
| **6 — Affiliate full loop** | `/student/affiliate`, `/student/affiliate/leaderboard`, `/student/affiliate/materialien` |
| **7 — Discord bot** | `/student/profil/discord` |
| **8 — CMS modules** | `/student/community/**`, `/student/interviews/**`, `/student/giftcards`, `/student/profil/zertifikate` |
| **11 — DSGVO Foundation** | `/student/profil/datenschutz`, cookie consent banner (site-wide), consent-gated livechat load |
| **12 — Tax & Invoicing** | Invoice PDF generation + Lexoffice integration (visible in `/student/profil/rechnungen`) |
| **13 — Refunds & Widerruf** | Widerruf checkbox in checkout, refund request flow in `/student/profil/rechnungen` (if you choose to expose it customer-side) |
| **14 — Security Hardening** | 2FA TOTP enrollment in `/student/profil/sicherheit`, active sessions table, brute-force-protected login |
| **15 — Video provider migration** | Course player upgraded to Bunny Stream (replaces any Firestore/Supabase Storage video URLs in `/student/kurse/[courseId]`) |
| **16 — Reliability** | No new pages — Sentry instrumentation across all student routes |

---

## 7. What the student does NOT see — explicit list

Avoid accidentally exposing these:

- Admin-only internal notes about them (`admin_notes` table)
- Other customers' real names anywhere (leaderboard uses usernames only)
- The audit log
- Mentor's private session notes (only `notes_shared = true` ones surface)
- Pricing of products they don't own (visible on public marketing pages, hidden inside dashboard)
- Other admins' actions in the system
- Drizzle Studio / Supabase dashboard URLs (admin-only)
- Stripe webhook payloads / raw transaction logs
- Error stack traces (Sentry-side only, generic message to user)
- Server logs (Axiom-side)

---

## 8. Component contracts to define before Phase 1 lands

When Claude Code builds Phase 1's customer 360 admin page, ask it to also stub these shared student-dashboard components so Phases 2-15 reuse them:

| Component | Stub now? | Reason |
|---|---|---|
| `<DashboardShell>` | Yes | Wraps every student page |
| `<SidebarNav>` | Yes | Entitlement-aware nav rules live here |
| `<EmptyState>` | Yes | Used across all "no data yet" pages |
| `<ProductCard>` | Yes | Übersicht + Kurse list |
| `<NotificationBell>` | Stub only (no realtime yet) | Top bar always shows it |
| `<SessionCard>` | No | Phase 5 work |
| `<PlanBadge>` | Yes | Visible from Phase 1 onward |
| `<MeetingTypeIcon>` | No | Phase 5 work |
| `<GiftcardCode>` | No | Phase 8 work |

Stubbing means: build the component with the right props interface, render placeholder content. Future phases plug in real data without changing the integration surface.

---

## 9. Acceptance criteria — the meta-version

Before declaring the student dashboard "complete" (end of Phase 16 / launch readiness):

- [ ] Every section in §1 sitemap is reachable
- [ ] Every page in §4 has its acceptance criteria green
- [ ] Sidebar respects all entitlement/role rules in §3
- [ ] All copy is German, tone consistent with existing marketing pages
- [ ] All routes pass `npm run type-check && npm run lint && npm run build`
- [ ] All routes are wrapped in `requireAuth()` (or `requireAdmin()` for admin variants)
- [ ] All user-facing PDFs include the legal mandatory fields
- [ ] All user inputs validated by Zod at the route boundary
- [ ] All audit-loggable customer actions (refund request, account deletion request, password change, 2FA toggle) write `audit_log` rows
- [ ] All real-time features (notification bell, ticket thread updates, community feed) use Supabase Realtime with RLS-scoped subscriptions
- [ ] AgentShield scan returns zero critical findings
- [ ] Lighthouse Performance ≥ 85 / Accessibility ≥ 95 / Best Practices ≥ 90 / SEO N/A (logged-in pages)
- [ ] Manual end-to-end smoke: new user registers → empty Übersicht → buys AI Fast → sees course → completes module → opens ticket → admin replies → bell fires → ticket marked resolved
