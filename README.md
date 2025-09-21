# University Ecom

Professional AI & Dropshipping courses for entrepreneurs in Europe. Built with Next.js 15, TypeScript, Firebase, and Tailwind CSS.

## 🎯 Project Overview

University Ecom is a modern e-learning platform focused on practical business education for European entrepreneurs. We offer specialized courses in AI automation and EU-compliant Dropshipping strategies.

### Key Features

- 🚀 **Modern Tech Stack**: Next.js 15, TypeScript, Firebase, Tailwind CSS, shadcn/ui
- 🔐 **Authentication**: Firebase Auth with Google OAuth and email/password
- 🗄️ **Database**: Firestore with comprehensive data management
- 🌍 **EU-Focused**: GDPR-compliant, VAT-ready, German market expertise
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🎨 **Professional UI**: Clean, conversion-optimized design
- 🛡️ **Security First**: Role-based access control, protected routes

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
│   │   ├── legal/               # Legal pages
│   │   └── not-found.tsx        # 404 page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── forms/               # Form components
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

**Phase 1: Core Systems Complete ✅**

### ✅ Completed Features

**Foundation (Step 1)**
- ✅ **Database Schema**: Complete Firestore setup with 11 collections
- ✅ **Type Safety**: Comprehensive TypeScript definitions
- ✅ **Service Layer**: Generic CRUD operations with specialized services
- ✅ **Security Rules**: Role-based access control for database and storage
- ✅ **Data Seeding**: Automated initial data setup with courses and settings

**Intake System (Step 2)**
- ✅ **Multi-Step Form**: 5-step questionnaire with progress tracking
- ✅ **Form Validation**: Zod schemas with German error messages
- ✅ **Data Collection**: Personal info, experience, goals, and preferences
- ✅ **Success Flow**: Confirmation page with next steps
- ✅ **Database Integration**: Responses stored in Firestore for admin review

**Authentication (Step 3)**
- ✅ **Firebase Auth**: Email/password and Google OAuth integration
- ✅ **User Management**: Automatic Firestore profile creation
- ✅ **Protected Routes**: Component-based route guards with role-based access
- ✅ **Professional UI**: Login/register forms with validation
- ✅ **Session Management**: Persistent authentication state
- ✅ **Dashboard**: Protected user dashboard with profile information

### 🎨 Design System Complete
- **Responsive Design**: Works perfectly on all devices
- **Navigation**: Desktop dropdown menus + mobile sheet menu
- **Core Pages**: Homepage, About, Courses, Pricing, Login, Register, Dashboard
- **UI Components**: Professional shadcn/ui component library
- **SEO Ready**: Metadata, Open Graph, Twitter Cards
- **Performance**: Optimized images, lazy loading, fast builds
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### 🗄️ Database Collections Ready
| Collection | Status | Purpose |
|------------|--------|---------|
| `courses` | ✅ Seeded | Course content & pricing |
| `users` | ✅ Schema Ready | User accounts & profiles |
| `enrollments` | 🏗 Schema Ready | Course purchases & progress |
| `intake_responses` | ✅ Functional | Pre-purchase questionnaires |
| `support_tickets` | 🏗 Schema Ready | Customer support |
| `payments` | 🏗 Schema Ready | Payment tracking |
| `admin_settings` | ✅ Seeded | Global configuration |
| `email_templates` | ✅ Seeded | Automated emails |
| `community_access` | 🏗 Schema Ready | WhatsApp/Discord access |
| `user_activity` | 🏗 Schema Ready | Analytics & logging |
| `email_logs` | 🏗 Schema Ready | Email delivery tracking |

## 🛣 Next Steps: Phase 1 Completion

### Immediate Priority (Pick One Path)

**Option A: Complete Intake System**
- [ ] **Step 3**: Course & Plan Selection (checkboxes, plan comparison)
- [ ] **Step 4**: Motivation & Challenges (textarea, checkbox list) 
- [ ] **Step 5**: Marketing Consent & Legal (GDPR compliance, terms)
- [ ] **Admin Interface**: Review and manage intake responses

**Option B: Course Content Management**
- [ ] **Video Integration**: Mux or similar video hosting
- [ ] **Module System**: Course modules with progress tracking
- [ ] **Content Protection**: Enrollment-based access control
- [ ] **Progress Tracking**: User progress through course content

**Option C: Payment System**
- [ ] **Stripe Integration**: Credit card payments
- [ ] **PayPal Integration**: Alternative payment method
- [ ] **Crypto Payments**: Bitcoin/Ethereum support
- [ ] **Enrollment Creation**: Automatic course access after payment

### Subsequent Implementation Order

4. **Email Automation** (SendGrid integration)
5. **Support System** (Ticket management)
6. **Community Access** (WhatsApp/Discord integration)
7. **User Dashboard Enhancement** (Progress tracking, course access)
8. **Admin Panel** (User management, analytics)
9. **Legal Compliance** (GDPR compliance, cookie consent)
10. **Performance Optimization** (Caching, CDN)

## 🧪 Testing

### Authentication Testing ✅
- [x] Email/password registration and login
- [x] Google OAuth registration and login
- [x] Password reset functionality
- [x] User profile creation in Firestore
- [x] Protected route access control
- [x] Session persistence across browser refresh

### Intake System Testing ✅
- [x] Multi-step form navigation
- [x] Form validation and error handling
- [x] Data submission to Firestore
- [x] Success page redirect
- [x] Progress indicator functionality

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

### Route Protection
- **Protected Routes**: Authentication required for sensitive pages
- **Role-Based Access**: Different content based on user role
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

## 📝 Content Strategy

### Target Audience
- European entrepreneurs
- German-speaking market
- Business owners seeking practical AI/E-commerce knowledge

### Course Positioning
- **AI Course**: Business automation, practical tools, no hype
- **Dropshipping Course**: EU-compliant strategies, legal compliance

### User Journey
1. **Discovery**: Homepage → Course pages → Pricing
2. **Qualification**: Intake questionnaire (implemented)
3. **Registration**: Account creation (implemented)
4. **Purchase**: Payment processing (next step)
5. **Learning**: Course access and progress tracking
6. **Community**: WhatsApp/Discord access
7. **Support**: Ticket system and 1-on-1 mentoring

## 🤝 Contributing

### Development Workflow
1. Test authentication flows manually
2. Verify database operations
3. Ensure TypeScript compliance
4. Check responsive design
5. Verify accessibility
6. Test form validation

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Semantic HTML
- Accessible components
- Performance-first approach
- Comprehensive error handling

## 📊 Analytics & Monitoring

### Implemented Tracking
- User registration and login events
- Intake form completion
- Page views and navigation
- Error logging and monitoring

### Planned Monitoring
- Course progress tracking
- Payment conversion rates
- Support ticket metrics
- User engagement analytics

## 📞 Support

For development questions or technical issues:
- Check `PROJECT_REFERENCE.json` for detailed specifications
- Review step completion documentation in repo
- Test authentication flows using test accounts
- Verify Firebase configuration and rules

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

## 📄 License

Private project for University Ecom. All rights reserved.

---

**Current Version**: 0.3.0-alpha  
**Last Updated**: January 21, 2025  
**Status**: Core Systems Complete - Ready for Course Content or Payment Integration  
**Next Milestone**: Choose between completing intake system, implementing course content, or adding payment processing
