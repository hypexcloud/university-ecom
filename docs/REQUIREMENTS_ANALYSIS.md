# Requirements Analysis & Gap Catalog — University Ecom

**Purpose**: every requirement from the client's Lastenheft, slotted into a proper category, with the **gaps the client didn't think about** flagged. Use this as the bridge between [`LASTENHEFT.md`](./LASTENHEFT.md) (immutable client wishlist) and [`CRM_SPEC.md`](./CRM_SPEC.md) (implementation roadmap).

## How to read this doc

Each category lists:
- **From Lastenheft** — what the client explicitly asked for, with a §-style anchor back to the original section.
- **[GAP]** — things the client didn't mention but the platform genuinely needs to function correctly.
- **[LEGAL]** — non-negotiable in Germany / EU. Skipping these is not a tradeoff, it's a liability.
- **[RECOMMENDED]** — strong professional advice, not legally required, but you'll regret not having it.
- **Priority**: P0 (blocker), P1 (revenue/UX), P2 (full coverage), P3 (nice-to-have).

When a [GAP] / [LEGAL] item is also a build phase in `CRM_SPEC.md`, that's noted. Anything **not yet in CRM_SPEC.md** should be folded in before you start building — I've added a short list at the end (§24).

---

## Category overview

| # | Category | Lastenheft coverage | Gaps |
|---|---|---|---|
| 1 | Identity & Access | Partial | 2FA, email verification, session policy, password rules |
| 2 | Customer 360 / CRM core | Partial | Tags, segments, lifecycle stages, search, bulk ops |
| 3 | Products & Plans | Yes | Plan versioning, archived plans, currency, locale price |
| 4 | Commerce / Checkout | Yes | Abandoned cart, address validation, VAT calc, fraud signals |
| 5 | Billing documents | Yes | GoBD compliance, sequential invoice numbers, credit notes |
| 6 | Entitlements, upgrades, **refunds** | Partial (no refunds) | **Widerruf 14 days**, chargebacks, partial refunds |
| 7 | Scheduling / Mentoring | Yes | Mentor role distinct from admin, no-show policy, recordings |
| 8 | Creator program | Yes | Briefing review workflow, deliverables, no-show policy |
| 9 | Tickets | Yes | SLA, escalation, canned responses, internal notes per ticket |
| 10 | Communications | Yes | Email preferences, unsubscribe (CASL/CAN-SPAM/DSGVO), bounces |
| 11 | Discord integration | Yes | OAuth linking, role conflict, unlink, account-change handling |
| 12 | Affiliate | Yes | Anti-self-referral, payout proof, 1099-equivalent / EU rules |
| 13 | Community / Content CMS | Yes | Moderation, abuse reports, scheduled posts |
| 14 | Video hosting | "Vercel Storage" | **Vercel Storage isn't a video product** — needs Mux/Bunny/Cloudflare Stream |
| 15 | Course content | Implicit | Drip release, module gating, quiz, completion rules |
| 16 | Analytics & Reporting | Yes | Cohorts, LTV, refund rate, MRR if recurring |
| 17 | Marketing automation | — | Drip onboarding, abandoned cart, win-back |
| 18 | Admin operations | Partial | Impersonation, feature flags, bulk tools, maintenance mode |
| 19 | **Compliance (DSGVO/GoBD/Widerruf)** | — | **Most critical missing block — covered in §19** |
| 20 | Security | — | 2FA admin, webhook verification, rate limits, CSP, secret hygiene |
| 21 | Reliability / ops | — | Backups, Sentry, uptime, staging env, runbooks |
| 22 | Performance / SEO / A11y | — | Core Web Vitals, sitemap, structured data, WCAG / BITV |
| 23 | Design system / brand | Yes | Tokens, dark-mode formalization, A11y contrast verification |

---

## 1. Identity & Access Management

**From Lastenheft**: Email + password registration; fields = Vorname, Nachname, Email, Passwort, Discord, WhatsApp; password reset by email; explicitly **no** Google/Apple/Magic Link; 3 admins with per-module permissions (Kunden, Produkte, Zahlungen, Affiliate, Tickets, Videos, Analytics).

**[GAP] P0**: Email verification before first purchase. Without it, you're at risk of fake accounts farming affiliate referrals or abusing free dashboard previews.

**[GAP] P0 — Security**: Password rules (min length, breach check via Have-I-Been-Pwned). Supabase Auth gives you the minimum (configurable in dashboard); add a HIBP check at signup.

**[GAP] P0 — Security**: **2FA mandatory for admins**. TOTP (Google Authenticator / 1Password). Supabase Auth MFA supports TOTP factors natively. Non-negotiable when admins can grant entitlements / move money.

**[GAP] P1**: Session policy — idle timeout (e.g. 12 h customer, 4 h admin), force-logout on password change, "see active sessions" page.

**[GAP] P1**: Account deletion request flow (separate from suspend) — required by DSGVO, see §19.

**[GAP] P2**: Admin impersonation with audit ("Login as Max Mustermann") — invaluable for support; risky if not audited.

**[RECOMMENDED] P2**: Login anomaly detection (new device / new country email).

---

## 2. Customer 360 / CRM core

**From Lastenheft**: Internal admin notes (admin-only), suspend user, grant/revoke products, manage Discord roles, issue certificates.

**[GAP] P0**: **Customer search** by email, name, Discord, WhatsApp, phone, order ID, invoice number. Sounds obvious but is missing from the current `/admin/benutzer` skeleton.

