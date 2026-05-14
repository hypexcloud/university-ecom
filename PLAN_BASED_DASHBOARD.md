# Plan-Based Student Dashboard System

## Overview
The student dashboard now intelligently displays content based on the user's subscription plan type. This ensures students see only relevant features and prevents confusion.

## Plan Types

### 1. **Fast Plan** (€200)
**Target**: Self-learners who want access to all course content

**Dashboard Features**:
- ✅ Full course module access (all video content)
- ✅ Course materials and templates
- ✅ Progress tracking
- ✅ Community access
- ❌ No 1:1 mentoring sessions
- ❌ No direct support sessions

**Dashboard Sections**:
- Overview: Progress stats, next steps, quick actions
- Courses: Self-paced module navigation with all resources
- NO Mentoring tab (hidden)

### 2. **Business Plan** (€1,000)
**Target**: Students wanting accelerated learning with mentoring

**Dashboard Features**:
- ✅ Everything from Fast Plan
- ✅ 1:1 Mentoring sessions (6 sessions for AI course)
- ✅ Session booking system
- ✅ Direct mentor support
- ✅ Weekly check-ins
- ✅ Personalized feedback

**Dashboard Sections**:
- Overview: Progress + Next session card
- Courses: Full module access
- Mentoring: Session booking, upcoming sessions, completed sessions

### 3. **Infinity Plan** (€1,400 AI / €3,000 Dropshipping)
**Target**: Students wanting complete premium experience

**Dashboard Features**:
- ✅ Everything from Business Plan
- ✅ Premium coaching
- ✅ Priority support
- ✅ Unlimited Q&A access
- ✅ **Custom website** (Dropshipping: fully coded website)
- ✅ **Product research** (Dropshipping: winning product research)
- ✅ Advanced strategy sessions

**Dashboard Sections**:
- Overview: Progress + Sessions + Infinity Premium Services card
- Courses: Full module access with premium support indicators
- Mentoring: Enhanced session booking with priority support

## Technical Implementation

### Component Structure
```
StudentDashboardPlanBased.tsx
├── Plan Detection (from enrollment data)
├── Dynamic Tab Rendering
│   ├── Overview (All plans)
│   ├── Courses (All plans)
│   └── Mentoring (Business & Infinity only)
├── Conditional Feature Cards
│   ├── Next Session (Business & Infinity)
│   ├── Infinity Services (Infinity only)
│   └── Upgrade CTA (Fast only)
└── Permission-based Actions
```

### Data Model

```typescript
interface EnrollmentData {
  courseType: 'ai_automation' | 'eu_dropshipping'
  courseName: string
  planType: 'fast' | 'business' | 'infinity'
  planDisplayName: string
  startDate: Date
  progress: {
    currentWeek: number
    totalWeeks: number
    completedModules: number
    totalModules: number
    totalProgress: number
  }
  // Mentoring (Business & Infinity)
  sessionsRemaining?: number
  totalSessions?: number
  // Infinity extras
  hasCustomWebsite?: boolean
  hasProductResearch?: boolean
}
```

## User Experience Flow

### Fast Plan User Journey
1. **Login** → See course content immediately
2. **Courses Tab** → Browse and start modules
3. **Self-paced learning** → Progress through content
4. **No mentoring prompts** → Clear focus on content
5. **Optional**: See upgrade CTA for mentoring

### Business Plan User Journey
1. **Login** → See next scheduled session (if any)
2. **Book Sessions** → Schedule 1:1 coaching
3. **Attend Sessions** → Get personalized support
4. **Course Progress** → Learn with mentor guidance
5. **Check-ins** → Regular progress reviews

### Infinity Plan User Journey
1. **Login** → See complete premium dashboard
2. **Premium Services** → Track custom deliverables
3. **Unlimited Support** → Priority assistance
4. **Advanced Sessions** → Strategy and implementation
5. **Done-for-you** → Custom website & product research (Dropshipping)

## Dashboard Sections Breakdown

### Overview Tab (All Plans)
- Welcome header with plan badge
- Quick stats (Progress, Modules, Week)
- Business/Infinity: Session stats
- Progress card with current week info
- Infinity: Premium services tracking
- Quick action buttons
- Plan features list

