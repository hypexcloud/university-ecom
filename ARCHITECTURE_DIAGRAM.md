# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        University Ecom                           │
│                     E-Learning Platform                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐       ┌───────▼────────┐
            │  Public Site   │       │ Student Portal  │
            │   (Marketing)  │       │   (Dashboard)   │
            └────────────────┘       └───────┬─────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                    ┌─────────▼──────┐  ┌───▼────┐  ┌─────▼─────┐
                    │  Fast Dashboard │  │Business│  │  Infinity  │
                    │   (Self-paced)  │  │ (+ 1:1)│  │(Premium)  │
                    └─────────────────┘  └────────┘  └───────────┘
```

## Plan-Based Access Flow

```
                        User Login
                            │
                            ▼
                   Check Enrollment
                            │
            ┌───────────────┼───────────────┐
            │               │               │
        ┌───▼───┐      ┌────▼────┐    ┌────▼────┐
        │ Fast  │      │Business │    │Infinity │
        │ Plan  │      │  Plan   │    │  Plan   │
        └───┬───┘      └────┬────┘    └────┬────┘
            │               │               │
            ▼               ▼               ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │   Show:       │  │   Show:       │  │   Show:       │
    │ • Overview    │  │ • Overview    │  │ • Overview    │
    │ • Kurse       │  │ • Kurse       │  │ • Kurse       │
    │               │  │ • Mentoring   │  │ • Mentoring   │
    │   Hide:       │  │               │  │ • Premium 👑  │
    │ • Mentoring   │  │               │  │               │
    └───────────────┘  └───────────────┘  └───────────────┘
```

## Component Hierarchy

```
StudentDashboardPlanBased
│
├── Header (Welcome + Plan Badge)
│   ├── Plan Badge (Dynamic Color)
│   └── Course Info
│
├── Quick Stats Row
│   ├── Progress Card
│   ├── Sessions Card (Business/Infinity)
│   ├── Modules Card
│   └── Week Card
│
├── Tabs Navigation
│   ├── Overview Tab (All Plans)
│   ├── Kurse Tab (All Plans)
│   └── Mentoring Tab (Business/Infinity Only)
│
├── Overview Tab Content
│   ├── Left Column (2/3 width)
│   │   ├── Next Session Card (Business/Infinity)
│   │   ├── Progress Card
│   │   ├── Infinity Services Card (Infinity Only)
│   │   └── Recent Sessions (Business/Infinity)
│   │
│   └── Right Column (1/3 width)
│       ├── Quick Actions
│       ├── Plan Features List
│       └── Upgrade CTA (Fast Only)
│
├── Kurse Tab Content
│   └── Course Modules List
│       ├── Module 1 (Week 1-2)
│       ├── Module 2 (Week 3-4)
│       └── ... (All modules)
│
└── Mentoring Tab Content (Business/Infinity)
    ├── Session Booking Card
    ├── Upcoming Sessions
    └── Completed Sessions History
```

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Student)  │
└──────┬──────┘
       │ 1. Load Dashboard
       ▼
┌─────────────────┐
│  /student page  │
│                 │
│ useEffect()     │──2. Fetch Data──┐
└─────────┬───────┘                 │
          │                         │
          │ 3. Pass Props           │
          ▼                         │
┌───────────────────────┐           │
│StudentDashboardPlan   │           │
│       Based           │           ▼
│                       │    ┌──────────────┐
│ - Check planType      │◄───│ Firestore DB │
│ - Render components   │    │              │
│ - Show/hide features  │    │ • enrollments│
│                       │    │ • sessions   │
└───────┬───────────────┘    │ • courses    │
        │                    └──────────────┘
        │ 4. Conditional Rendering
        │
        ├─── Fast: Show Courses Only
        │
        ├─── Business: Show Courses + Mentoring
        │
        └─── Infinity: Show All + Premium Features
```

## Session Booking Flow (Business/Infinity)

```
Student Action
     │
     ├─► Click "Session buchen"
     │
     ▼
Check Sessions Available
     │
     ├─► Fast: Show "Upgrade Required"
     │
     ├─► Business: Check remaining < totalSessions
     │   │
     │   ├─► Yes: Show booking calendar
     │   └─► No: Show "No sessions remaining"
     │
     └─► Infinity: Allow booking OR request additional
         │
         ▼
    Select Date/Time
         │
         ▼
    Create Session Doc in Firestore
         │
         ▼
    Send Confirmation Email
         │
         ▼
    Update Enrollment (sessionsScheduled++)
         │
         ▼
    Notify Mentor
         │
         ▼
    Show Success + Calendar Event
```

## Infinity Premium Services Flow (Dropshipping)