**[GAP] P1**: **Tags & segments** — admin-defined tags ("Whale", "Refund risk", "VIP", "EU-B2B"). Drives email targeting and saved filters.

**[GAP] P1**: **Lifecycle stage** — Lead (registered, no purchase) → Customer (any paid product) → Power user (≥2 products) → Inactive (no login 30+ days) → Churned (all entitlements revoked / refunded). Computed daily.

**[GAP] P1**: **Bulk operations** — bulk grant/revoke, bulk email, bulk role-sync (CSV upload optional). Currently nothing supports this.

**[GAP] P2**: **Activity timeline** per customer — every order, ticket, session, login, Discord link, admin action. Beats reading 5 tabs.

**[RECOMMENDED] P2**: Saved filter views ("All Business plan customers in DACH", "Open tickets > 48 h", "Affiliate referrals last 30 d").

---

## 3. Products, Plans & Pricing

**From Lastenheft**: AI Kurs + Dropshipping Kurs, each with Fast/Business/Infinity (same names, different content). TikTok Creator 75 €, YouTube Creator 100 €. Giftcards. Admins can edit products, prices, add extras.

**[GAP] P1**: **Plan versioning**. If you raise the price of "Business" from 1000 € to 1200 €, existing customers stay at their grandfathered price and refunds use the price they paid. Without versioning this breaks the upgrade-pays-difference rule.

**[GAP] P1**: **Archived (not deleted) plans**. Pulling a plan from sale must not break historical reporting.

**[GAP] P2**: **Locale-aware pricing** — same price in EUR, but symbol/locale formatting in German vs. English. Stub now; cheap insurance for an English launch later.

**[GAP] P2**: **Coupons / discount codes** — separate from giftcards. The client didn't ask but you'll want one for Black Friday or affiliate exclusives. At minimum: code, percent or fixed, applies to specific plans, valid window, max uses.

**[RECOMMENDED] P3**: Bundle pricing (e.g. "AI + Dropshipping" combo discount).

---

## 4. Commerce: Cart, Checkout, Payments

**From Lastenheft**: Multi-product cart (e.g. AI + Creator + Giftcard); payments via Stripe, PayPal, Krypto (manuelle Freischaltung); registration before purchase allowed.

**[GAP] P0 — Security**: **Stripe webhook signature verification** — the existing webhook handler should already be doing this; verify it does (see `src/app/api/webhooks/stripe/route.ts`). PayPal IPN / webhook needs the equivalent.

**[GAP] P0 — Tax**: **VAT calculation** at checkout. EU sells to EU consumers means VAT at destination rate. EU-B2B with valid VAT ID = reverse charge (no VAT). Non-EU = no VAT but show "VAT-free". Use Stripe Tax (built-in, costs 0.5 %) or roll with `valdit` / VIES validation. See §19 for the legal side.

**[GAP] P0**: **Abandoned cart capture** — store the cart on registration. Email after 1 h / 24 h / 72 h. Standard, easy revenue.

**[GAP] P1**: **Address validation** — at minimum, validate country/postal-code shape. Optional: Google Places autocomplete.

**[GAP] P1**: **Fraud signals** — Stripe Radar default rules + flag high-risk orders for admin review.

**[GAP] P1 — Crypto specifics**:
- Which chains? BTC, ETH, USDT-TRC20, USDT-ERC20?
- Manual or automated? "Manuelle Freischaltung" suggests manual, but you still need an on-chain address per order and a confirmation threshold.
- Recommended: use a payment processor (NOWPayments, BTCPay Server self-hosted, Coinbase Commerce) — never accept raw wallet sends without a payment processor; reconciliation is hell.

**[RECOMMENDED] P2**: **SEPA Lastschrift** (direct debit) — popular in Germany, common ask once you launch.

---

## 5. Billing Documents (Invoices, Giftcards, Certificates)

**From Lastenheft**: Auto-generated invoices, PDF download from dashboard. Private fields: Adresse, Telefonnummer, Land, Stadt. Company fields: Firmenname, USt-ID. Giftcards = code + email + redeem at checkout + balance/status. Certificates = admin issues PDF with Name/Kurs/Datum.

**[LEGAL] P0 — GoBD compliance (Germany)**:
- **Sequential, gap-free invoice numbers**. No deletion. If you cancel an invoice, issue a **Storno-/Gutschriftrechnung** (credit note) with a new number.
- **Invoice immutability** — once issued, you cannot edit. Corrections via credit note.
- **10-year archival** — all invoices must be preserved 10 years. Lexoffice (the GoBD-certified legal record) handles this. Mirror PDFs to the Supabase Storage `invoices` bucket (private, signed URLs) with SHA-256 checksum as a belt-and-braces backup; configure the bucket policy to prevent admin deletion.
- **Required fields**: full name + address of seller (Impressum data), full name + address of buyer, tax ID (St.-Nr. or USt-IdNr.), invoice date, supply date, sequential number, description, net amount, VAT rate, VAT amount, gross amount. If reverse-charge: explicit note "Steuerschuldnerschaft des Leistungsempfängers".
- **Kleinunternehmer** (§19 UStG): if you qualify, no VAT line, with a §19 note. Configurable per legal entity.

**[GAP] P1**: **Invoice number sequence** must be configurable (yearly reset like `INV-2026-000123` is allowed; just be consistent and gap-free).

