# Quick Vercel Deployment Guide

## 🚀 Deploy University Ecom to Vercel with Email Automation

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy your app
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: university-ecom
# - Directory: ./
# - Override settings? N
```

Your app will be deployed to: `https://university-ecom-xxx.vercel.app`

### Step 2: Set Up Email with Vercel Domain

1. **Get your Vercel URL** from the deployment output
2. **Sign up for Resend** at [resend.com](https://resend.com)
3. **Add your Vercel domain** in Resend:
   - Domain: `university-ecom-xxx.vercel.app`
   - Follow verification steps

4. **Get API Key** from Resend dashboard

### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:

```
RESEND_API_KEY = re_your_api_key_here
EMAIL_FROM_EMAIL = noreply@university-ecom-xxx.vercel.app
EMAIL_REPLY_TO = support@university-ecom-xxx.vercel.app
EMAIL_SUPPORT_EMAIL = support@university-ecom-xxx.vercel.app

# Add all your Firebase config too:
NEXT_PUBLIC_FIREBASE_API_KEY = your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
# ... etc
```

### Step 4: Test Email System

1. **Redeploy** (Vercel auto-deploys on git push)
2. **Visit your site**: `https://your-app.vercel.app`
3. **Complete intake form** to test confirmation email
4. **Login as admin** to test approval/rejection emails

### Step 5: Custom Domain (Optional)

To use `university-ecom.com` instead of the Vercel subdomain:

1. **Buy domain** (Namecheap, Vercel Domains, etc.)
2. **Add domain in Vercel** project settings
3. **Update DNS** to point to Vercel
4. **Update email settings** to use custom domain
5. **Verify domain in Resend**

## 🎯 That's it! 

Your University Ecom platform with email automation is now live on Vercel! 

**Test the complete flow:**
1. User completes intake form → Gets confirmation email ✅
2. Admin reviews → User gets approval/rejection email ✅
3. Professional branded emails throughout ✅

## 📧 Email Domains Comparison

| Feature | Vercel Subdomain | Custom Domain |
|---------|------------------|---------------|
| Cost | Free | $10-15/year |
| Setup Time | 5 minutes | 30 minutes |
| Professional | Good | Excellent |
| Email Deliverability | Good | Better |
| Branding | university-ecom.vercel.app | university-ecom.com |

**Recommendation**: Start with Vercel subdomain for immediate testing, upgrade to custom domain when ready for production customers.
