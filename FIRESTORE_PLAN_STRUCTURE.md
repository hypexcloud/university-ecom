# Firestore Data Structure for Plan-Based System

## Collections Overview

```
enrollments/
  {enrollmentId}/
    - userId
    - courseId
    - courseType
    - planType
    - planId
    - startDate
    - endDate
    - status
    - progress
    - sessions (Business & Infinity)
    - infinityExtras (Infinity only)

sessions/
  {sessionId}/
    - enrollmentId
    - userId
    - mentorId
    - scheduledAt
    - status
    - meetingLink
    - topic
    - notes

courses/
  {courseId}/
    - type
    - name
    - duration
    - modules
    - plans

course_content/
  {moduleId}/
    - courseId
    - week
    - title
    - resources
```

## Enrollment Document Structure

### Fast Plan Enrollment
```typescript
// enrollments/{enrollmentId}
{
  id: "enroll_abc123",
  userId: "user_xyz789",
  courseId: "ai-kurs",
  courseType: "ai_automation",
  courseName: "AI Automatisierung",
  
  // Plan Information
  planType: "fast",
  planId: "ai-fast",
  planDisplayName: "Fast Plan",
  
  // Dates
  startDate: Timestamp,
  expectedEndDate: Timestamp, // 3 months for AI, 2 months for Dropshipping
  enrolledAt: Timestamp,
  
  // Status
  status: "active", // active, completed, suspended, cancelled
  
  // Progress
  progress: {
    currentWeek: 3,
    totalWeeks: 12,
    currentModuleId: "ai-module-3",
    completedModules: ["ai-module-1", "ai-module-2"],
    totalModules: 24,
    totalProgress: 33, // percentage
    lastAccessedAt: Timestamp
  },
  
  // Fast Plan specific
  hasAccessToCommunity: true,
  communityDiscordId: "discord_id_here",
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Business Plan Enrollment
```typescript
// enrollments/{enrollmentId}
{
  id: "enroll_def456",
  userId: "user_xyz789",
  courseId: "ai-kurs",
  courseType: "ai_automation",
  courseName: "AI Automatisierung",
  
  // Plan Information
  planType: "business",
  planId: "ai-business",
  planDisplayName: "Business Plan",
  
  // Dates
  startDate: Timestamp,
  expectedEndDate: Timestamp,
  enrolledAt: Timestamp,
  
  // Status
  status: "active",
  
  // Progress (same as Fast)
  progress: {
    currentWeek: 3,
    totalWeeks: 12,
    currentModuleId: "ai-module-3",
    completedModules: ["ai-module-1", "ai-module-2"],
    totalModules: 24,
    totalProgress: 33,
    lastAccessedAt: Timestamp
  },
  
  // Business Plan - Mentoring Sessions
  mentoring: {
    mentorId: "amin", // Assigned mentor
    totalSessions: 6, // For AI course
    sessionsCompleted: 2,
    sessionsScheduled: 1,
    sessionsRemaining: 3,
    nextSessionId: "session_abc123",
    nextSessionDate: Timestamp,
    lastSessionDate: Timestamp,
    sessionIds: ["session_001", "session_002", "session_003"]
  },
  
  // Access
  hasAccessToCommunity: true,
  hasAccessToMentoring: true,
  communityDiscordId: "discord_id_here",
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Infinity Plan Enrollment
```typescript
// enrollments/{enrollmentId}
{
  id: "enroll_ghi789",
  userId: "user_xyz789",
  courseId: "dropshipping-kurs",
  courseType: "eu_dropshipping",
  courseName: "EU Dropshipping",
  
  // Plan Information
  planType: "infinity",
  planId: "ds-infinity",
  planDisplayName: "Infinity Plan",
  
  // Dates
  startDate: Timestamp,
  expectedEndDate: Timestamp,
  enrolledAt: Timestamp,
  
  // Status
  status: "active",
  
  // Progress
  progress: {
    currentWeek: 4,
    totalWeeks: 8,
    currentModuleId: "ds-module-4",
    completedModules: ["ds-module-1", "ds-module-2", "ds-module-3"],
    totalModules: 12,
    totalProgress: 50,
    lastAccessedAt: Timestamp
  },
  
  // Infinity Plan - Enhanced Mentoring
  mentoring: {
    mentorId: "esat",
    totalSessions: 6, // Base sessions
    unlimitedSupport: true, // Can request additional sessions
    sessionsCompleted: 3,
    sessionsScheduled: 1,
    sessionsRemaining: 2,
    additionalSessionsRequested: 2,
    nextSessionId: "session_def456",
    nextSessionDate: Timestamp,
    lastSessionDate: Timestamp,
    sessionIds: ["session_101", "session_102", "session_103"],
    prioritySupport: true
  },
  
  // Infinity Extras (Dropshipping specific)
  infinityExtras: {
    // Custom Website
    customWebsite: {
      status: "in_progress", // not_started, in_progress, completed, delivered
      requestedAt: Timestamp,
      startedAt: Timestamp,
      completedAt?: Timestamp,
      websiteUrl?: "https://custom-store.com",
      notes: "Modern Shopify theme with custom sections",
      assignedTo: "developer_id"
    },
    
    // Product Research
    productResearch: {
      status: "completed",
      requestedAt: Timestamp,
      completedAt: Timestamp,
      productsFound: 5,
      reportUrl: "https://storage.../product-research-report.pdf",
      notes: "Top 5 winning products for Q1 2026"
    },
    
    // Done-for-you Setup
    setupAssistance: {
      shopifySetup: true,
      paymentGateway: true,
      shippingConfiguration: true,
      legalCompliance: true
    }
  },
  
  // Access
  hasAccessToCommunity: true,
  hasAccessToMentoring: true,
  hasAccessToPremiumSupport: true,
  communityDiscordId: "discord_id_here",
  prioritySupportChannel: "infinity_support_channel",
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Session Document Structure

```typescript
// sessions/{sessionId}
{
  id: "session_abc123",
  enrollmentId: "enroll_def456",
  userId: "user_xyz789",
  mentorId: "amin",
  courseType: "ai_automation",
  
  // Session Details
  type: "coaching", // coaching, check-in, strategy, custom
  topic: "Implementing Chatbot Automation",
  description: "Review current chatbot setup and optimize",
  
  // Scheduling
  scheduledAt: Timestamp,
  duration: 60, // minutes
  timezone: "Europe/Berlin",
  
  // Meeting Info
  meetingLink: "https://zoom.us/j/123456789",
  meetingPassword: "encrypted_password",
  platform: "zoom", // zoom, google_meet, teams
  
  // Status
  status: "scheduled", // scheduled, completed, cancelled, no_show, rescheduled
  
  // Completion (after session)
  completedAt?: Timestamp,
  completionNotes?: "Great progress on automation workflows. Next: implement in production.",
  actionItems?: [
    "Test chatbot on staging environment",
    "Prepare FAQ document",
    "Schedule follow-up in 2 weeks"
  ],
  
  // Recording (optional)
  recordingUrl?: "https://zoom.us/rec/...",
  recordingPassword?: "encrypted",
  
  // Feedback
  studentFeedback?: {
    rating: 5,
    comment: "Very helpful session!",
    submittedAt: Timestamp
  },
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "user_xyz789", // who booked
  confirmedBy?: "amin" // mentor confirmation
}
```

## Query Examples

### Get Active Enrollment for User
```typescript
const enrollmentsRef = collection(db, 'enrollments')
const q = query(
  enrollmentsRef, 
  where('userId', '==', userId),
  where('status', '==', 'active')
)
const snapshot = await getDocs(q)
```

### Get Sessions for Enrollment
```typescript
const sessionsRef = collection(db, 'sessions')
const q = query(
  sessionsRef,
  where('enrollmentId', '==', enrollmentId),
  orderBy('scheduledAt', 'desc')
)
const snapshot = await getDocs(q)
```

### Get Upcoming Sessions
```typescript
const sessionsRef = collection(db, 'sessions')
const q = query(
  sessionsRef,
  where('userId', '==', userId),
  where('status', '==', 'scheduled'),
  where('scheduledAt', '>', new Date()),
  orderBy('scheduledAt', 'asc')
)
const snapshot = await getDocs(q)
```

### Check Infinity Premium Status
```typescript
const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId))
const data = enrollmentDoc.data()

