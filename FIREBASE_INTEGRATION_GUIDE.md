# 🔥 Firebase Integration - Complete Guide

## ✅ What Was Created

I've created a **complete Firebase integration** for your course system with:

1. **TypeScript Types** - Full type definitions
2. **Helper Functions** - Query functions for courses, enrollments, sessions
3. **Updated Pages** - Course list and detail pages now use Firebase
4. **Error Handling** - Proper loading states and error messages

---

## 📁 New Files Created

```
/src/lib/firebase/
├── types.ts          ← All TypeScript interfaces
└── courses.ts        ← Firebase query functions
```

---

## 📊 Firestore Database Structure

### Collection: `courses`

Each course document should have:

```typescript
{
  courseId: "ai-automation",               // Unique ID
  title: "AI Automatisierung für E-Commerce",
  description: "Full course description...",
  thumbnail: "🤖",                        // Emoji or image URL
  category: "AI & Automatisierung",
  level: "Fortgeschritten",               // or "Anfänger", "Experte"
  duration: "3 Monate",
  estimatedHours: 12,
  totalModules: 8,
  totalVideos: 24,
  totalResources: 18,
  totalQuizzes: 8,
  rating: 4.8,
  studentsEnrolled: 1247,
  certificateAvailable: true,
  
  learningObjectives: [
    "ChatGPT effektiv nutzen",
    "Workflows automatisieren",
    // ... more objectives
  ],
  
  weeks: [
    {
      weekNumber: 1,
      title: "KI Grundlagen",
      description: "Einführung in AI",
      modules: ["module-1", "module-2"],  // Module IDs
      duration: "3 Stunden",
      isCompleted: false
    },
    // ... more weeks
  ],
  
  modules: [
    {
      id: "module-1",
      moduleNumber: 1,
      title: "ChatGPT Basics",
      description: "Grundlagen von ChatGPT",
      duration: "30 min",
      videoUrl: "https://...",
      resources: [
        {
          id: "res-1",
          title: "Cheat Sheet",
          type: "pdf",
          url: "https://..."
        }
      ],
      quiz: {
        id: "quiz-1",
        questions: 10,
        passingScore: 80
      }
    },
    // ... more modules
  ],
  
  pricing: {
    fast: 200,
    business: 1000,
    infinity: 1400
  },
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true
}
```

### Collection: `enrollments`

Each enrollment document:

```typescript
{
  userId: "user-123",                     // From Firebase Auth
  courseId: "ai-automation",
  planType: "business",                   // "fast" | "business" | "infinity"
  planDisplayName: "Business Plan",
  
  // Progress
  progress: 65,                           // 0-100
  completedModules: 5,
  currentWeek: 3,
  lastAccessedModuleId: "module-5",
  
  // Business/Infinity specific
  completedSessions: 2,
  totalSessions: 6,                       // Or 999 for infinity
  nextSessionDate: Timestamp,
  mentorId: "mentor-123",
  mentorName: "Amin",
  
  // Dates
  enrolledDate: Timestamp,
  lastAccessed: Timestamp,
  estimatedCompletionDate: Timestamp,
  completedAt: null,                      // Or Timestamp when complete
  
  status: "active",                       // "active" | "completed" | "paused" | "cancelled"
  
  // Module tracking
  completedModuleIds: ["module-1", "module-2", "module-3"],
  moduleProgress: {
    "module-1": {
      completed: true,
      completedAt: Timestamp,
      videoProgress: 100,
      quizScore: 85
    },
    "module-4": {
      completed: false,
      videoProgress: 45
    }
  }
}
```

### Collection: `sessions`

Each session document:

```typescript
{
  enrollmentId: "enrollment-123",
  userId: "user-123",
  courseId: "ai-automation",
  mentorId: "mentor-123",
  
  sessionNumber: 1,
  title: "Kickoff Session",
  description: "Introduction and goal setting",
  date: Timestamp,
  duration: 60,                           // minutes
  
  status: "scheduled",                    // "scheduled" | "completed" | "cancelled" | "missed"
  
  meetingLink: "https://zoom.us/...",
  notes: "Discussion points...",
  
  unlocksModuleIds: ["module-4"],        // Modules unlocked after this session
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🛠️ Setup Instructions

### Step 1: Create Firebase Config

Create `/src/lib/firebase.ts` (or update existing):

```typescript
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### Step 2: Add Environment Variables