**[GAP] P1 — Giftcards**:
- Expiration policy (German law: gift vouchers expire after 3 years from end-of-year of issue if not otherwise stipulated, but you can set a clear policy in T&Cs).
- Partial redemption + remaining balance tracking.
- Tax treatment: **Einzweckgutschein** (single-purpose, taxed at issue) vs **Mehrzweckgutschein** (multi-purpose, taxed at redemption). Yours is likely multi-purpose (any product) — confirm with accountant.
- Refund policy: are they refundable? German consumer law typically says no for "consumed" portions.
- Anti-fraud: rate-limit code-redemption attempts, log attempts, treat as cash.

**[GAP] P2 — Certificates**:
- Verification mechanism — QR code on the PDF → public verification URL → shows hash matches.
- Revocation — admin can revoke an issued certificate; verification URL then shows "revoked".
- Template editable in admin (so you can change wording per course).

---

## 6. Entitlements, Upgrades & **Refunds**

**From Lastenheft**: Upgrades pay only the difference (Fast 200 € → Business 1000 € = pay 800 €). No refund flow mentioned.

**[LEGAL] P0 — Widerrufsrecht** (Germany / EU): consumer has **14-day right of withdrawal** for online purchases. Critical caveats for digital products:
- You can waive the Widerruf for digital content **if** you have explicit informed consent at checkout ("Ich willige ein, dass die Ausführung vor Ablauf der Widerrufsfrist beginnt. Ich verzichte hiermit auf mein Widerrufsrecht.") **and** you confirm this in the order confirmation email.
- Without that explicit waiver, customer can withdraw within 14 days for any reason → full refund → revoke entitlements.
- B2B customers (with USt-ID): no Widerruf required.

**[GAP] P0**: **Refund flow**:
- Customer-initiated request (button in dashboard) → admin review queue → admin approves → Stripe/PayPal refund issued → entitlements revoked → credit note (Storno) generated → audit log.
- Partial refunds possible (e.g. 800 € upgrade refunded but original 200 € stays).
- Refund tied to chargeback (Stripe pushes the event) — auto-revoke entitlement, notify admin.

**[GAP] P1**: **Cancellation policy for sessions** — Business plan customer who skips a session loses it, or gets re-issued? Define.

**[GAP] P1**: **Entitlement audit trail** — every grant/revoke with reason, who, when. Already covered by `audit_log`.

---

## 7. Scheduling & Mentoring

**From Lastenheft**: Admins assign sessions; customer accepts/rejects/proposes alternative; Zoom/Meet/Discord. Business + Infinity get 1:1.

**[GAP] P0 — RESOLVED**: **Mentor role**. The legacy Firestore schema we're porting has `mentorId` on enrollments. Question was: is every admin a mentor, or are there mentors who aren't admins? **Decision**: model mentor as a permission flag on `admin_permissions.perms.mentor`. Split into a separate table later if non-admin mentors are hired. Original analysis below:
- Option A: Mentors are admins with `mentor` flag in `admin_permissions`.
- Option B: Mentors are a separate `mentors` table with their own login.
- Recommendation: A, until headcount grows.

**[GAP] P1**: **Conflict detection** — admin can't schedule a session that overlaps with another or with their declared availability.

**[GAP] P1**: **No-show & late-cancel policy** — what if customer doesn't show? Auto-mark as "missed", optional re-issue, optional charge.

**[GAP] P1**: **Calendar export** (.ics) for customers — add to their personal calendar.

**[GAP] P1**: **Reminder cadence** — email + Discord DM at 24 h and 1 h before. Currently a cron exists (`/api/cron/session-reminders`); verify it covers this.

**[GAP] P2**: **Session notes** — mentor's private notes, customer's view-only summary post-session.

**[GAP] P2 — Recordings**:
- Where stored (Zoom cloud / your storage)?
- Who can rewatch (just customer, or anyone with the entitlement)?
- DSGVO consent before recording (explicit, recorded).
- Retention policy.

---

## 8. Creator Program

**From Lastenheft**: 2 calls auto-scheduled (first Friday after purchase + 1 month later). Briefing form with 9 fields + optional file upload. Dashboard sections: Zoom Bereich, Briefing Bereich, Fortschritt, Termine.

**[GAP] P1**: **Auto-schedule edge cases** — first Friday already passed? Use next. Account for German public holidays (skip Karfreitag etc.). Bank holiday calendar in `date-fns-holiday-de` or hard-coded.

**[GAP] P1**: **Briefing review workflow**:
- Status: draft → submitted → in review → ready for call.
- Admin can comment.
- Customer can update before "submitted".

**[GAP] P2**: **Deliverables tracker** — what was promised in the call (e.g. 2 video scripts), did the mentor deliver?

**[GAP] P2**: **Progress metrics**:
- TikTok: connect TikTok API → pull follower count, views, watch-time?
- YouTube: same via YouTube Data API.
- If too much: manual self-report fields the customer updates weekly.

---

## 9. Tickets & Customer Support

**From Lastenheft**: Categories (Support/Hilfe/Feedback/Kursfrage/Affiliate/Creator/Technisches Problem), statuses (Offen/In Bearbeitung/Geschlossen). Livechat "zusätzlich integrieren".

**[GAP] P1**: **SLA targets** per category. E.g. Technisches Problem = 4 h response, Feedback = 48 h. Display in admin queue: green/yellow/red.

**[GAP] P1**: **Assignment & escalation**:
- Auto-assign by category to the admin with permission.
- Round-robin if multiple eligible.
- Escalate to "admin owner" after Xh unanswered.

**[GAP] P1**: **Canned responses** — admin-editable library.

