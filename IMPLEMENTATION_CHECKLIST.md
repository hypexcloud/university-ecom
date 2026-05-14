# Plan-Based Dashboard Implementation Checklist

## ✅ Phase 1: Database Setup (PRIORITY)

### Firestore Collections
- [ ] Create/Update `enrollments` collection structure
  - [ ] Add `planType` field ('fast' | 'business' | 'infinity')
  - [ ] Add `planId` field (e.g., 'ai-fast', 'ai-business', 'ai-infinity')
  - [ ] Add `planDisplayName` field
  - [ ] Add `mentoring` object for Business/Infinity plans
    - [ ] `mentorId`
    - [ ] `totalSessions`
    - [ ] `sessionsRemaining`
    - [ ] `sessionsCompleted`
    - [ ] `nextSessionDate`
  - [ ] Add `infinityExtras` object for Infinity plan (Dropshipping)
    - [ ] `customWebsite` status tracking
    - [ ] `productResearch` status tracking

- [ ] Update `sessions` collection
  - [ ] Add `enrollmentId` field
  - [ ] Add `planType` field
  - [ ] Add priority flags for Infinity sessions

### Sample Data
- [ ] Create test enrollment for Fast plan user
- [ ] Create test enrollment for Business plan user  
- [ ] Create test enrollment for Infinity plan user
- [ ] Create test sessions for Business/Infinity users

---

## ✅ Phase 2: Component Integration

### Update Components
- [ ] **Replace StudentDashboard.tsx**
  - [ ] Backup existing `StudentDashboard.tsx`
  - [ ] Use new `StudentDashboardPlanBased.tsx`
  - [ ] Test all three plan types

- [ ] **Update student page**
  - [ ] Update `/src/app/student/page.tsx`
  - [ ] Fetch enrollment data with plan type
  - [ ] Pass `planType` to dashboard component
  - [ ] Add loading state
  - [ ] Add error handling for missing enrollment

### New Components Needed
- [ ] `InfinityServicesCard.tsx` - Track custom deliverables
- [ ] `SessionBookingCard.tsx` - Enhanced for priority booking
- [ ] `UpgradePrompt.tsx` - CTA for Fast plan users
- [ ] `PlanBadge.tsx` - Reusable plan indicator

---

## ✅ Phase 3: API Endpoints

### Create New Endpoints
- [ ] `GET /api/enrollments/[enrollmentId]`
  - [ ] Fetch enrollment with all plan details
  - [ ] Include progress data
  - [ ] Include session counts for Business/Infinity
  - [ ] Include infinity extras status

- [ ] `GET /api/enrollments/user/[userId]/active`
  - [ ] Get user's active enrollment
  - [ ] Filter by status === 'active'

- [ ] `PATCH /api/enrollments/[enrollmentId]/infinity-extras`
  - [ ] Update custom website status
  - [ ] Update product research status
  - [ ] Add completion notes

- [ ] `POST /api/sessions/request-additional` (Infinity only)
  - [ ] Allow Infinity users to request extra sessions
  - [ ] Notify admins/mentors
  - [ ] Track additional session requests

### Update Existing Endpoints
- [ ] Update `GET /api/get-sessions`
  - [ ] Filter sessions by enrollmentId
  - [ ] Add plan-based filtering
  - [ ] Return priority status for Infinity

- [ ] Update `POST /api/sessions/book`
  - [ ] Check session availability based on plan
  - [ ] Validate remaining sessions for Business
  - [ ] Allow unlimited for Infinity

---

## ✅ Phase 4: Frontend Features

### Fast Plan Implementation
- [ ] Show all course modules
- [ ] Hide Mentoring tab
- [ ] Add upgrade CTA in sidebar
- [ ] Test self-paced learning flow
- [ ] Verify no session booking access

### Business Plan Implementation  
- [ ] Show Mentoring tab
- [ ] Display session counter badge
- [ ] Show next session card in overview
- [ ] Implement session booking
- [ ] Display remaining sessions (e.g., "2 of 6 remaining")
- [ ] Show completed sessions history

### Infinity Plan Implementation
- [ ] Show enhanced Mentoring tab
- [ ] Display Premium Services card
  - [ ] Custom website status tracker
  - [ ] Product research status tracker