In `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Create Sample Data in Firestore

Use Firebase Console to create sample documents:

**Collection: `courses`**
- Document ID: `ai-automation`
- Copy the structure from above

**Collection: `enrollments`**
- Document ID: Auto-generate
- Set `userId` to your test user's UID
- Set `courseId` to `ai-automation`

---

## 📚 How To Use the Functions

### Get All User Enrollments with Courses

```typescript
import { getUserEnrollmentsWithCourses } from '@/lib/firebase/courses'

const data = await getUserEnrollmentsWithCourses(user.uid)
// Returns: [{ enrollment: Enrollment, course: Course }]
```

### Get Single Enrollment with Course

```typescript
import { getEnrollmentWithCourse } from '@/lib/firebase/courses'

const data = await getEnrollmentWithCourse(enrollmentId)
// Returns: { enrollment: Enrollment, course: Course }
```

### Get All Courses

```typescript
import { getCourses } from '@/lib/firebase/courses'

const courses = await getCourses()
// Returns: Course[]
```

### Get Course Modules

```typescript
import { getCourseModules } from '@/lib/firebase/courses'

const modules = await getCourseModules(courseId)
// Returns: CourseModule[]
```

### Check If Module Is Unlocked

```typescript
import { isModuleUnlocked } from '@/lib/firebase/courses'

const unlocked = await isModuleUnlocked(enrollment, moduleId, course)
// Returns: boolean
```

---

## 🔄 Updated Pages

### `/student/course` (Course List)

**Now fetches real data:**
- ✅ Gets all enrollments for logged-in user
- ✅ Fetches course details for each enrollment
- ✅ Shows loading state
- ✅ Shows error state
- ✅ Shows empty state if no enrollments

### `/student/course/[courseId]` (Course Detail)

**Now fetches real data:**
- ✅ Gets enrollment by ID from URL
- ✅ Fetches full course data
- ✅ Shows progress from enrollment
- ✅ Shows mentor info (if Business/Infinity)
- ✅ Displays all course details from Firebase

---

## 🎯 Data Flow

```
User visits /student/course
   ↓
getUserEnrollmentsWithCourses(user.uid)
   ↓
Query enrollments collection WHERE userId == user.uid
   ↓
For each enrollment, fetch course data
   ↓
Display course cards with:
   - Course info from courses collection
   - Progress from enrollments collection
   ↓
User clicks "Kurs öffnen"
   ↓
Navigate to /student/course/[courseId]?enrollmentId=xxx
   ↓
getEnrollmentWithCourse(enrollmentId)
   ↓
Fetch enrollment + course data
   ↓
Display detailed course page
```

---

## 🔒 Firestore Security Rules

Add these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Courses - read by anyone authenticated
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }
    
    // Enrollments - users can only read their own
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth.token.role == 'admin';
    }
    
    // Sessions - users can read their own
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth.token.role == 'admin' || 
                      request.auth.token.role == 'mentor';
    }
  }
}
```

---

## ⚡ Next Steps

1. **Create Firebase config** in `/src/lib/firebase.ts`
2. **Add environment variables** to `.env.local`
3. **Create sample course** in Firestore console
4. **Create sample enrollment** for your test user
5. **Restart dev server**
6. **Test the pages**

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/lib/firebase'"
**Fix**: Create the Firebase config file as shown above

### Issue: "No enrollments showing"
**Fix**: Make sure enrollment document has correct `userId` matching your authenticated user

### Issue: "Course data missing"
**Fix**: Verify course document has all required fields (see structure above)

### Issue: "Dates not displaying"
**Fix**: Make sure dates are Firestore Timestamps, not strings

---

## 📝 Example Firebase Console Commands

To quickly create test data in Firebase Console:

```javascript
// Create a course
db.collection('courses').doc('ai-automation').set({
  courseId: 'ai-automation',
  title: 'AI Automatisierung für E-Commerce',
  description: 'Meistern Sie KI...',
  thumbnail: '🤖',
  // ... all other fields from structure above
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
})

// Create an enrollment
db.collection('enrollments').add({
  userId: 'YOUR_USER_UID_HERE',  // Get from Firebase Auth
  courseId: 'ai-automation',
  planType: 'business',
  // ... all other fields
  enrolledDate: firebase.firestore.FieldValue.serverTimestamp()
})
```

---

**Your course system is now connected to Firebase!** 🎉

Just add your Firebase config and create sample data to see it in action!
