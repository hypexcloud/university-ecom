# Runbooks — University Ecom

Operational procedures for common incidents and maintenance tasks.

## Incident Response

### Payment Outage (Stripe down)
1. Check [Stripe Status](https://status.stripe.com/)
2. If Stripe is down: no action needed, webhooks will retry automatically
3. If our webhook is failing: check Vercel function logs → Sentry
4. Crypto orders can still be processed manually via `/admin/payments`

### Webhook Lag
1. Stripe dashboard → Developers → Webhooks → check pending events
2. If events are pending > 1h: check Vercel function cold-start issues
3. Manual recovery: re-trigger from Stripe dashboard

### Discord Bot Down
1. Check Railway dashboard for the bot service
2. Restart if needed: `railway up` in the bot repo
3. Roles will re-sync on next entitlement event

### Mass Email Bounce
1. Check Resend dashboard → Suppression list
2. Remove false positives from suppression
3. If domain reputation issue: check SPF/DKIM/DMARC records

### Database Rollback
1. Supabase dashboard → Database → Backups
2. Select point-in-time recovery target
3. Restore to a new project for verification before swapping

## Maintenance

### Daily Automated
- Supabase Pro: automatic daily backups (7-day retention)

### Weekly Manual
- Check Sentry for new unresolved errors
- Review `/api/health` endpoint status
- Check Upstash usage/quota

### Monthly
- Review affiliate payouts queue
- Export analytics CSV for accounting
- Check Bunny Stream storage/bandwidth usage
- Rotate API keys if needed (Stripe, Resend, Supabase service role)

## Contacts
- **Primary on-call**: Admin team (3 admins)
- **Stripe support**: dashboard.stripe.com/support
- **Supabase support**: supabase.com/dashboard/support
- **Bunny support**: support.bunny.net