**[GAP] P1**: **Internal-only messages** in a ticket thread (admin notes other admins see, customer doesn't). Already in `ticket_messages.is_internal`.

**[GAP] P2**: **Customer satisfaction** — after ticket closed, single-question rating + comment (CSAT). Feeds analytics.

**[GAP] P2**: **Auto-categorization** — first message keyword detection ("rechnung" → Support; "auszahlung" → Affiliate). Reduces customer-misclassified tickets.

**Livechat** — explicit recommendations:
- **Crisp** (Berlin-based, German, EU-hosted, GDPR-friendly).
- **Tawk.to** (free, but data hosted in US).
- **Userlike** (German, premium).
- Recommend Crisp.

---

## 10. Communications & Notifications

**From Lastenheft**: Bell (dashboard), email, Discord bot. Events: neue Nachricht, Ticket-Antwort, Rechnung, Kursfreischaltung, Termine.

**[LEGAL] P0**: **Marketing vs transactional separation**.
- Transactional emails (order confirmation, ticket reply, invoice) can be sent without consent.
- Marketing emails (newsletter, win-back, promo, drip onboarding **if not strictly tied to the purchase**) require **opt-in consent** (Double-Opt-In is the German standard) per UWG/DSGVO. Every marketing email must include a one-click unsubscribe and link to imprint.
- Maintain a **consent log** (when, IP, what they consented to). Critical if challenged.

**[GAP] P0 — Email infra**:
- **SPF, DKIM, DMARC** records configured at the domain. Resend handles the DKIM signing; you still need to publish DNS records.
- **Bounce / complaint handling** — Resend webhooks → mark email as bounced → don't retry → suppression list.
- **Unsubscribe link** in marketing emails, suppression list honored.
- **List-Unsubscribe** header for one-click in Gmail/Apple Mail.

**[GAP] P1**: **Notification preferences page** — per event, per channel (bell on/off, email on/off, Discord on/off). Already mentioned in CRM_SPEC Phase 4.

**[GAP] P1**: **Quiet hours** — no Discord DM 22:00–08:00 user-local-time. Tiny detail, big trust boost.

**[GAP] P2**: **In-app announcement banner** — admin can publish a dismissable banner ("Server-Wartung Sonntag 02:00–04:00").

**[RECOMMENDED] P2**: **Push notifications via PWA** — install-prompt for the dashboard, push for new ticket / session reminder.

---

## 11. Discord Integration

**From Lastenheft**: Auto-role assign on purchase (Fast/Business/Infinity/TikTok/YouTube/Affiliate); multiple roles; Lifetime; manual removal; bot DM "Du hast eine neue Nachricht…".

**[GAP] P0**: **OAuth linking flow**. The Lastenheft has Discord *username* at registration — usernames change. You need the **Discord User ID** (snowflake). Implement OAuth flow on customer profile: "Discord verbinden" → consent → store `discord_user_id`. Username is for display only.

**[GAP] P1**: **Role sync resilience**:
- Bot offline when entitlement granted → queue → retry.
- Customer leaves the server → bot detects on rejoin → re-assigns roles.
- Admin manually removes role → mirror in your DB or log it; don't fight the admin.
- User unlinks Discord → keep roles (Lifetime), but stop DMs.

**[GAP] P1 — Bot hosting**: Discord bot needs a long-running gateway connection. **Vercel won't work.** Options:
- Railway / Fly.io / Hetzner — small Node service.
- Discord HTTP-only interactions (slash commands only, no gateway) — sufficient if you only need slash + role-mgmt (no DM listening). Cheaper, runs on Vercel via webhooks.
- Recommendation: HTTP-only if you can avoid listening to DMs; gateway worker if you need full bot.

**[GAP] P2**: **Channel-gated content** — Fast role sees #fast-kurs, Business role sees #business-mentoring, etc. Roles drive channel permissions in Discord — set up once via Discord server config, not your code.

**[RECOMMENDED] P2**: **Slash commands** in Discord — `/status` shows the user their current entitlements; `/ticket` opens a ticket.

---

## 12. Affiliate System

**From Lastenheft**: 15 % commission after successful purchase; manual payout 1st of month; dashboard with Referral Link, Verkäufe, Provision, Statistik; Leaderboard with username (no real names), monthly top-3 rewards.

**[LEGAL] P1**: **Tax treatment of payouts**.
- DE residents: affiliate income is taxable (Sonstige Einkünfte / Gewerbe). You collect their tax info (Steuer-ID) once payout exceeds threshold; issue a `Gutschrift` for the commission.
- EU residents: reverse-charge rules.
- Non-EU: simpler, just pay.
- Discuss with accountant — you may need a "Affiliate-Vertrag" they accept at signup.

**[GAP] P1**: **Anti-self-referral & abuse rules**:
- Same customer can't use own referral.
- Same IP / browser fingerprint → don't credit.
- Refund a referred order → claw back commission.
- Chargeback → claw back commission.

**[GAP] P1**: **Payout proof** — admin uploads bank confirmation / Stripe Connect transfer ID. Customer sees "paid on 2026-06-01, reference XYZ".

**[GAP] P1**: **Cookie window** — how long does the referral cookie live? Standard 30 / 60 / 90 days. Define.

**[GAP] P1**: **Attribution rules**:
- First-touch vs last-touch (last-touch is the norm for affiliate).
- If user already has the cookie and clicks another affiliate's link, who wins? Last-click overwrites.
- If user is already logged in and registered before any referral, no attribution.

**[GAP] P2**: **Leaderboard period boundaries** — monthly reset (Berlin time). Crystal-clear cutoff in the UI.

**[GAP] P2**: **Affiliate marketing assets** — banner library, swipe copy, UTM-tagged links generator. Increases affiliate activation.

**[RECOMMENDED] P3**: **Stripe Connect** for affiliate payouts — automates KYC and tax forms. Worth it once you have > 20 active affiliates.

---

## 13. Community, Interviews & Kundenerfolge CMS

**From Lastenheft**: Community = News/Updates/Ankündigungen/Erfolge (admin CRUD). Interviews = video upload, reorder, edit, delete, category. Kundenerfolge = images/videos/revenue screenshots/social growth/testimonials, slideshow 10+.

**[GAP] P1**: **Scheduled publishing** — admin writes a post Friday, schedules for Monday 09:00.

**[GAP] P1**: **Draft / preview** before publish.

**[GAP] P2**: **Moderation** — if customers can ever react / comment in future, you need abuse-report + moderation queue. Easier to scaffold now even if read-only today.

**[GAP] P2**: **DSGVO for Kundenerfolge**:
- Every testimonial / revenue screenshot featuring an identifiable person needs **signed consent**.
- Revenue screenshots showing third-party data (Stripe dashboard etc.) — verify nothing identifies others.
- Storage of signed consent forms.

**[GAP] P2**: **Content versioning** — old version preserved when an admin edits a post.

---

## 14. Video Hosting & Content Protection

**From Lastenheft**: "**Vercel Storage**" + geschützte URLs + Download erschweren + Login erforderlich.

**[GAP] P0 — Reality check**: Vercel Storage is **Blob/KV/Postgres/Edge Config** — none of these are video hosting. Video hosting needs streaming, transcoding, signed delivery. You almost certainly need a real product:

| Option | Pro | Con |
|---|---|---|
| **Mux** | Best DX, signed playback, analytics, German DPO | Expensive at scale ($) |
| **Bunny Stream** | Cheap, EU-friendly, signed URLs | Smaller feature set |
| **Cloudflare Stream** | Cheap, fast, global | Less learning-platform-y |
| **AWS MediaConvert + CloudFront + signed cookies** | Cheapest at huge scale | Build & maintain it yourself |
| **Supabase Storage with direct streaming** | Already in stack | No transcoding, no adaptive bitrate, file-size caps, easy to scrape — fine for PDFs and briefings, not video |

**Recommendation**: **Bunny Stream** for the price/EU posture, **Mux** if budget allows. Push the decision to the client — but tell them "Vercel Storage" isn't a thing.

**[GAP] P0**: **Real signed URLs** — short-lived (5 min), single-IP-bound, single-session token. Token issued by your server only to authenticated users with the right entitlement.

**[GAP] P1**: **Forensic watermarking** — overlay viewer email + timestamp in the player. Bunny/Mux both support. Doesn't stop piracy, deters it.

**[GAP] P1**: **Adaptive bitrate streaming (HLS/DASH)** — required for anyone watching on mobile.

**[GAP] P2**: **Captions / subtitles** — auto-generate with the provider's STT (Mux Captions, etc.), allow admin editing.

**[GAP] P2**: **DRM** (Widevine / FairPlay / PlayReady) — actual encryption. Pricey, complex. Skip until piracy is proven.

**[RECOMMENDED] P3**: **Concurrent stream limit** — same account playing on 4 devices at once = blocked. Token-bound delivery makes this easy.

---

## 15. Course Content & Progress

**From Lastenheft**: Implicit — "Kursvideos, Dashboard, Downloads, Discord, Community" per plan. No mention of drip-release, gating, quizzes.

**[GAP] P1 — Drip release**: Should week 2 content unlock automatically 7 days after enrollment, or be available immediately? Define per plan. Mentor sessions in Business unlock the next module on completion?

**[GAP] P1 — Module gating**: 
- Time-based: unlock at +7 days.
- Sequential: must complete prior module.
- Mentor-gated (Business): unlocked after specific session marked complete.

**[GAP] P1 — Resources**: PDFs / templates downloadable. Watermark each download with the customer's email to deter sharing.

**[GAP] P2 — Quizzes**: Schema partially exists (`CourseModule.quiz`). Decide passing score, retry policy, certificate dependency.

**[GAP] P2 — Completion → certificate**: Auto-issue certificate when X% modules complete + all quizzes passed? Or always admin-issued (Lastenheft says admin-only)?

---

## 16. Analytics & Reporting

**From Lastenheft**: Umsatz, Kunden, Conversion, Tickets, Affiliate, Verkäufe, Creator-Daten, Termine, Statistiken.

**[GAP] P1 — Standard metrics not in Lastenheft**:
- **Refund rate** by cohort / plan / mentor.
- **LTV** per customer / plan.
- **CAC** if you track ad spend (manual entry suffices early).
- **MRR / ARR** if any recurring product (none today, but giftcards or future subscriptions).
- **Cohort retention** — % of Jan-2026 cohort still active in May.
- **Conversion funnel** — pageview → register → checkout-started → paid.
- **Affiliate ROI** — what's the commission cost per €1 of new revenue?

**[GAP] P1**: **Per-mentor performance** — sessions delivered, ratings, completion rate of their students.

**[GAP] P1**: **CSAT** (from §9), NPS quarterly survey.

**[GAP] P2**: **Export to CSV / Excel** on every chart. Admins will want it.

**[GAP] P2**: **Saved dashboards** — admin pins their favorite views.

**[RECOMMENDED] P3**: **PostHog** (EU instance) or **Plausible** for product analytics on the public site (already a German favorite — cookie-free).

---

## 17. Marketing & Lifecycle Automation

**From Lastenheft**: nothing explicit. But you'll need automation to actually move revenue.

**[GAP] P1 — Drip onboarding** (per product):
- Day 0: welcome + how to start.
- Day 1: first content nudge.
- Day 3: invite to Discord (if not joined).
- Day 7: check-in / first session reminder (Business).
- Day 14: testimonial request if progress > 30 %.

**[GAP] P1 — Abandoned-cart sequence** (§4 already mentioned).

**[GAP] P2 — Win-back**: 30 / 60 / 90 days post-last-login → re-engagement email.

**[GAP] P2 — Upgrade nudge**: Fast customer at 80 % completion → "Time to go Business?" email.

**[RECOMMENDED]**: Resend supports campaigns natively now; or wire a tiny scheduler. Don't over-engineer.

---

## 18. Admin Operations & Audit

**From Lastenheft**: Edit products & prices, add extras, unlock content, suspend users, issue certificates, internal notes, manage Discord roles, revoke products.

**[GAP] P0 — Audit log** (already in CRM_SPEC.md `audit_log` table): every admin write action. Searchable, exportable.

**[GAP] P1 — Impersonation** ("Login as user") — gold for support. Must be audited; banner visible in customer view ("Admin Anna ist als Max eingeloggt").

**[GAP] P1 — Maintenance mode** — feature flag flips a public banner + checkout disable.

**[GAP] P1 — Feature flags** — gradual rollouts (e.g. new dashboard for 10% first). Use Vercel Edge Config or a self-hosted Unleash.

**[GAP] P2 — Admin onboarding & off-boarding**: when admin #3 leaves, what gets revoked? Checklist + automation.

**[RECOMMENDED] P2**: Slack/Discord channel alerts on critical admin actions (refund > 500 €, user suspended, mass entitlement revoke).

---

## 19. Compliance & Legal (DSGVO / GoBD / Widerruf) — **NON-NEGOTIABLE**

The client mentioned **none of this**. You cannot launch without it.

### 19.1 DSGVO / GDPR

**[LEGAL] P0**:
- **Privacy policy** (`/legal/datenschutz`) — already exists, **must be reviewed against current data flows**. Must enumerate: every sub-processor (Stripe, PayPal, Resend, Supabase, Vercel, Discord, Bunny Stream, Lexoffice, Crisp, Plausible, Sentry, Upstash, Railway), data categories, retention, basis (Art. 6 GDPR), data subject rights.
- **Impressum** — already exists, verify against §5 TMG.
- **Cookie consent** banner — **TTDSG** requires opt-in for non-essential cookies (analytics, marketing). Recommended: **Cookiebot**, **Usercentrics**, or self-rolled minimal consent UI. Block any tracker until consent.
- **AVV / DPA** signed with every sub-processor. Stripe, Resend, Supabase, Vercel, Discord, Bunny, Lexoffice, Sentry — all have downloadable DPAs. Keep PDFs in `docs/legal/dpas/`.
- **Data subject rights flow** in customer profile:
  - **Auskunft** (data export) — one-click; emails them all their data within 30 days.
  - **Berichtigung** (correction) — edit profile.
  - **Löschung** (deletion / right to be forgotten) — flow with admin review (because of tax retention conflicts — see GoBD).
  - **Widerspruch** (objection to processing for marketing) — unsubscribe + flag.
- **Records of processing activities** (Art. 30) — Excel sheet, internal, kept up to date.
- **Breach response plan** — 72 h notification window. Drafted runbook in `docs/INCIDENT_RESPONSE.md`.
- **EU data residency** — covered by **Supabase Frankfurt** (`eu-central-1`). All Postgres data, auth records, and Storage files stay in EU. Verify the project region in Supabase dashboard → Project Settings → General.

### 19.2 GoBD (German accounting compliance)

**[LEGAL] P0** (already covered in §5):
- Sequential invoice numbers.
- Immutable invoices.
- 10-year archival.
- Audit trail for any accounting-relevant change.

### 19.3 Widerrufsrecht (already covered in §6)

**[LEGAL] P0**: explicit waiver UX for digital products + 14-day refund window for B2C.

### 19.4 Other German specifics

**[LEGAL] P0**: **AGB** (already exists at `/legal/agb`) — must explicitly cover digital content, plan upgrades, refund waiver, affiliate terms.

**[LEGAL] P0**: **§5 TMG Impressum** must be reachable in two clicks from every page.

**[LEGAL] P1**: **Affiliate disclosure** — affiliates must disclose paid relationship under UWG / EU rules.

**[LEGAL] P1**: **Geo-blocking regulation**: you can sell within EU/EEA but cannot discriminate by location for the same buyer. So no per-country price hikes within the EU (currency / language allowed; price not).

---

## 20. Security

The client mentioned none of this. Most are P0 for production.

**[GAP] P0]**: 
- **Stripe & PayPal webhook signature verification** (§4).
- **Admin 2FA** (§1).
- **Rate limits** on `/api/auth/*`, `/api/checkout/*`, `/api/admin/*`. Use Vercel KV or Upstash Ratelimit.
- **Brute-force lockout** on login (5 attempts → 15 min cool-down).
- **Strict CORS** on every API route.
- **CSP headers** (Content-Security-Policy) — restrict where scripts/images/iframes can load from.
- **HSTS** + HTTPS everywhere (Vercel default, verify).
- **Secret hygiene** — no secrets in repo, no secrets in client bundle. Rotate quarterly. Use Vercel env scopes (preview vs prod).
- **Dependency scanning** — Dependabot / Snyk weekly.
- **AgentShield scan** — already in your tooling stack via ECC.