- [ ] Add crown (👑) indicators for premium features
- [ ] Enable "Request Additional Session" button
- [ ] Show priority support contact
- [ ] Test done-for-you tracking

---

## ✅ Phase 5: Navigation & Routing

### Protected Routes
- [ ] `/student/book-session` - Only Business/Infinity
- [ ] `/student/termine` - Only Business/Infinity  
- [ ] `/student/infinity-services` - Only Infinity
- [ ] `/student/course/*` - All plans
- [ ] `/student/profile` - All plans

### Redirects & Guards
- [ ] Redirect Fast users from /book-session to upgrade page
- [ ] Show 403 error if accessing mentoring without permission
- [ ] Redirect to appropriate dashboard on login based on plan

---

## ✅ Phase 6: UI/UX Polish

### Design Elements
- [ ] Plan badge colors
  - [ ] Fast: Gray (`bg-gray-600`)
  - [ ] Business: Gold gradient
  - [ ] Infinity: Purple-blue gradient
- [ ] Crown icons (👑) for Infinity features
- [ ] Color-coded checkmarks
  - [ ] Fast: Blue
  - [ ] Business: Green
  - [ ] Infinity: Purple
- [ ] Premium card gradients for Infinity

### Responsive Design
- [ ] Test mobile layout (all plans)
- [ ] Test tablet layout
- [ ] Ensure tabs work on small screens
- [ ] Verify card stacking on mobile

### Accessibility
- [ ] Add ARIA labels for plan badges
- [ ] Ensure screen reader support for tabs
- [ ] Add keyboard navigation
- [ ] Test color contrast for badges

---

## ✅ Phase 7: Session Management

### Session Booking Logic
- [ ] Calculate available sessions based on plan
  - [ ] Fast: 0 sessions
  - [ ] Business: 6 (AI) / 4 (Dropshipping)
  - [ ] Infinity: 6+ (unlimited requests)
- [ ] Prevent Fast users from booking
- [ ] Show "Session limit reached" for Business when 0 remaining
- [ ] Allow Infinity to request additional sessions

### Session Display
- [ ] Show next upcoming session
- [ ] Display all upcoming sessions
- [ ] Show completed sessions with notes
- [ ] Add meeting links for scheduled sessions
- [ ] Calendar integration (optional)

---

## ✅ Phase 8: Infinity Premium Features

### Custom Website Tracking (Dropshipping)
- [ ] Status states: not_started, in_progress, completed, delivered
- [ ] Display progress bar
- [ ] Show assigned developer
- [ ] Add notes field
- [ ] Display website URL when completed

### Product Research Tracking (Dropshipping)
- [ ] Status states: not_started, in_progress, completed
- [ ] Display found products count
- [ ] Link to research report PDF
- [ ] Show completion date
- [ ] Add notes/recommendations

### Admin Panel for Infinity
- [ ] Create Infinity orders dashboard
- [ ] Track custom website assignments
- [ ] Update product research status
- [ ] Assign developers to projects
- [ ] Notify students of completions

---

## ✅ Phase 9: Notifications & Emails

### Email Templates
- [ ] Session booking confirmation (Business/Infinity)
- [ ] Session reminder (24 hours before)
- [ ] Session completed with notes
- [ ] Infinity: Custom website ready
- [ ] Infinity: Product research completed
- [ ] Infinity: Additional session approved

### In-App Notifications
- [ ] Session scheduled notification
- [ ] Session starting soon (30 min before)
- [ ] Module completion badges
- [ ] Infinity deliverable updates

---

## ✅ Phase 10: Analytics & Tracking

### User Analytics
- [ ] Track engagement by plan type
- [ ] Monitor session completion rates
- [ ] Track upgrade conversions (Fast → Business)
- [ ] Monitor Infinity extra delivery times

### Admin Dashboard
- [ ] Plan distribution chart
- [ ] Active enrollments by plan
- [ ] Session utilization rates
- [ ] Infinity deliverables pipeline
- [ ] Revenue by plan type

---

## ✅ Phase 11: Testing

