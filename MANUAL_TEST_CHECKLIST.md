# Manual Test Checklist - University Ecom

**Version**: 0.1.0-alpha  
**Last Updated**: January 21, 2025  
**Phase**: Foundation Complete

## 📋 Pre-Test Setup

### Environment Check
- [ ] Node.js version 18.17.0+ installed
- [ ] All dependencies installed (`npm install` completed)
- [ ] Development server running (`npm run dev`)
- [ ] No console errors on startup
- [ ] TypeScript compilation successful

### Browser Testing Setup
Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (responsive mode)
- [ ] Mobile Safari (responsive mode)

---

## 🏠 Homepage Testing (`/`)

### Visual Design
- [ ] Hero section displays correctly with proper typography
- [ ] University Ecom logo and branding visible
- [ ] Course cards (AI & Dropshipping) render properly
- [ ] Trust signals section (500+ students, 4.9/5 rating) visible
- [ ] CTA buttons styled correctly with hover effects

### Content Verification
- [ ] Main headline: "University Ecom AI & Dropshipping"
- [ ] Subheadline about practical courses for European entrepreneurs
- [ ] AI course card shows correct features (ChatGPT, automation, etc.)
- [ ] Dropshipping course card shows EU-focused features
- [ ] Trust metrics display: 500+ students, 4.9/5 rating, 24/7 support

### Interactive Elements
- [ ] "Kurse entdecken" button links to `/courses`
- [ ] "Über uns erfahren" button links to `/about`
- [ ] AI course "ansehen" button links to `/courses/ai`
- [ ] Dropshipping course "ansehen" button links to `/courses/dropshipping`
- [ ] All hover effects work smoothly

---

## 🧭 Navigation Testing

### Desktop Navigation
- [ ] Logo links to homepage (`/`)
- [ ] "Kurse" dropdown menu opens on hover/click
- [ ] Dropdown shows AI Kurs and Dropshipping Kurs options
- [ ] "Über uns" link works and shows Users icon
- [ ] "Anmelden" button visible with LogIn icon
- [ ] "Kurse ansehen" primary button visible

### Mobile Navigation
- [ ] Hamburger menu (three lines) visible on mobile
- [ ] Sheet menu slides in from right when tapped
- [ ] Mobile menu shows logo at top
- [ ] Course sections properly categorized
- [ ] All links work in mobile menu
- [ ] Menu closes when link is tapped
- [ ] Smooth animations and transitions

### Navigation Links Testing
- [ ] `/` - Homepage
- [ ] `/courses` - Course overview
- [ ] `/courses/ai` - AI course detail
- [ ] `/courses/dropshipping` - Dropshipping course detail
- [ ] `/about` - About page
- [ ] `/login` - Login page (placeholder)

---

## 📚 Course Pages Testing

### Courses Overview (`/courses`)
- [ ] Page title: "Wählen Sie Ihren Kurs"
- [ ] Course comparison grid displays properly
- [ ] AI course card shows "Beliebt" badge
- [ ] Dropshipping course card shows "Bewährt" badge
- [ ] Course features listed with star icons
- [ ] Duration and student count displayed
- [ ] "Details ansehen" buttons link correctly
- [ ] "Preise vergleichen" buttons work
- [ ] Trust section with certifications displays

### AI Course Detail (`/courses/ai`)
- [ ] Hero section with BookOpen icon
- [ ] Course overview cards (12 weeks, 250+ students, 4.9/5)
- [ ] "Was Sie lernen werden" section with 6 feature cards
- [ ] Curriculum section with 6 weeks detailed
- [ ] Each curriculum week shows topics with checkmarks
- [ ] CTA section encourages enrollment
- [ ] "Jetzt einschreiben" links to `/pricing/ai`
- [ ] "Lehrplan ansehen" scrolls to curriculum