### Courses Tab (All Plans)
- Module list with progress indicators
- Week-by-week structure
- Resource breakdown (videos, PDFs, quizzes, templates)
- Start/Continue/Review buttons
- Locked modules for sequential learning

### Mentoring Tab (Business & Infinity Only)
- Session booking interface
- Available sessions counter
- Upcoming sessions list with meeting links
- Completed sessions history
- Session notes and feedback
- Infinity: Priority booking indicators

## Visual Hierarchy

### Plan Badge Colors
- **Fast Plan**: Gray (`bg-gray-600`)
- **Business Plan**: Gold gradient (`bg-gradient-to-r from-yellow-500 to-yellow-600`)
- **Infinity Plan**: Purple-Blue gradient (`bg-gradient-to-r from-purple-600 to-blue-600`)

### Feature Indicators
- Fast: Blue checkmarks
- Business: Green checkmarks (includes mentoring)
- Infinity: Purple checkmarks (premium features)

## Implementation Steps

### Phase 1: Backend Setup
1. Add `planType` to user enrollment records in Firestore
2. Store session allocation based on plan
3. Track Infinity premium deliverables (custom website, product research)

### Phase 2: Frontend Updates
1. Replace `StudentDashboard.tsx` usage with `StudentDashboardPlanBased.tsx`
2. Update `/student/page.tsx` to pass plan data
3. Fetch enrollment data from Firestore including plan type

### Phase 3: Session Logic
1. Business/Infinity: Show session booking
2. Calculate remaining sessions
3. Infinity: Add unlimited session request option

### Phase 4: Infinity Features
1. Add Premium Services tracking card
2. Track custom website status
3. Track product research status
4. Display done-for-you deliverables

## API Endpoints Needed

### Get Enrollment with Plan
```typescript
GET /api/enrollments/:enrollmentId
Response: {
  enrollmentId: string
  userId: string
  courseType: string
  planType: 'fast' | 'business' | 'infinity'
  progress: {...}
  sessionsRemaining?: number
  hasCustomWebsite?: boolean
  hasProductResearch?: boolean
}
```

### Book Session (Business & Infinity)
```typescript
POST /api/sessions/book
Body: {
  enrollmentId: string
  mentorId: string
  preferredDate: Date
  topic: string
}
```

### Request Additional Session (Infinity)
```typescript
POST /api/sessions/request-infinity
Body: {
  enrollmentId: string
  reason: string
}
```

## Testing Scenarios

### Test Case 1: Fast Plan User
- ✅ Can access all course modules
- ✅ Sees progress tracking
- ❌ Cannot see Mentoring tab
- ❌ Cannot book sessions
- ✅ Sees upgrade CTA

### Test Case 2: Business Plan User
- ✅ Can access all course modules
- ✅ Can see Mentoring tab
- ✅ Can book sessions (limited count)
- ✅ Sees next session in overview
- ❌ No Infinity premium features

### Test Case 3: Infinity Plan User
- ✅ Can access all course modules
- ✅ Can see Mentoring tab
- ✅ Can book sessions (extended count)
- ✅ Sees Infinity premium services
- ✅ Can track custom deliverables
- ✅ Has priority support indicators

## Future Enhancements

1. **Analytics Dashboard**: Track engagement by plan type
2. **Upgrade Flow**: In-app upgrade from Fast → Business or Business → Infinity
3. **Session Recordings**: Store past session recordings (Business & Infinity)
4. **Certificate Generation**: Automated certificates upon completion
5. **Community Tiers**: Different Discord channels by plan type
6. **Gamification**: Badges and achievements
7. **Progress Milestones**: Celebrate weekly/module completions
8. **Smart Recommendations**: AI-powered next steps based on progress

## Notes for Development

- Always check `enrollment.planType` before rendering mentoring features
- Keep Fast plan experience clean and focused on content
- Highlight value of higher tiers without being pushy
- Use conditional rendering for all plan-specific features
- Store plan type in enrollment record for easy filtering
- Consider plan changes (upgrades/downgrades) in data model
