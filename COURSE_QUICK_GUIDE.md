# Quick Implementation Guide - Plan-Based Course Access

## 🎯 What We Built

A course system that displays differently based on subscription plan:

1. **Fast Plan** → All courses available (self-paced grid)
2. **Business Plan** → Courses unlock after 1:1 sessions (timeline view)
3. **Infinity Plan** → Both views available in tabs

---

## 📁 File Created

**`/src/app/student/course/page-plan-based.tsx`**

This is the new course page that replaces your current `/src/app/student/course/page.tsx`

---

## 🔄 How To Use It

### Step 1: Backup Current File
```bash
mv src/app/student/course/page.tsx src/app/student/course/page-old.tsx
```

### Step 2: Rename New File
```bash
mv src/app/student/course/page-plan-based.tsx src/app/student/course/page.tsx
```

### Step 3: Update Enrollment Data

The component expects enrollment data with:
```typescript
{
  planType: 'fast' | 'business' | 'infinity',
  courseId: string,
  courseName: string,
  completedSessions: number,  // For Business/Infinity
  nextSessionDate?: Date      // For Business/Infinity
}
```

---

## 🎨 What Each Plan Sees

### Fast Plan Students See:
```
┌─────────────────────────────────────┐
│ Self-Paced Learning                 │
│ All modules available immediately!  │
├─────────────────────────────────────┤
│ [Grid of all content modules]       │
│                                     │
│ [Module 1] [Module 2] [Module 3]   │
│ [Module 4] [Module 5] [Module 6]   │
│                                     │
│ All unlocked ✓                      │
└─────────────────────────────────────┘
```

### Business Plan Students See:
```
┌──────────────────────────────────────┐
│ Mentored Learning Path               │
│ Modules unlock after sessions        │
├──────────────────────────────────────┤
│ [Timeline View]                      │
│                                      │
│ ● Module 1 ✓ Completed              │
│ ● Module 2 ✓ Completed              │
│ ● 1:1 Session ✓ Jan 22              │
│ ● Module 4 → Available now          │
│ ● Module 5 🔒 After next session    │
│ ● 1:1 Session 📅 Jan 10              │
│ ● Module 7 🔒 Locked                │
└──────────────────────────────────────┘
```

### Infinity Plan Students See:
```
┌────────────────────────────────────────┐
│ Infinity Dual Access 👑                │
│ Choose your learning style             │
├────────────────────────────────────────┤
│ [Tab: Self-Paced] [Tab: Mentored]     │
├────────────────────────────────────────┤
│                                        │
│ SELF-PACED TAB:                        │
│ All content modules unlocked           │
│ [Grid view like Fast Plan]             │
│                                        │
│ MENTORED TAB:                          │
│ Timeline with sessions                 │
│ [Timeline like Business Plan]          │
└────────────────────────────────────────┘
```

---

## 🗄️ Database Setup Needed

### Add to Module Documents:

```typescript
// In course_content/{moduleId}
{
  // ... existing fields
  
  // New fields for session-based unlocking
  requiresSession: false,  // true if this IS a session module
  
  unlockConditions: {
    sessionsCompleted: 2,  // Unlocks after 2 sessions complete
    // OR
    previousModules: ['module-1', 'module-2']  // Unlocks after these complete
  }
}
```

### Example Modules:

**Regular Content Module**:
```json
{
  "id": "module-4",
  "title": "Advanced Prompting",
  "weekNumber": 2,
  "requiresSession": false,
  "unlockConditions": {
    "sessionsCompleted": 1
  }
}
```

**Session Module**:
```json
{
  "id": "session-1",
  "title": "1:1 Strategy Workshop",
  "weekNumber": 2,
  "requiresSession": true,
  "sessionDate": "2024-01-22T14:00:00Z"
}
```

---

## ✅ Testing

Change the `planType` in the component mock data to test each view:

```typescript
// Line ~50 in the component
const enrollment: EnrollmentData = {
  planType: 'fast',      // Change to: 'fast', 'business', or 'infinity'
  courseId: 'ai-automation',
  courseName: 'AI Automatisierung',
  startDate: new Date('2024-01-15'),
  completedSessions: 2,
  nextSessionDate: new Date('2026-01-10')
}
```

**Test scenarios:**
1. Set `planType: 'fast'` → Should see grid of all modules
2. Set `planType: 'business'` → Should see timeline with locked/unlocked modules
3. Set `planType: 'infinity'` → Should see tabs with both views

---

## 🔑 Key Features

### Fast Plan:
- ✅ All content modules in grid
- ✅ No session modules shown
- ✅ Everything unlocked
- ✅ Blue info banner

### Business Plan:
- ✅ Timeline view with connector lines
- ✅ Session modules integrated
- ✅ Lock icons on unavailable modules
- ✅ Unlock conditions shown
- ✅ Green info banner
- ✅ "After session X" messages

### Infinity Plan:
- ✅ Two tabs (Self-Paced & Mentored)
- ✅ Tab 1: Grid of content (like Fast)
- ✅ Tab 2: Timeline (like Business)
- ✅ Purple gradient info banner
- ✅ Crown icon (👑)

---

## 📊 Visual Indicators

### Module States:

**Completed**: Green border, checkmark
**Available**: Blue border, play button
**Locked**: Gray border, lock icon, 60% opacity
**Session**: Purple border, video icon

---

## 🚀 Next Steps

1. **Test the new component**
   - Try all three plan types
   - Verify layouts work

2. **Connect to real data**
   - Fetch enrollment from Firestore
   - Load actual modules with unlock conditions
   - Connect to session data

3. **Add module detail pages**
   - Create `/student/course/[moduleId]` page
   - Show video player, resources, quiz

4. **Admin setup**
   - Add unlock conditions to modules in admin panel
   - Link modules to sessions

---

## 📝 Quick Reference

**Change plan type**: Line 50 in component
**Session modules**: Set `requiresSession: true`
**Unlock after sessions**: Set `unlockConditions.sessionsCompleted`
**Lock after previous**: Set `unlockConditions.previousModules`

---

## 💡 Tips

- Fast students want freedom → Give them all content
- Business students want structure → Gate content behind sessions
- Infinity students want both → Let them choose

Each plan gets a different learning experience optimized for their subscription level!

---

For full details, see: `COURSE_PLAN_SYSTEM.md`