const hasCustomWebsite = data?.infinityExtras?.customWebsite?.status === 'completed'
const hasProductResearch = data?.infinityExtras?.productResearch?.status === 'completed'
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Enrollments
    match /enrollments/{enrollmentId} {
      // Users can read their own enrollments
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      
      // Only admins can create/update enrollments
      allow create, update: if request.auth != null && 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Sessions
    match /sessions/{sessionId} {
      // Users can read their own sessions
      // Mentors can read sessions assigned to them
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        resource.data.mentorId == request.auth.uid
      );
      
      // Users can create sessions (booking)
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      
      // Mentors and users can update their sessions
      allow update: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        resource.data.mentorId == request.auth.uid
      );
    }
  }
}
```

## Migration Script Example

```typescript
// migrate-enrollments-to-plan-based.ts
import { db } from '@/lib/firebase/admin'

async function migrateEnrollments() {
  const enrollmentsSnapshot = await db.collection('enrollments').get()
  
  for (const doc of enrollmentsSnapshot.docs) {
    const data = doc.data()
    
    // Determine plan type from existing data
    let planType: 'fast' | 'business' | 'infinity' = 'fast'
    if (data.includes1to1) {
      planType = data.price >= 1400 ? 'infinity' : 'business'
    }
    
    // Update document
    await doc.ref.update({
      planType,
      planId: `${data.courseType}-${planType}`,
      planDisplayName: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
      
      // Add mentoring object for Business/Infinity
      ...(planType !== 'fast' && {
        mentoring: {
          mentorId: data.mentorId || 'amin',
          totalSessions: data.courseType === 'ai' ? 6 : 4,
          sessionsCompleted: 0,
          sessionsScheduled: 0,
          sessionsRemaining: data.courseType === 'ai' ? 6 : 4,
          sessionIds: []
        }
      }),
      
      // Add Infinity extras for Infinity plan
      ...(planType === 'infinity' && data.courseType === 'dropshipping' && {
        infinityExtras: {
          customWebsite: {
            status: 'not_started',
            requestedAt: null
          },
          productResearch: {
            status: 'not_started',
            requestedAt: null
          }
        }
      })
    })
    
    console.log(`Migrated enrollment ${doc.id} to ${planType} plan`)
  }
  
  console.log('Migration completed!')
}
```

## API Endpoints to Create

### 1. Get Enrollment with Plan Details
```typescript
// /api/enrollments/[enrollmentId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { enrollmentId: string } }
) {
  const enrollmentDoc = await getDoc(doc(db, 'enrollments', params.enrollmentId))
  
  if (!enrollmentDoc.exists()) {
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
  }
  
  return NextResponse.json({
    enrollment: {
      id: enrollmentDoc.id,
      ...enrollmentDoc.data()
    }
  })
}
```

### 2. Update Infinity Extras Status
```typescript
// /api/enrollments/[enrollmentId]/infinity-extras/route.ts
export async function PATCH(request: Request) {
  const { enrollmentId, extraType, status, notes } = await request.json()
  
  await updateDoc(doc(db, 'enrollments', enrollmentId), {
    [`infinityExtras.${extraType}.status`]: status,
    [`infinityExtras.${extraType}.notes`]: notes,
    [`infinityExtras.${extraType}.${status === 'completed' ? 'completedAt' : 'startedAt'}`]: serverTimestamp()
  })
  
  return NextResponse.json({ success: true })
}
```

This structure provides a complete, scalable system for managing plan-based enrollments with proper data organization and security.