**[GAP] P1]**:
- **PII encryption at rest** — Supabase Postgres + Storage are encrypted at rest by GCP (AES-256). Sensitive fields (WhatsApp, address) — fine as plain in DB, but **never log them**.
- **PII redaction in logs** — middleware that scrubs emails / phones from Sentry breadcrumbs.
- **Admin IP allow-list** option — restrict `/admin/**` to allowed IPs (off by default, on when paranoid).
- **Penetration test** before launch — third-party, ~3-5k EUR.

**[GAP] P2]**: Bug bounty (after launch).

---

## 21. Reliability, Observability & Operations

The client mentioned none of this.

**[GAP] P0]**:
- **Error tracking** — Sentry. Wire frontend + backend + edge. Set DSN per env.
- **Structured logs** — Vercel logs + a long-term sink (Logtail / Axiom / Datadog).
- **Uptime monitoring** — Better Uptime / Pingdom on public URL + API health endpoint.
- **Health endpoint** `/api/health` (Supabase Postgres ping + Stripe ping + Resend ping).
- **Daily DB backups** — Neon/Supabase Postgres auto; verify retention is 7+ days. Test restore quarterly.
- **DB backups** — Supabase Pro provides automatic daily backups (7-day retention). Add a weekly `pg_dump` cron exporting to S3-compatible cold storage (Cloudflare R2 / Backblaze B2) for off-vendor redundancy. Test restore quarterly into the staging Supabase project.
- **Staging environment** — separate Vercel project + separate Supabase project (free tier is fine for staging). Required for upgrade/refund testing without touching prod.

