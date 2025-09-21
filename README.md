# University Ecom

Professional AI & Dropshipping courses for entrepreneurs in Europe. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

University Ecom is a modern e-learning platform focused on practical business education for European entrepreneurs. We offer specialized courses in AI automation and EU-compliant Dropshipping strategies.

### Key Features

- 🚀 **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- 🌍 **EU-Focused**: GDPR-compliant, VAT-ready, German market expertise
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🎨 **Professional UI**: Clean, conversion-optimized design
- 🔐 **Security First**: HTTPS, CSP headers, data protection

## 🛠 Tech Stack

- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Deployment**: Vercel (planned)
- **Backend**: Firebase (planned for Phase 1)

## 📁 Project Structure

```
university-ecom/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About page
│   │   ├── courses/           # Course pages
│   │   ├── pricing/           # Pricing pages
│   │   ├── legal/             # Legal pages
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   └── providers/         # Context providers
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── PROJECT_REFERENCE.json    # Project documentation
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

### Installation

1. **Clone and navigate to project**:
   ```bash
   cd /Users/lavdim/Desktop/UniEC/university-ecom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 📋 Current Status

**Phase 0: Foundation Complete ✅**

All core pages and components are implemented and working:

### ✅ Completed Features

- **Responsive Design**: Works perfectly on all devices
- **Navigation**: Desktop dropdown menus + mobile sheet menu
- **Core Pages**: Homepage, About, Courses, Pricing, 404
- **Course Content**: Detailed AI and Dropshipping course pages
- **SEO Ready**: Metadata, Open Graph, Twitter Cards
- **Performance**: Optimized images, lazy loading, fast builds
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### 🔧 Placeholder Pages (Ready for Implementation)

- Authentication (`/login`, `/dashboard`)
- Purchase Flow (`/checkout`)
- Support System (`/support`)
- Community (`/community`)
- Reviews (`/reviews`)
- Legal Pages (`/legal/*`)

## 🎨 Design System

### Colors
- **Primary**: Dark neutral (`hsl(240 9% 9%)`)
- **Secondary**: Light gray (`hsl(240 4.8% 95.9%)`)
- **Accent**: Consistent with secondary
- **Muted**: Light background tones

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 4xl-5xl for H1, 3xl for H2
- **Body**: Base to xl sizing
- **Hierarchy**: Clear visual hierarchy

### Components
- **Buttons**: Multiple variants (primary, outline, ghost)
- **Cards**: Hover effects, consistent spacing
- **Navigation**: Dropdown menus, mobile-first
- **Forms**: Accessible, validated inputs

## 🛣 Next Steps: Phase 1 MVP

### Priority Implementation Order

1. **Database Setup** (Firebase Firestore)
2. **Intake System** (Pre-purchase questionnaire)
3. **Authentication** (Firebase Auth)
4. **Video Content** (Mux integration)
5. **Payment Processing** (Stripe + PayPal + Crypto)
6. **Progress Tracking** (Weekly feedback)
7. **Support System** (Cal.com + tickets)
8. **Email Automation** (SendGrid)
9. **Community Access** (WhatsApp/Discord)
10. **Legal Compliance** (GDPR + Cookie consent)

### Environment Variables Needed

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... (see .env.example for complete list)
```

## 🧪 Testing

### Manual Testing
See `MANUAL_TEST_CHECKLIST.md` for comprehensive testing procedures.

### Automated Testing (Planned)
- Unit tests with Jest
- E2E tests with Playwright
- Lighthouse performance tests

## 🌐 Deployment

### Production Deployment (Planned)
- **Platform**: Vercel
- **Domain**: university-ecom.com
- **CDN**: Vercel Edge Network
- **Analytics**: Plausible (privacy-first)

### Security
- HTTPS enforcement
- CSP headers configured
- XSS protection
- CSRF protection

## 📝 Content Strategy

### Target Audience
- European entrepreneurs
- German-speaking market
- Business owners seeking practical AI/E-commerce knowledge

### Course Positioning
- **AI Course**: Business automation, practical tools, no hype
- **Dropshipping Course**: EU-compliant strategies, legal compliance

### Tone & Voice
- Professional but approachable
- Results-oriented
- Transparent and trustworthy
- Community-focused

## 🤝 Contributing

### Development Workflow
1. Test manually using checklist
2. Ensure TypeScript compliance
3. Verify responsive design
4. Check accessibility
5. Optimize performance

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Semantic HTML
- Accessible components
- Performance-first approach

## 📞 Support

For development questions or technical issues:
- Check `PROJECT_REFERENCE.json` for detailed specifications
- Review `MANUAL_TEST_CHECKLIST.md` for testing procedures
- Ensure all dependencies are properly installed

## 📄 License

Private project for University Ecom. All rights reserved.

---

**Current Version**: 0.1.0-alpha  
**Last Updated**: January 21, 2025  
**Status**: Foundation Complete, Ready for Phase 1 Implementation
