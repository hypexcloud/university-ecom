# University Ecom

Professional AI & Dropshipping courses for entrepreneurs in Europe. Built with Next.js 15, TypeScript, Firebase, and Tailwind CSS.

## 🎯 Project Overview

University Ecom is a modern e-learning platform focused on practical business education for European entrepreneurs. We offer specialized courses in AI automation and EU-compliant Dropshipping strategies with a comprehensive pre-purchase qualification system.

### Key Features

- 🚀 **Modern Tech Stack**: Next.js 15, TypeScript, Firebase, Tailwind CSS, shadcn/ui
- 🔐 **Authentication**: Firebase Auth with Google OAuth and email/password
- 🗄️ **Database**: Firestore with comprehensive data management
- 📝 **Intake System**: Complete 5-step pre-purchase questionnaire with admin review
- 🌍 **EU-Focused**: GDPR-compliant, VAT-ready, German market expertise
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🎨 **Professional UI**: Clean, conversion-optimized design
- 🛡️ **Security First**: Role-based access control, protected routes, GDPR compliance

## 🛠 Tech Stack

- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript 5.6.3
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel (planned)

## 📁 Project Structure

```
university-ecom/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── courses/             # Course pages
│   │   ├── pricing/             # Pricing pages
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── dashboard/           # Protected dashboard
│   │   ├── intake/              # Pre-purchase questionnaire
│   │   │   ├── page.tsx         # 5-step intake form
│   │   │   └── success/page.tsx # Completion confirmation
│   │   ├── admin/               # Admin interfaces
│   │   │   └── intake/          # Intake management
│   │   ├── legal/               # Legal pages
│   │   └── not-found.tsx        # 404 page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── forms/               # Form components
│   │   │   ├── intake-form.tsx  # Main 5-step form
│   │   │   ├── intake-validation.ts # Zod schemas
│   │   │   ├── progress-indicator.tsx # Progress visualization
│   │   │   └── intake-steps/    # Individual form steps
│   │   │       ├── personal-info-step.tsx
│   │   │       ├── experience-goals-step.tsx
│   │   │       ├── course-specific-step.tsx
│   │   │       ├── motivation-expectations-step.tsx
│   │   │       └── marketing-consent-step.tsx
│   │   └── providers/           # Context providers
│   ├── lib/
│   │   ├── firebase/            # Firebase configuration & services
│   │   ├── auth/                # Authentication context & protection
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils.ts             # Utility functions
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
├── firebase.json               # Firebase project configuration
├── firestore.rules            # Database security rules
├── storage.rules              # File storage security rules
├── scripts/                   # Setup and utility scripts
├── PROJECT_REFERENCE.json    # Project documentation
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- Firebase account and project

### Installation

1. **Clone and navigate to project**:
   ```bash
   cd /Users/lavdim/Desktop/UniEC/university-ecom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. **Initialize Firebase (if not done)**:
   ```bash
   npm run setup:firebase
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run setup:firebase` - Initialize Firebase with seed data

### Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Optional: Development settings
NODE_ENV=development
```

## 📋 Current Status

**Phase 1: Complete Intake System ✅**

### ✅ Completed Features

**Foundation (Step 1)**
- ✅ **Database Schema**: Complete Firestore setup with 11 collections
- ✅ **Type Safety**: Comprehensive TypeScript definitions
- ✅ **Service Layer**: Generic CRUD operations with specialized services
- ✅ **Security Rules**: Role-based access control for database and storage
- ✅ **Data Seeding**: Automated initial data setup with courses and settings

**Intake System (Step 2 - COMPLETE)**
- ✅ **5-Step Form**: Complete questionnaire with progress tracking
- ✅ **Step 1**: Personal information (name, email, company, location)
- ✅ **Step 2**: Experience & goals (level, objectives, time, budget)
- ✅ **Step 3**: Course & plan selection (AI/Dropshipping, Pro/Max plans)
- ✅ **Step 4**: Motivation & expectations (goals, challenges, outcomes)
- ✅ **Step 5**: Marketing consent & legal (GDPR, terms, preferences)
- ✅ **Form Validation**: Zod schemas with German error messages
- ✅ **Progress Tracking**: Visual progress indicator with step completion
- ✅ **Success Flow**: Confirmation page with next steps
- ✅ **Database Integration**: Complete responses stored in Firestore

**Authentication (Step 3)**
- ✅ **Firebase Auth**: Email/password and Google OAuth integration
- ✅ **User Management**: Automatic Firestore profile creation
- ✅ **Protected Routes**: Component-based route guards with role-based access
- ✅ **Professional UI**: Login/register forms with validation
- ✅ **Session Management**: Persistent authentication state
- ✅ **Dashboard**: Protected user dashboard with profile information

**Admin Interface (NEW)**
- ✅ **Intake Management**: Complete admin dashboard for reviewing applications
- ✅ **Response Review**: Detailed view of all user responses
- ✅ **Approval Workflow**: Approve/reject with review notes
- ✅ **Statistics Dashboard**: Pending responses, daily stats, popular courses
- ✅ **Role Protection**: Admin-only access with authentication

### 🎨 Design System Complete
- **Responsive Design**: Works perfectly on all devices
- **Navigation**: Desktop dropdown menus + mobile sheet menu
- **Core Pages**: Homepage, About, Courses, Pricing, Login, Register, Dashboard
- **UI Components**: Professional shadcn/ui component library with custom intake components
- **SEO Ready**: Metadata, Open Graph, Twitter Cards
- **Performance**: Optimized images, lazy loading, fast builds
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### 🗄️ Database Collections Status
| Collection | Status | Purpose |
|------------|--------|---------|
| `courses` | ✅ Seeded | Course content & pricing |
| `users` | ✅ Functional | User accounts & profiles |
| `enrollments` | 🏗 Schema Ready | Course purchases & progress |
| `intake_responses` | ✅ Complete | Pre-purchase questionnaires |
| `support_tickets` | 🏗 Schema Ready | Customer support |
| `payments` | 🏗 Schema Ready | Payment tracking |
| `admin_settings` | ✅ Seeded | Global configuration |
| `email_templates` | ✅ Seeded | Automated emails |
| `community_access` | 🏗 Schema Ready | WhatsApp/Discord access |
| `user_activity` | 🏗 Schema Ready | Analytics & logging |
| `email_logs` | 🏗 Schema Ready | Email delivery tracking |

## 📝 Complete Intake System Features

### 🔍 5-Step Questionnaire
1. **Personal Information**: Name, email, company, location, timezone
2. **Experience & Goals**: Current level, objectives, time commitment, budget
3. **Course Selection**: AI/Dropshipping courses, Pro/Max plan preferences
4. **Motivation**: Detailed goals, expected outcomes, challenges identification
5. **Legal & Marketing**: GDPR consent, terms acceptance, marketing preferences

### 📊 Data Collection Points
- **Personal Data**: Contact info, company details, location
- **Business Intelligence**: Experience level, goals, budget, time availability
- **Course Preferences**: Course interests, plan selection, pricing preferences
- **Motivation Analysis**: Detailed motivation, expected outcomes, challenge identification
- **Marketing Data**: Acquisition source, language preference, consent status
- **Legal Compliance**: GDPR consent, terms acceptance, data processing agreement

### 🔧 Admin Management Features
- **Response Dashboard**: Overview of all pending intake responses
- **Detailed Review**: Complete user profile and response analysis
- **Approval Workflow**: Approve/reject applications with internal notes
- **Statistics Tracking**: Daily intake numbers, popular courses, trends
- **Status Management**: Track response status and reviewer assignments

### 🛡️ GDPR Compliance Features
- **Explicit Consent**: Clear consent collection for data processing
- **User Rights**: Information about GDPR rights (access, deletion, portability)
- **Privacy Policy**: Links to privacy policy and terms of service
- **Data Transparency**: Clear explanation of data usage
- **Consent Management**: Marketing consent separate from required consents

## 🛣 Next Steps: Phase 1 Completion

### Immediate Priority Options

**Option A: Email Automation System**
- [ ] **Welcome Emails**: Automated emails after intake completion
- [ ] **Status Notifications**: Approval/rejection email sequences
- [ ] **Follow-up Campaigns**: Nurture sequences for qualified leads
- [ ] **Templates**: Professional email templates with branding

**Option B: Course Content Management**
- [ ] **Video Integration**: Mux or similar video hosting platform
- [ ] **Module System**: Course modules with progress tracking
- [ ] **Content Protection**: Enrollment-based access control
- [ ] **Progress Tracking**: User progress through course content

**Option C: Payment Integration**
- [ ] **Stripe Integration**: Credit card payment processing
- [ ] **PayPal Integration**: Alternative payment method
- [ ] **Crypto Payments**: Bitcoin/Ethereum support
- [ ] **Enrollment Creation**: Automatic course access after payment

### Subsequent Implementation Order

4. **Support System** (Ticket management with Cal.com integration)
5. **Community Access** (WhatsApp/Discord automated invitations)
6. **User Dashboard Enhancement** (Progress tracking, course access)
7. **Analytics & Reporting** (Conversion tracking, user behavior)
8. **Performance Optimization** (Caching, CDN, performance monitoring)
9. **Legal Compliance** (Cookie consent, additional GDPR features)
10. **Marketing Tools** (Landing page optimization, A/B testing)

## 🧪 Testing Status

### Intake System Testing ✅
- [x] Complete 5-step form navigation
- [x] Form validation and error handling
- [x] All data types and field validation
- [x] Course selection and plan preferences
- [x] Legal consent and GDPR compliance
- [x] Data submission to Firestore
- [x] Success page redirect and confirmation
- [x] Progress indicator functionality
- [x] Mobile responsiveness

### Admin Interface Testing ✅
- [x] Admin role-based access control
- [x] Intake response listing and filtering
- [x] Detailed response review interface
- [x] Approval/rejection workflow
- [x] Review notes and status tracking
- [x] Statistics dashboard functionality

### Authentication Testing ✅
- [x] Email/password registration and login
- [x] Google OAuth registration and login
- [x] Password reset functionality
- [x] User profile creation in Firestore
- [x] Protected route access control
- [x] Session persistence across browser refresh

### Manual Testing
See `MANUAL_TEST_CHECKLIST.md` for comprehensive testing procedures.

## 🔐 Security Features

### Authentication Security
- **Firebase Auth**: Industry-standard authentication
- **Password Requirements**: Minimum 6 characters
- **Email Verification**: Required for new accounts
- **Session Management**: Secure token-based sessions
- **OAuth Security**: Google OAuth with proper scopes

### Database Security
- **Firestore Rules**: Role-based access control
- **Data Isolation**: Users can only access their own data
- **Admin Protection**: Admin-only operations secured
- **Input Validation**: All inputs validated with Zod schemas

### GDPR Compliance
- **Explicit Consent**: Clear consent collection for all data processing
- **Data Transparency**: Clear information about data usage
- **User Rights**: Access, deletion, portability rights information
- **Privacy Policy**: Comprehensive privacy policy integration
- **Consent Management**: Granular consent for different purposes

### Route Protection
- **Protected Routes**: Authentication required for sensitive pages
- **Role-Based Access**: Different content based on user role (admin interfaces)
- **Automatic Redirects**: Unauthenticated users redirected to login
- **Loading States**: Secure loading states during auth checks

## 🌐 Deployment

### Production Deployment (Ready)
- **Platform**: Vercel
- **Domain**: university-ecom.com (planned)
- **Database**: Firebase Firestore (cloud)
- **Authentication**: Firebase Auth (cloud)
- **CDN**: Vercel Edge Network
- **Analytics**: Plausible (privacy-first)

### Security
- HTTPS enforcement
- CSP headers configured
- XSS protection
- CSRF protection
- Firebase security rules deployed

## 📝 Content Strategy & User Journey

### Target Audience
- European entrepreneurs
- German-speaking market
- Business owners seeking practical AI/E-commerce knowledge

### Course Positioning
- **AI Course**: Business automation, practical tools, no hype
- **Dropshipping Course**: EU-compliant strategies, legal compliance

### Complete User Journey
1. **Discovery**: Homepage → Course pages → Pricing
2. **Qualification**: 5-step intake questionnaire (✅ implemented)
3. **Review**: Admin reviews application and approves/rejects (✅ implemented)
4. **Registration**: Account creation if approved (✅ implemented)
5. **Purchase**: Payment processing (next step)
6. **Learning**: Course access and progress tracking
7. **Community**: WhatsApp/Discord access
8. **Support**: Ticket system and 1-on-1 mentoring

### Pre-Purchase Qualification Process
1. **User completes intake form** (comprehensive 5-step process)
2. **Data stored in Firestore** with pending status
3. **Admin reviews application** in admin dashboard
4. **Approval decision** with internal notes
5. **User notification** (email automation - next step)
6. **Course access** granted after payment

## 🤝 Contributing

### Development Workflow
1. Test intake form completion end-to-end
2. Verify admin interface functionality
3. Test authentication flows manually
4. Verify database operations
5. Ensure TypeScript compliance
6. Check responsive design
7. Verify accessibility
8. Test form validation

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Semantic HTML
- Accessible components
- Performance-first approach
- Comprehensive error handling
- GDPR compliance by design

## 📊 Analytics & Monitoring

### Implemented Tracking
- User registration and login events
- Complete intake form completion and analytics
- Admin review actions and approval rates
- Page views and navigation patterns
- Error logging and monitoring

### Intake System Analytics
- Conversion rates by form step
- Most common drop-off points
- Popular course and plan selections
- Challenge identification trends
- Approval/rejection rates
- Source attribution analysis

### Planned Monitoring
- Course progress tracking
- Payment conversion rates
- Support ticket metrics
- User engagement analytics
- Email campaign performance

## 📞 Support

For development questions or technical issues:
- Check `PROJECT_REFERENCE.json` for detailed specifications
- Review step completion documentation in repo
- Test authentication flows using test accounts
- Verify Firebase configuration and rules
- Test complete intake form submission

### Quick Debug Commands
```bash
# Check Firebase connection
npm run test:firebase

# Verify TypeScript
npm run type-check

# Check build status
npm run build

# Reset database (development only)
npm run setup:firebase
```

### Testing the Intake System
```bash
# Test complete flow
1. Visit /intake
2. Complete all 5 steps
3. Verify data in Firestore
4. Login as admin
5. Review submission at /admin/intake
6. Test approval/rejection workflow
```

## 📄 License

Private project for University Ecom. All rights reserved.

---

**Current Version**: 0.4.0-alpha  
**Last Updated**: January 21, 2025  
**Status**: Complete Intake System with Admin Management - Production Ready  
**Next Milestone**: Choose between Email Automation, Course Content Management, or Payment Integration

**🎉 The intake system is now complete and ready to qualify customers before purchase!**
