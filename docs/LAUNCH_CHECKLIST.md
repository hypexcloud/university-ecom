# Launch Checklist — University Ecom

Everything that needs to happen **outside the codebase** before going live.
Code for all features (Phases 1–17) is complete. This doc covers accounts, env vars, database setup, and external service configuration.

---

## 1. Supabase (Frankfurt)

### Account setup
- [ ] Create project in **eu-central-1 (Frankfurt)** region
- [ ] Note the project URL, anon key, service role key, and direct Postgres connection string

### Database
- [ ] Run the Drizzle migration: `npm run db:push` (applies schema from `drizzle/0000_strange_kronos.sql`)
- [ ] Verify all 30 tables created (run `npm run db:studio` to inspect)

### Storage buckets
- [ ] Create bucket: **`invoices`** (private, no public access)
  - Used for: invoice PDFs, certificate PDFs

### Auth
- [ ] Enable Email+Password provider
- [ ] Enable MFA (TOTP) — required for admin routes
- [ ] Set redirect URLs: `https://university-ecom.com/**`, `http://localhost:3000/**`
- [ ] Disable email confirmation for dev (enable for prod)

### Realtime
- [ ] Enable Realtime on `notifications` table (for bell component)
- [ ] Enable Realtime on `tickets` table (for admin queue)
- [ ] RLS policies: users can only subscribe to their own `recipient_uid` rows

### Seed data
- [ ] Insert products + plans:
  ```sql
  -- Products
  INSERT INTO products (id, kind, slug, title) VALUES
    (gen_random_uuid(), 'course', 'ai-kurs', 'AI-Automatisierung Kurs'),
    (gen_random_uuid(), 'course', 'dropshipping-kurs', 'EU-Dropshipping Kurs'),
    (gen_random_uuid(), 'creator', 'tiktok-creator', 'TikTok Creator Programm'),
    (gen_random_uuid(), 'creator', 'youtube-creator', 'YouTube Creator Programm');

  -- Plans (use the product IDs from above)
  INSERT INTO plans (id, product_id, code, price_cents) VALUES
    (gen_random_uuid(), '<ai-kurs-id>', 'fast', 49700),
    (gen_random_uuid(), '<ai-kurs-id>', 'business', 99700),
    (gen_random_uuid(), '<ai-kurs-id>', 'infinity', 149700),
    (gen_random_uuid(), '<dropshipping-kurs-id>', 'fast', 49700),
    (gen_random_uuid(), '<dropshipping-kurs-id>', 'business', 99700),
    (gen_random_uuid(), '<dropshipping-kurs-id>', 'infinity', 149700),
    (gen_random_uuid(), '<tiktok-creator-id>', 'tiktok', 7500),
    (gen_random_uuid(), '<youtube-creator-id>', 'youtube', 10000);
  ```
- [ ] Insert admin users into `customers` + `admin_permissions`:
  ```sql
  -- After registering via the app, grant admin:
  INSERT INTO admin_permissions (uid, perms) VALUES
    ('<admin-uid>', '{"customers":true,"products":true,"payments":true,"affiliate":true,"tickets":true,"videos":true,"analytics":true}');
  ```
- [ ] Insert at least one mentor into `mentors` table

### Env vars
```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:6543/postgres
```

---

## 2. Stripe

### Account setup
- [ ] Create Stripe account (or use existing)
- [ ] Enable Stripe Tax in Dashboard (for automatic VAT calculation)
- [ ] Set business address (Germany) for correct tax rates

### Webhook
- [ ] Create webhook endpoint: `https://university-ecom.com/api/webhooks/stripe`
- [ ] Subscribe to events:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.dispute.created`
- [ ] Copy webhook signing secret

### Env vars
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 3. PayPal

### Account setup
- [ ] Create PayPal Business account
- [ ] Create REST API app at developer.paypal.com
- [ ] Note Client ID + Secret
- [ ] For production: change API URL to `https://api-m.paypal.com`