**[GAP] P1]**:
- **Runbooks** — `docs/RUNBOOKS/` with: payment outage, webhook lag, Discord bot down, mass-email bounce, DB rollback.
- **On-call rotation** — 3 admins, 1-week rotation; Slack/Discord pager via PagerDuty / Better Uptime.
- **SLOs** — define availability target (99.5 % is fine for a course platform; 99.9 % is overkill).

**[GAP] P2]**:
- **Synthetic monitoring** — fake-customer journey runs every 10 min (register → checkout → see dashboard).
- **Cost monitoring** — Vercel / Supabase / Bunny Stream bill alerts at thresholds.

---

## 22. Performance, SEO & Accessibility

The client mentioned none of this. The public site is "fine" per your assessment, but verify:

**[GAP] P1 — Performance**:
- Core Web Vitals (LCP < 2.5 s, INP < 200 ms, CLS < 0.1). Run Lighthouse + PageSpeed on home/courses/pricing.
- Next.js `Image` everywhere. Hero "horses" image needs to be optimized + responsive.
- Font loading: `next/font` with display=swap, no FOIT.

**[GAP] P1 — SEO**:
- Sitemap.xml (Next.js metadata API).
- Robots.txt.
- Open Graph + Twitter card per page.
- **Structured data**: `Course`, `Product`, `FAQPage`, `Organization` JSON-LD.
- Canonical URLs on every page.
- German `lang="de"` on `<html>`.

