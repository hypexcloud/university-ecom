# 🚀 Quick Start - Firebase Course System

## ✅ What's Done

Your course pages now fetch data from Firebase instead of using mock data!

---

## 📦 What You Need To Do

### 1. **Create `/src/lib/firebase.ts`**

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### 2. **Add to `.env.local`**

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. **Create Sample Course in Firestore**

In Firebase Console → Firestore Database:

**Collection: `courses`**
**Document ID: `ai-automation`**

```json
{
  "courseId": "ai-automation",
  "title": "AI Automatisierung für E-Commerce",
  "description": "Meistern Sie KI in Ihrem Business",
  "thumbnail": "🤖",
  "category": "AI & Automatisierung",
  "level": "Fortgeschritten",
  "duration": "3 Monate",
  "estimatedHours": 12,
  "totalModules": 8,
  "totalVideos": 24,
  "totalResources": 18,
  "totalQuizzes": 8,
  "rating": 4.8,
  "studentsEnrolled": 1247,
  "certificateAvailable": true,
  "learningObjectives": [
    "ChatGPT effektiv nutzen",
    "Workflows automatisieren",
    "KI-Tools für Marketing"
  ],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "KI Grundlagen",
      "description": "Einführung in AI",
      "modules": ["mod1", "mod2"],
      "duration": "3 Stunden",
      "isCompleted": false
    }
  ],
  "modules": [],
  "isActive": true
}
```

### 4. **Create Sample Enrollment**

**Collection: `enrollments`**
**Auto-generate document ID**

```json
{
  "userId": "YOUR_USER_UID",
  "courseId": "ai-automation",
  "planType": "business",
  "planDisplayName": "Business Plan",
  "progress": 65,
  "completedModules": 5,
  "currentWeek": 3,
  "completedSessions": 2,
  "totalSessions": 6,
  "mentorName": "Amin",
  "status": "active",
  "completedModuleIds": [],
  "moduleProgress": {}
}
```

**Important**: Replace `YOUR_USER_UID` with actual user ID from Firebase Auth!

### 5. **Restart Dev Server**

```bash
npm run dev
```

---

## 🧪 Test

1. Visit: `http://localhost:3000/student/course`
2. Should see your enrolled course from Firebase
3. Click "Kurs öffnen"
4. Should see full course details from Firebase

---

## 📚 Full Documentation

See `FIREBASE_INTEGRATION_GUIDE.md` for:
- Complete Firestore structure
- All helper functions
- Security rules
- Troubleshooting

---

## 🎯 Files Created

```
/src/lib/firebase/
├── types.ts                         ← Type definitions
├── courses.ts                       ← Query functions

/src/app/student/
├── course/page.tsx                  ← UPDATED: Uses Firebase
└── course/[courseId]/page.tsx       ← UPDATED: Uses Firebase
```

---

**Ready to go!** Just add Firebase config and create sample data! 🔥