### Env vars
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<client-id>
PAYPAL_SECRET=<secret>
PAYPAL_API_URL=https://api-m.paypal.com
```

---

## 4. Resend (Email)

### Account setup
- [ ] Create account at resend.com
- [ ] Add and verify sending domain (or use Vercel subdomain for dev)
- [ ] Create API key

### Env vars
```
RESEND_API_KEY=re_...
EMAIL_FROM_EMAIL=noreply@university-ecom.com
EMAIL_FROM_NAME=University Ecom
```

---

## 5. Bunny Stream (Video)

### Account setup
- [ ] Create Bunny.net account
- [ ] Create a Stream library
- [ ] Note library ID, API key, pull zone hostname, and signing key (Token Authentication)
- [ ] Upload course videos to the library

### Env vars
```
BUNNY_STREAM_LIBRARY_ID=<id>
BUNNY_STREAM_API_KEY=<key>
BUNNY_STREAM_PULL_ZONE=<hostname>
BUNNY_STREAM_SIGNING_KEY=<key>
```

---

## 6. Discord Bot

### Bot setup
- [ ] Create application at discord.com/developers
- [ ] Create bot, enable `SERVER MEMBERS INTENT`
- [ ] Invite bot to server with permissions: Manage Roles, Send Messages, Create DM
- [ ] Create roles in Discord server for each plan: Fast, Business, Infinity, TikTok, YouTube, Affiliate
- [ ] Copy each role ID

### OAuth setup (for account linking)
- [ ] Add redirect URI: `https://university-ecom.com/api/auth/discord/callback`
- [ ] Enable `identify` scope

### Deploy bot to Railway
- [ ] Create Railway project from `discord-bot/` directory
- [ ] Set env vars (same Discord vars as below)
- [ ] Deploy — bot connects to gateway for slash commands

### Env vars
```
DISCORD_BOT_TOKEN=<token>
DISCORD_CLIENT_ID=<client-id>
DISCORD_CLIENT_SECRET=<secret>
DISCORD_PUBLIC_KEY=<key>
DISCORD_GUILD_ID=<server-id>
DISCORD_ROLE_FAST=<role-id>
DISCORD_ROLE_BUSINESS=<role-id>
DISCORD_ROLE_INFINITY=<role-id>
DISCORD_ROLE_TIKTOK=<role-id>
DISCORD_ROLE_YOUTUBE=<role-id>
DISCORD_ROLE_AFFILIATE=<role-id>
DISCORD_INTERNAL_API_KEY=<random-secret-for-internal-api>
```

---

## 7. Crypto Wallets

- [ ] Set up wallet addresses for each currency you want to accept
- [ ] Admin confirms payments manually at `/admin/payments`

### Env vars
```
CRYPTO_WALLET_BTC=<address>
CRYPTO_WALLET_ETH=<address>
CRYPTO_WALLET_USDT_ERC20=<address>
CRYPTO_WALLET_USDT_TRC20=<address>
```

---

## 8. Monitoring & Error Tracking

### Sentry
- [ ] Create Sentry project (Next.js)
- [ ] Note DSN and auth token
- [ ] Config files already exist: `sentry.client.config.ts`, `sentry.server.config.ts`

### Better Stack (Uptime)
- [ ] Create account at betterstack.com
- [ ] Add monitor: `https://university-ecom.com/api/health`
- [ ] Set alert channels (email, Slack, etc.)

### Env vars
```
SENTRY_DSN=https://<key>@sentry.io/<id>
NEXT_PUBLIC_SENTRY_DSN=https://<key>@sentry.io/<id>
SENTRY_AUTH_TOKEN=<token>
```

---

## 9. Upstash (Rate Limiting)

### Account setup
- [ ] Create Upstash Redis database (EU region)
- [ ] Already wired in middleware for `/api/auth/` (10/min) and `/api/checkout/` (5/min)

### Env vars
```
UPSTASH_REDIS_REST_URL=https://<region>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
```

---

## 10. Analytics

### Plausible
- [ ] Create account at plausible.io (EU-hosted)
- [ ] Add site domain
- [ ] Script loads only after analytics cookie consent