```
Student Enrolls in Infinity Plan
         │
         ▼
Admin Receives Notification
         │
         ├─► Custom Website Request
         │   │
         │   ├─► Assign to Developer
         │   │
         │   ├─► Update Status: in_progress
         │   │
         │   ├─► Developer Builds Site
         │   │
         │   ├─► Update Status: completed
         │   │
         │   ├─► Add Website URL
         │   │
         │   └─► Notify Student
         │
         └─► Product Research Request
             │
             ├─► Assign to Researcher
             │
             ├─► Update Status: in_progress
             │
             ├─► Research Top Products
             │
             ├─► Create Report PDF
             │
             ├─► Update Status: completed
             │
             ├─► Upload Report to Storage
             │
             └─► Notify Student
```

## Database Collections Structure

```
Firestore
│
├── enrollments/
│   ├── {enrollmentId}/
│   │   ├── userId: string
│   │   ├── courseId: string
│   │   ├── courseType: 'ai' | 'dropshipping'
│   │   ├── planType: 'fast' | 'business' | 'infinity'
│   │   ├── progress: {...}
│   │   ├── mentoring: {...} (Business/Infinity)
│   │   └── infinityExtras: {...} (Infinity only)
│
├── sessions/
│   ├── {sessionId}/
│   │   ├── enrollmentId: string
│   │   ├── userId: string
│   │   ├── mentorId: string
│   │   ├── scheduledAt: Timestamp
│   │   ├── status: 'scheduled' | 'completed' | ...
│   │   ├── meetingLink: string
│   │   └── completionNotes: string
│
├── courses/
│   ├── {courseId}/
│   │   ├── type: 'ai' | 'dropshipping'
│   │   ├── name: string
│   │   ├── modules: [...]
│   │   └── plans: [...]
│
└── users/
    ├── {userId}/
    │   ├── email: string
    │   ├── role: 'kunde'
    │   └── activeEnrollmentId: string
```

## API Routes Architecture

```
/api/
│
├── enrollments/
│   ├── [enrollmentId]/
│   │   ├── GET    → Fetch enrollment with plan details
│   │   └── infinity-extras/
│   │       └── PATCH → Update Infinity deliverables
│   │
│   └── user/
│       └── [userId]/
│           └── active/
│               └── GET → Get user's active enrollment
│
├── sessions/
│   ├── book/
│   │   └── POST → Book a new session
│   │
│   ├── get-sessions/
│   │   └── GET → Fetch user's sessions
│   │
│   └── request-additional/
│       └── POST → Request extra session (Infinity)
│
└── courses/
    └── [courseId]/
        └── GET → Fetch course details
```

## State Management Flow

```
Component Mount
     │
     ▼
useEffect() → Fetch enrollment data
     │
     ▼
Set State:
  - enrollment: EnrollmentData
  - sessions: Session[]
  - modules: CourseModule[]
  - loading: boolean
     │
     ▼
Derive Computed Values:
  - hasMentoringAccess = planType in ['business', 'infinity']
  - hasInfinityFeatures = planType === 'infinity'
  - upcomingSessions = filter + sort sessions
  - nextSession = first upcoming
     │
     ▼
Conditional Rendering:
  - If Fast → Hide Mentoring tab
  - If Business → Show Sessions (limited)
  - If Infinity → Show Premium features
     │
     ▼
User Interactions → Update State → Re-render
```

## Security & Permissions

```
┌─────────────────────────────────────────────┐
│          Firestore Security Rules           │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌───▼────┐
   │  Fast   │  │Business │  │Infinity│
   │  Plan   │  │  Plan   │  │  Plan  │
   └────┬────┘  └────┬────┘  └───┬────┘
        │            │            │
        ▼            ▼            ▼
   Can Read:    Can Read:    Can Read:
   • Own        • Own        • Own
     enrollment   enrollment   enrollment
   • Course     • Course     • Course
     content      content      content
   • Community  • Sessions   • Sessions
                • Community  • Community
                             • Infinity
                               extras

   Cannot:      Can:         Can:
   • Book       • Book       • Book
     sessions     sessions     sessions
   • Access     • View       • Request
     mentoring    sessions     additional
                             • Priority
                               support
```

## Mobile Responsive Breakpoints

```
Desktop (≥1024px)
┌─────────────────────────────────────┐
│  ┌─────────────┬─────────────────┐  │
│  │             │                 │  │
│  │  Main (2/3) │  Sidebar (1/3)  │  │
│  │             │                 │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘

Tablet (768px - 1023px)
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │    Main Content   │  │
│  │                   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │                   │  │
│  │     Sidebar       │  │
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘

Mobile (<768px)
┌─────────────┐
│             │
│   Stack     │
│   All       │
│   Cards     │
│   Vertically│
│             │
│   Tabs at   │
│   Bottom    │
│             │
└─────────────┘
```

This architecture shows how all the pieces fit together for your plan-based student dashboard system!