### Dropshipping Course Detail (`/courses/dropshipping`)
- [ ] Hero section with TrendingUp icon
- [ ] Course overview cards (16 weeks, 300+ students, 4.8/5)
- [ ] EU compliance highlights prominently displayed
- [ ] Success stories section with student testimonials
- [ ] Curriculum with 6 module sections
- [ ] "Warum EU-fokussiert?" section with 3 benefits
- [ ] "Jetzt einschreiben" links to `/pricing/dropshipping`

---

## 💰 Pricing Pages Testing (`/pricing/[course]`)

### AI Pricing (`/pricing/ai`)
- [ ] Page title shows "AI Kurs - Preise"
- [ ] Two pricing cards: Pro (€497) and Max (€997)
- [ ] Pro plan features listed with Euro icons
- [ ] Max plan shows "Beliebt" badge and Crown icons
- [ ] Feature comparison table displays correctly
- [ ] Payment methods section shows credit card, PayPal, crypto
- [ ] FAQ section with 2 common questions
- [ ] "Pro Plan wählen" and "Max Plan wählen" buttons link to `/checkout`

### Dropshipping Pricing (`/pricing/dropshipping`)
- [ ] Same structure as AI pricing but for Dropshipping course
- [ ] Correct course title in header
- [ ] All features and pricing display properly
- [ ] Checkout buttons work correctly

---

## ℹ️ About Page Testing (`/about`)

### Content Sections
- [ ] Hero section with Users icon and company description
- [ ] Mission & Vision grid layout displays properly
- [ ] "Unsere Werte" callout box with Heart icon
- [ ] Trust signals with 4 metrics (500+ graduates, 4.9/5, etc.)
- [ ] "Warum University Ecom?" with 3 benefit cards
- [ ] Team preview section with 3 expert categories
- [ ] Testimonials preview with 2 student reviews
- [ ] CTA section with action buttons

### Interactive Elements
- [ ] "Kurse entdecken" button links to `/courses`
- [ ] "Kontakt aufnehmen" button links to `/support`
- [ ] "Alle Bewertungen ansehen" button links to `/reviews`

---

## 🚫 404 Page Testing (`/not-found`)

### Access Testing
- [ ] Visit non-existent URL (e.g., `/invalid-page`)
- [ ] 404 page displays with large "404" text
- [ ] Page title: "Seite nicht gefunden"
- [ ] Helpful description text appears

### Navigation Options
- [ ] Two course cards (AI and Dropshipping) display
- [ ] "Zum AI Kurs" button works
- [ ] "Zum Dropshipping Kurs" button works
- [ ] "Zur Startseite" button with Home icon
- [ ] "Kurse durchsuchen" button with Search icon
- [ ] Helpful links section at bottom

---

## 🔗 Placeholder Pages Testing

### Login Page (`/login`)
- [ ] Page displays with LogIn icon
- [ ] "🚧 In Entwicklung" message visible
- [ ] Lists planned features (Firebase Auth, Google OAuth, etc.)
- [ ] "Kurse ohne Anmeldung ansehen" button works

### Checkout Page (`/checkout`)
- [ ] ShoppingCart icon in header
- [ ] Development message with planned features
- [ ] Lists payment integrations (Stripe, PayPal, Coinbase)
- [ ] "Zurück zu den Kursen" button works

### Dashboard Page (`/dashboard`)
- [ ] LayoutDashboard icon displays
- [ ] Shows planned dashboard features
- [ ] "Zuerst anmelden" button links to `/login`

### Support Page (`/support`)
- [ ] HeadphonesIcon displays correctly
- [ ] Lists support features (tickets, Cal.com, FAQ)
- [ ] "Mehr über uns erfahren" button links to `/about`

### Community Page (`/community`)
- [ ] Users icon and community description
- [ ] Lists WhatsApp/Discord features
- [ ] "Kurse ansehen" button links to `/courses`

### Reviews Page (`/reviews`)
- [ ] Star icon and reviews description
- [ ] Lists review system features
- [ ] "Mehr über University Ecom erfahren" button works

