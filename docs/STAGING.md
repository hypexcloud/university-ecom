# Staging Environment Setup

## Overview

Staging mirrors production but uses separate vendor accounts to prevent data mixing.

## Setup Checklist

### 1. Separate Supabase Project
- Create a new Supabase project in Frankfurt (free tier OK for staging)
- Copy connection string to staging `.env`
- Run `npm run db:push` to create tables
- Run `npm run db:seed` to populate test data

### 2. Vercel Preview Deployment
- Staging deploys automatically on PR branches via Vercel
- Or create a dedicated staging branch: `git checkout -b staging`
- Set environment variables in Vercel → Project → Settings → Environment Variables
  - Scope to "Preview" environment
  - Use staging Supabase credentials
  - Use Stripe test mode keys (`pk_test_*`, `sk_test_*`)

### 3. Stripe Test Mode
- Use Stripe test mode keys (already in `.env.example`)
- Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)
- Webhook: create a separate webhook endpoint pointing to your preview URL

### 4. Email
- Resend test mode or a staging-specific API key
- All emails go to verified addresses only in test mode

### 5. Bunny Stream
- Can share the same library (videos are immutable) or create a separate one

## Testing Workflow

1. Push to feature branch → Vercel preview deploys
2. Test auth flow: register → login → MFA enroll
3. Test checkout: Stripe test card → webhook → entitlement created
4. Test admin: customer 360 → grant/revoke → audit log
5. Test tickets: create → admin reply → email notification
6. Verify: `curl https://preview-url/api/health`