**[GAP] P1 — Accessibility (BITV 2.0 — Germany's WCAG flavor)**:
- Verify gold-on-black contrast meets AA (4.5:1 for body, 3:1 for large text). `#D4AF37` on `#0a0a0a` is borderline — test it.
- Keyboard navigation across all interactive elements.
- Focus indicators visible (gold ring fits the brand).
- ARIA labels on icon-only buttons.
- Form errors associated with inputs.
- Reduced motion preference respected (`prefers-reduced-motion`).

**[GAP] P2]**: PWA manifest + service worker for offline access to downloaded resources.

---

## 23. Design System & Brand

**From Lastenheft**: TRW-inspired, black + royal gold, chessboard motif, horses, premium, modern animations.

**[GAP] P1]**: **Design tokens** — colors, spacing, radii, shadows, glow effects in `src/styles/tokens.css` (or Tailwind theme). Currently scattered.

**[GAP] P1]**: **Component library doc** — Storybook is overkill for this size; instead, an `/admin/styleguide` (admin-only) page that renders every variant of every component. Catches regressions.

**[GAP] P2]**: **Animation guideline** — list of approved transitions, easings, durations. Prevents drift.

**[GAP] P2]**: **Brand assets** library — logos (full / mark), horse imagery (licensed!), chessboard patterns, gold textures. Stored in `public/brand/`.

---

## 24. Phases to add to `CRM_SPEC.md`

Currently the spec has 10 phases. Based on this analysis, add these — they are not optional:

**Phase 11 — DSGVO Foundation (P0)**
- Cookie consent (Cookiebot or self-rolled).
- Data export flow.
- Deletion / right-to-be-forgotten flow with admin review.
- Consent log for marketing.
- Sub-processor DPA registry doc.
- Verify EU region on all data hosts.
- Privacy policy + Impressum + AGB review against actual data flows.

**Phase 12 — Tax & Invoicing Hardening (P0)**
- Stripe Tax (or VIES validation) at checkout.
- GoBD-compliant invoice generator: sequential numbers, immutability, 10-year archive, credit notes for refunds.
- Kleinunternehmer toggle.
- Reverse-charge handling for B2B EU customers.