### Env vars
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=university-ecom.com
```

---

## 11. Crisp (Livechat)

- [ ] Create account at crisp.chat
- [ ] Note website ID
- [ ] Widget loads only after marketing cookie consent

### Env vars
```
NEXT_PUBLIC_CRISP_WEBSITE_ID=<id>
```

---

## 12. Invoice / Tax (Non-code)

### Invoice seller details
- [ ] Set real company info once Gewerbeanmeldung is done

```
INVOICE_SELLER_NAME=University Ecom GmbH
INVOICE_SELLER_ADDRESS=Echte Straße 1, 10115 Berlin, Deutschland
INVOICE_SELLER_TAX_ID=DE<real-ust-id>
```

### Stripe Tax
- [ ] Enable in Stripe Dashboard → Tax → Settings
- [ ] Set tax registration (Germany, 19% USt)
- [ ] Enable automatic tax calculation on checkout sessions

### DATEV / Lexoffice
- [ ] Create Lexoffice account
- [ ] Configure API integration (future Phase — currently invoices are self-generated PDFs)

---

## 13. Vercel Deployment

- [ ] Link repo to Vercel project
- [ ] Set **all env vars** above in Vercel Dashboard → Settings → Environment Variables
- [ ] Set custom domain: `university-ecom.com`
- [ ] Verify build: `npm run build` (note: requires `DATABASE_URL` reachable at build time for SSG pages)

### Build command
```
npm run build
```

### Post-deploy
- [ ] Test Stripe webhook delivery (use Stripe CLI or Dashboard test events)
- [ ] Test PayPal sandbox checkout flow
- [ ] Verify Crisp widget loads (after accepting marketing cookies)
- [ ] Verify Plausible tracking (after accepting analytics cookies)
- [ ] Send test email via Resend
- [ ] Test Discord OAuth link flow
- [ ] Visit `/api/health` — should return `{"status":"ok"}`

---

## 14. Legal (Non-code)

- [ ] Have a German lawyer review:
  - `/legal/terms` (AGB)
  - `/legal/datenschutz` (Datenschutzerklärung)
  - `/legal/impressum` (Impressum)
  - `/legal/privacy` (Privacy policy)
  - Widerruf waiver text at checkout
- [ ] Update Impressum with real company details
- [ ] Update Datenschutz with all third-party processors (Supabase, Stripe, PayPal, Resend, Bunny, Plausible, Crisp, Sentry, Upstash, Discord)

---

## 15. Go-Live Sequence

1. **Database**: Run `npm run db:push`, seed products/plans/admins
2. **Env vars**: Set all in Vercel
3. **Deploy**: Push to main, Vercel auto-deploys
4. **Stripe webhook**: Create + verify
5. **Discord bot**: Deploy to Railway
6. **Monitoring**: Set up Better Stack + Sentry alerts
7. **Test**: Full checkout flow (Stripe + PayPal), Discord link, ticket creation
8. **DNS**: Point `university-ecom.com` to Vercel
9. **Live**: Switch Stripe to live keys, PayPal to production URL

---

## Summary: All env vars

| Variable | Required | Where to get |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Dashboard |
| `DATABASE_URL` | Yes | Supabase → Connection String |
| `RESEND_API_KEY` | Yes | resend.com |
| `EMAIL_FROM_EMAIL` | Yes | Your verified domain |
| `EMAIL_FROM_NAME` | Yes | "University Ecom" |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Yes | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Webhook settings |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Yes | PayPal Developer |
| `PAYPAL_SECRET` | Yes | PayPal Developer |
| `PAYPAL_API_URL` | Yes | `https://api-m.paypal.com` for prod |
| `INVOICE_SELLER_NAME` | Yes | Your company name |
| `INVOICE_SELLER_ADDRESS` | Yes | Your company address |
| `INVOICE_SELLER_TAX_ID` | Yes | Your USt-IdNr |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://university-ecom.com` |
| `BUNNY_STREAM_LIBRARY_ID` | For video | Bunny.net |
| `BUNNY_STREAM_API_KEY` | For video | Bunny.net |
| `BUNNY_STREAM_PULL_ZONE` | For video | Bunny.net |
| `BUNNY_STREAM_SIGNING_KEY` | For video | Bunny.net |
| `CRYPTO_WALLET_BTC` | For crypto | Your wallet |
| `CRYPTO_WALLET_ETH` | For crypto | Your wallet |
| `CRYPTO_WALLET_USDT_ERC20` | For crypto | Your wallet |
| `CRYPTO_WALLET_USDT_TRC20` | For crypto | Your wallet |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Recommended | plausible.io |
| `NEXT_PUBLIC_CRISP_WEBSITE_ID` | Recommended | crisp.chat |
| `UPSTASH_REDIS_REST_URL` | Recommended | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Upstash |
| `SENTRY_DSN` | Recommended | Sentry |
| `NEXT_PUBLIC_SENTRY_DSN` | Recommended | Sentry |
| `SENTRY_AUTH_TOKEN` | Recommended | Sentry |
| `DISCORD_BOT_TOKEN` | For Discord | Discord Developer |
| `DISCORD_CLIENT_ID` | For Discord | Discord Developer |
| `DISCORD_CLIENT_SECRET` | For Discord | Discord Developer |
| `DISCORD_PUBLIC_KEY` | For Discord | Discord Developer |
| `DISCORD_GUILD_ID` | For Discord | Your Discord server |
| `DISCORD_ROLE_*` (6 vars) | For Discord | Discord role IDs |
| `DISCORD_INTERNAL_API_KEY` | For Discord | Generate random secret |
| `AFFILIATE_COOKIE_DAYS` | Optional | Default: 30 |