### Unit Tests
- [ ] Test plan detection logic
- [ ] Test session availability calculation
- [ ] Test Infinity extras status updates
- [ ] Test enrollment queries

### Integration Tests
- [ ] Test Fast plan user flow
- [ ] Test Business plan session booking
- [ ] Test Infinity plan premium features
- [ ] Test plan upgrade process

### User Acceptance Testing
- [ ] Fast plan user walkthrough
- [ ] Business plan user walkthrough
- [ ] Infinity plan user walkthrough
- [ ] Admin panel for Infinity tracking

---

## ✅ Phase 12: Documentation

### Developer Docs
- [ ] Document enrollment data structure
- [ ] Document API endpoints
- [ ] Document component props
- [ ] Add code comments

### User Guides
- [ ] Fast Plan user guide
- [ ] Business Plan user guide
- [ ] Infinity Plan user guide
- [ ] Session booking guide
- [ ] How to request additional sessions (Infinity)

### Admin Guides
- [ ] How to manage Infinity deliverables
- [ ] How to assign developers
- [ ] How to track custom websites
- [ ] How to update research status

---

## ✅ Phase 13: Deployment

### Pre-Deployment
- [ ] Run all tests
- [ ] Check Firestore security rules
- [ ] Review API rate limits
- [ ] Test with production data subset
- [ ] Backup existing data

### Deployment Steps
- [ ] Deploy Firestore rule updates
- [ ] Deploy backend API changes
- [ ] Deploy frontend changes
- [ ] Run database migrations
- [ ] Test on staging environment

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Verify analytics tracking
- [ ] Test each plan type in production
- [ ] Monitor performance metrics

---

## ✅ Phase 14: Migration (For Existing Users)

### Data Migration
- [ ] Identify existing enrollments
- [ ] Determine plan type for each user
  - [ ] Check payment records
  - [ ] Review order history
- [ ] Add `planType` to all enrollments
- [ ] Migrate session data
- [ ] Update user records

### User Communication
- [ ] Email users about new dashboard
- [ ] Highlight their plan benefits
- [ ] Link to user guides
- [ ] Announce new features
- [ ] Provide support channel

---

## Quick Start Commands

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Update environment variables
# Add any new Firebase config or API keys

# 3. Run development server
npm run dev

# 4. Test the new dashboard
# Visit: http://localhost:3000/student
# Change planType in mock data to test each plan

# 5. Build for production
npm run build

# 6. Deploy
vercel --prod
```

---

## Testing URLs

```
Fast Plan Test:    /student?test=fast
Business Plan Test: /student?test=business
Infinity Plan Test: /student?test=infinity
```

---

## Support Channels

- **Developer Questions**: Check PLAN_BASED_DASHBOARD.md
- **Data Structure**: Check FIRESTORE_PLAN_STRUCTURE.md  
- **Visual Guide**: Check PLAN_VISUAL_COMPARISON.md
- **Component Code**: StudentDashboardPlanBased.tsx

---

## Priority Order

1. ✅ **CRITICAL**: Database setup (Phase 1)
2. ✅ **HIGH**: Component integration (Phase 2)
3. ✅ **HIGH**: API endpoints (Phase 3)
4. ✅ **MEDIUM**: Fast/Business features (Phase 4)
5. ✅ **MEDIUM**: Infinity features (Phase 8)
6. ✅ **LOW**: Polish & optimization (Phase 6)
7. ✅ **LOW**: Testing & deployment (Phase 11-13)

---

## Estimated Timeline

- **Phase 1-3** (Database, Components, APIs): 2-3 days
- **Phase 4-5** (Features, Routing): 2-3 days
- **Phase 6-8** (UI, Sessions, Infinity): 2-3 days
- **Phase 9-11** (Notifications, Analytics, Testing): 2-3 days
- **Phase 12-14** (Docs, Deployment, Migration): 1-2 days

**Total**: ~2 weeks for complete implementation

---

## Notes

- Start with Fast plan as baseline
- Then implement Business (adds mentoring)
- Finally add Infinity premium features
- Test each plan independently
- Use feature flags for gradual rollout

---

✨ **Ready to start? Begin with Phase 1: Database Setup!**