**Phase 13 — Refunds & Widerruf (P0)**
- Explicit waiver UX at checkout.
- 14-day Widerruf flow for B2C.
- Customer refund request → admin queue → Stripe/PayPal refund + Storno invoice + entitlement revoke + Discord role flag.
- Chargeback auto-handling (Stripe webhook → revoke entitlement, alert admin).

**Phase 14 — Security Hardening (P0)**
- Admin 2FA (Supabase Auth MFA, TOTP factor).
- Webhook signature verification audit (Stripe + PayPal + Discord).
- Rate limits (Upstash) on auth, checkout, admin APIs.
- CSP, HSTS, strict CORS headers.
- `npx ecc-agentshield scan --fix` baseline.
- Brute-force lockout.

**Phase 15 — Video Provider Decision & Migration (P0)**
- Pick Bunny Stream / Mux (confirm with user).
- Migrate existing course videos.
- Token-based signed playback.
- Forensic watermarking.

**Phase 16 — Reliability (P1)**
- Sentry frontend+backend.
- Health endpoint + uptime monitoring.
- Staging environment.
- Daily backups + tested restore.
- Runbooks.

**Phase 17 — Compliance Polish (P1)**
- Marketing-vs-transactional email separation + suppression list.
- List-Unsubscribe header.
- Cookie consent integrations with analytics & livechat (only loaded after consent).
- Account deletion request flow tied to refund / tax retention rules.

---

## 25. Open questions — RESOLVED

> Owner-resolved 2026-05-17. Full decision matrix lives in [`CRM_SPEC.md`](./CRM_SPEC.md) §5. Re-open via the "Annex C — Open change requests" mechanism in `CRM_SPEC.md`.

| # | Question | Resolution |
|---|---|---|
| 1 | Crypto chains + processor | **Manual TX-hash verification for v1** (customer pastes hash, admin verifies on block explorer, marks paid). NOWPayments added post-launch. Chains: BTC / ETH / USDT-ERC20 / USDT-TRC20. |
| 2 | Mentor ≠ Admin? | **Same table.** `admin_permissions.perms.mentor = true`. Split later if non-admin mentors are hired. |
| 3 | Video host | **Bunny Stream** (EU PoPs, signed URLs, dynamic watermark, HLS). |
| 4 | Plan upgrade direction | **Forward only** (Fast → Business → Infinity). No downgrade-with-credit. Goes into AGB. |
| 5 | Drip release | **Fast & Infinity**: all unlocked at enrollment. **Business**: first module immediately, remaining unlocked after each completed mentor session. Stored as `release_strategy` JSON on `plans`. |
| 6 | Affiliate cookie window | **60 days**, last-touch wins. Click overwrites earlier click. |
| 7 | Widerruf waiver at checkout | **Yes** — explicit checkbox required at checkout. German lawyer signs off on final wording before launch. |
| 8 | Kleinunternehmer status | **No** — VAT-registered from day 1 to avoid migration once Infinity sales pass €22k. |
| 9 | GoBD archival | **Lexoffice** is the legal record (€16/mo, GoBD-certified). Mirror PDFs to Supabase Storage `invoices` bucket with SHA-256 checksum as backup. |
| 10 | Discord server admin | **Deferred** to Phase 7. Server owner invites the bot with `Manage Roles` + `Send Messages` permissions when the phase starts. |
| 11 | Content / testimonial licensing | **Operational** — admin builds tiny intake form for customers featured in Kundenerfolge. Customers e-sign Einwilligungserklärung (PDF template) before content goes live. |
| 12 | Refund policy | Within 14 d Widerruf: **full**. After: **none** unless exceptional. Partial: admin discretion. Chargeback: auto-revoke entitlements. Goes into AGB. |

**Additional locked-in technical decisions** (not from original Lastenheft, full list in `CRM_SPEC.md` §5):

- **Backend platform**: **Supabase** (Frankfurt) — Postgres + Auth + Storage + Realtime. **Firebase is being removed in Phase 1.**
- **ORM**: Drizzle (connects directly to Supabase Postgres connection string; PostgREST ignored)
- **Tax**: Stripe Tax for VAT calc and reverse-charge
- **Errors**: Sentry · **Uptime**: Better Stack · **Logs**: Axiom · **Analytics**: Plausible
- **Rate limiting**: Upstash Ratelimit
- **2FA**: Supabase Auth MFA (TOTP) — mandatory for admins
- **Animations**: Framer Motion · **Charts**: Recharts
- **Discord bot host**: Railway
- **Livechat**: Crisp · **Cookie consent**: self-rolled

Estimated monthly tooling spend at launch: **€80–100** (Supabase Pro added €25 to previous estimate).

---

## 26. Recommended new priority bucket

Once §11–17 (new phases) are added, the proper P0 list is:

1. **Phase 1** — Foundation (Postgres, customer 360).
2. **Phase 11** — DSGVO Foundation. *Move ahead of analytics — required to ingest data legally.*
3. **Phase 14** — Security hardening.
4. **Phase 12** — Tax/invoicing.
5. **Phase 13** — Refunds/Widerruf.
6. **Phase 2** — Tickets.
7. **Phase 3** — Payments hardened.
8. **Phase 15** — Video provider migration. *Before more course content is uploaded.*
9. **Phase 4** — Notifications.
10. **Phase 16** — Reliability.

After that, the existing Phase 5 → 10 order (Sessions, Affiliate, Discord bot, Community CMS, Analytics, polish) is fine.