---

## ⚖️ Legal Pages Testing

### Privacy Page (`/legal/privacy`)
- [ ] Shield icon and privacy title
- [ ] GDPR compliance message
- [ ] Lists planned privacy features
- [ ] "Zur Startseite" button works

### Terms Page (`/legal/terms`)
- [ ] FileText icon and AGB title
- [ ] Lists planned terms features
- [ ] Navigation button works

### Impressum Page (`/legal/impressum`)
- [ ] MapPin icon and impressum title
- [ ] Lists required German legal information
- [ ] Navigation works correctly

### Cookies Page (`/legal/cookies`)
- [ ] Cookie icon and cookie settings title
- [ ] Lists cookie consent features
- [ ] Navigation button functions

---

## 📱 Responsive Design Testing

### Mobile (375px width)
- [ ] All pages render properly on mobile
- [ ] Navigation switches to hamburger menu
- [ ] Content stacks vertically appropriately
- [ ] Buttons are touch-friendly (minimum 44px)
- [ ] Text remains readable
- [ ] Images scale properly

### Tablet (768px width)
- [ ] Layout adapts to tablet size
- [ ] Navigation remains functional
- [ ] Grid layouts adjust appropriately
- [ ] Content remains accessible

### Desktop (1200px+ width)
- [ ] Full desktop layout displays
- [ ] Dropdown menus work properly
- [ ] Content doesn't exceed max-width
- [ ] All interactive elements function

---

## 🎨 Footer Testing

### Content Verification
- [ ] University Ecom logo and description
- [ ] Four column layout: Company, Kurse, Support, Kontakt
- [ ] Social media icons (Facebook, Twitter, Instagram, LinkedIn)
- [ ] Course links work (AI Kurs, Dropshipping Kurs, pricing)
- [ ] Support links function (About, Support, Community, Reviews)
- [ ] Contact information displays (email, phone, location)

### Legal Footer
- [ ] Copyright notice: "© 2025 University Ecom"
- [ ] Legal links: Datenschutz, AGB, Impressum, Cookie-Einstellungen
- [ ] All legal links navigate to correct pages
- [ ] Links have proper hover effects

---

## ⚡ Performance Testing

### Page Load Speed
- [ ] Homepage loads quickly (< 3 seconds)
- [ ] Course pages load without delay
- [ ] Images load progressively
- [ ] No layout shift during loading

### Smooth Interactions
- [ ] Hover effects are smooth
- [ ] Navigation transitions work well
- [ ] Mobile menu animations are fluid
- [ ] Button presses have immediate feedback

---

## 🛡️ Security & Technical Testing

### Console Errors
- [ ] No JavaScript errors in console
- [ ] No TypeScript compilation errors
- [ ] No missing image or resource errors
- [ ] No accessibility warnings

### SEO & Metadata
- [ ] Each page has proper `<title>` tag
- [ ] Meta descriptions are present
- [ ] Open Graph tags configured
- [ ] Twitter Card metadata set

### Accessibility
- [ ] All images have alt text
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader navigation works

---

## ✅ Test Completion Checklist

### Required for Sign-off
- [ ] All navigation links work correctly
- [ ] All pages render without errors
- [ ] Responsive design works on all screen sizes
- [ ] No console errors in any browser
- [ ] All interactive elements function properly
- [ ] Content is accurate and properly formatted
- [ ] Performance is acceptable (fast loading)

### Documentation
- [ ] Issues documented with screenshots if found
- [ ] Browser compatibility confirmed
- [ ] Performance metrics noted
- [ ] Ready for Phase 1 implementation

---

**Testing Notes:**
- Record any issues found during testing
- Note browser-specific behaviors
- Document performance observations
- Verify all placeholder content is marked as "🚧 In Entwicklung"

**Phase 1 Readiness:**
This manual test checklist ensures the foundation is solid before implementing authentication, payments, and dynamic features in Phase 1.
