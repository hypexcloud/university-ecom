# Plan-Based Course Access System

## Overview

The course display and access system adapts based on the student's subscription plan, providing different learning experiences:

- **Fast Plan**: Self-paced, all modules available immediately
- **Business Plan**: Calendar-driven, modules unlock after 1:1 mentoring sessions
- **Infinity Plan**: Both methods available via tabs (flexible + structured)

---

## 🎯 Three Learning Approaches

### 1. Fast Plan - Self-Paced Learning

**Philosophy**: Complete freedom, learn at your own pace

**UI Display**:
```
┌─────────────────────────────────────────────┐
│ Self-Paced Learning                         │
│ All modules available immediately!          │
├─────────────────────────────────────────────┤
│ [Module Grid - All Unlocked]                │
│                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │Module 1 │ │Module 2 │ │Module 3 │        │
│ │Week 1   │ │Week 1   │ │Week 2   │        │
│ │✓        │ │→ Start  │ │→ Start  │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │Module 4 │ │Module 5 │ │Module 6 │        │
│ │Week 2   │ │Week 3   │ │Week 3   │        │
│ │→ Start  │ │→ Start  │ │→ Start  │        │
│ └─────────┘ └─────────┘ └─────────┘        │
└─────────────────────────────────────────────┘
```

**Characteristics**:
- ✅ All content modules available from day 1
- ✅ No session modules shown
- ✅ Grid layout for easy browsing
- ✅ Can skip ahead or go back freely
- ✅ Progress tracked but not enforced

**Module Structure**:
```typescript
{
  isLocked: false,           // Never locked
  requiresSession: false,    // No session requirement
  unlockCondition: null      // No unlock conditions
}
```

---

### 2. Business Plan - Mentored Calendar Path

**Philosophy**: Structured learning with mentor guidance

**UI Display**:
```
┌──────────────────────────────────────────────┐
│ Mentored Learning Path                       │
│ Modules unlock after 1:1 sessions           │
├──────────────────────────────────────────────┤
│ [Timeline View - Session-Based]             │
│                                              │
│ ● Week 1 - Module 1: AI Grundlagen          │
│ │ ✓ Abgeschlossen                           │
│ │                                            │
│ ● Week 1 - Module 2: Prompting              │
│ │ ✓ Abgeschlossen                           │
│ │                                            │
│ ● Week 2 - 1:1 Session: Strategy Workshop   │
│ │ ✓ Completed on 22. Jan 2024               │
│ │ [Unlocks next modules]                    │
│ │                                            │
│ ● Week 2 - Module 4: Advanced Prompting     │
│ │ → Jetzt verfügbar                         │
│ │                                            │
│ ● Week 3 - Module 5: Automation             │
│ │ 🔒 Nach 2. Session freigeschalten         │
│ │                                            │
│ ● Week 4 - 1:1 Session: Implementation      │
│   📅 Geplant für 10. Jan 2026               │
│   [Session Details]                          │
└──────────────────────────────────────────────┘
```

**Characteristics**:
- 📅 Timeline/calendar-based view
- 🔒 Modules unlock after sessions
- 👥 1:1 sessions integrated in flow
- 📍 Clear unlock conditions shown
- ✅ Progress tied to mentoring

**Module Structure**:
```typescript
// Regular content module
{
  isLocked: true,
  requiresSession: false,
  unlockCondition: "Nach 1:1 Session freigeschalten"
}

// Session module
{
  isLocked: false,
  requiresSession: true,
  sessionDate: Date,
  sessionCompleted: boolean,
  unlockCondition: "Geplant für 10. Jan"
}
```

**Unlock Logic**:
```typescript
// Module unlocks based on completed sessions
if (completedSessions >= requiredSessionsForModule) {
  module.isLocked = false
}

// Example:
Module 4: unlocks after Session 1 complete
Module 5: unlocks after Session 2 complete
Module 7: unlocks after Session 3 complete
```

---

### 3. Infinity Plan - Dual Access (Tabs)

**Philosophy**: Best of both worlds

**UI Display**:
```
┌──────────────────────────────────────────────┐
│ Infinity Dual Access                         │
│ Choose your learning style: flexible or      │
│ structured with mentoring                    │
├──────────────────────────────────────────────┤
│ [Tab: Self-Paced] [Tab: Mentored Path]      │
├──────────────────────────────────────────────┤
│                                              │
│ SELF-PACED TAB:                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │Module 1 │ │Module 2 │ │Module 4 │        │
│ │✓        │ │→ Start  │ │→ Start  │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│ (Only content modules, no sessions)          │
│                                              │
│ MENTORED PATH TAB:                           │
│ ● Module 1: AI Grundlagen ✓                 │
│ ● Module 2: Prompting ✓                     │
│ ● 1:1 Session: Strategy ✓                   │
│ ● Module 4: Advanced → Available            │
│ ● Module 5: Automation 🔒                    │
│ ● 1:1 Session: Review 📅                     │
│ (Complete timeline with sessions)            │
└──────────────────────────────────────────────┘
```

**Characteristics**:
- 🔀 Two separate views via tabs
- 📚 Self-Paced: Quick access to content
- 📅 Mentored: Structured path with sessions
- ✨ Crown badges for premium
- 🎯 Student chooses learning style

**Tab 1 - Self-Paced**:
```typescript
// Shows only content modules (no sessions)
const selfPacedModules = modules.filter(m => !m.requiresSession)

// All unlocked
modules.map(m => ({ ...m, isLocked: false }))
```

**Tab 2 - Mentored Path**:
```typescript
// Shows all modules including sessions
const mentoredModules = modules // All modules

// Session-based unlocking (same as Business)
```

---

## Database Structure

### Module Document (Firestore)

```typescript
interface Module {
  id: string
  courseId: string
  title: string
  description: string
  weekNumber: number
  duration: number // minutes
  order: number
  
  // Content
  videoUrl?: string
  resources: Resource[]
  quizId?: string
  
  // Session Integration (Business/Infinity)
  requiresSession: boolean        // Is this a 1:1 session module?
  sessionRequired: boolean        // Must complete to unlock next?
  sessionDate?: Timestamp         // When is session scheduled?
  
  // Unlock Logic
  unlockConditions?: {
    sessionsCompleted?: number    // e.g., 2
    previousModules?: string[]    // Module IDs
  }
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Student Progress

```typescript
interface StudentProgress {
  userId: string
  enrollmentId: string
  courseId: string
  
  // Module Completion
  modulesCompleted: string[]      // Module IDs
  modulesUnlocked: string[]       // Module IDs
  
  // Session Tracking
  sessionsCompleted: number       // Count
  sessionModulesCompleted: string[] // Session module IDs
  
  // Progress
  currentWeek: number
  overallCompletion: number       // percentage
  
  lastAccessedAt: Timestamp
  updatedAt: Timestamp
}
```

---

## UI Components Breakdown

### Fast Plan View

```typescript
// Simple grid component
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {contentModules.map(module => (
    <ModuleCard
      module={module}
      isLocked={false}  // Never locked
      onSelect={handleModuleClick}
    />
  ))}
</div>
```

### Business Plan View

```typescript
// Timeline component
<div className="space-y-4">
  {allModules.map((module, index) => (
    <TimelineItem
      module={module}
      isLocked={checkUnlockStatus(module)}
      showConnector={index < allModules.length - 1}
      onSessionClick={handleSessionClick}
    />
  ))}
</div>
```

### Infinity Plan View

```typescript
// Tabbed component
<Tabs value={activeView} onValueChange={setActiveView}>
  <TabsList>
    <TabsTrigger value="self-paced">Self-Paced</TabsTrigger>
    <TabsTrigger value="mentored">Mentored Path</TabsTrigger>
  </TabsList>
  
  <TabsContent value="self-paced">
    <ModuleGrid modules={contentModules} />
  </TabsContent>
  
  <TabsContent value="mentored">
    <TimelineView modules={allModules} />
  </TabsContent>
</Tabs>
```

---

## Module Unlock Logic

### Fast Plan
```typescript
function checkModuleAccess_Fast(module: Module): boolean {
  return true // Always accessible
}
```

### Business Plan
```typescript
function checkModuleAccess_Business(
  module: Module,
  progress: StudentProgress
): boolean {
  // Session modules: Check if scheduled/completed
  if (module.requiresSession) {
    return module.sessionDate !== null
  }
  
  // Content modules: Check unlock conditions
  if (module.unlockConditions?.sessionsCompleted) {
    return progress.sessionsCompleted >= module.unlockConditions.sessionsCompleted
  }
  
  // Check previous modules
  if (module.unlockConditions?.previousModules) {
    return module.unlockConditions.previousModules.every(
      id => progress.modulesCompleted.includes(id)
    )
  }
  
  return true // No conditions = unlocked
}
```

### Infinity Plan
```typescript
function checkModuleAccess_Infinity(
  module: Module,
  activeView: 'self-paced' | 'mentored',
  progress: StudentProgress
): boolean {
  if (activeView === 'self-paced') {
    // Self-paced: All content modules unlocked
    return !module.requiresSession
  } else {
    // Mentored: Same logic as Business
    return checkModuleAccess_Business(module, progress)
  }
}
```

---

## Visual Design Patterns

### Module States

**Completed**:
```
┌─────────────────────────┐
│ ✓ Week 1                │
│ AI Grundlagen           │
│ ✓ Abgeschlossen         │
│ [Wiederholen]           │
└─────────────────────────┘
Border: green
Background: green-50
```

**Available (Not Started)**:
```
┌─────────────────────────┐
│ → Week 2                │
│ Prompt Engineering      │
│ 60 Min                  │
│ [Jetzt starten]         │
└─────────────────────────┘
Border: blue
Background: white
```

**Locked**:
```
┌─────────────────────────┐
│ 🔒 Week 3               │
│ Automation              │
│ Nach 2. Session         │
│ [Gesperrt]              │
└─────────────────────────┘
Border: gray
Background: gray-50
Opacity: 60%
```

**Session Module**:
```
┌─────────────────────────┐
│ 📹 Week 2               │
│ 1:1 Session: Strategy  │
│ 📅 10. Jan 2026         │
│ [Session Details]       │
└─────────────────────────┘
Border: purple
Background: purple-50
```

---

## Implementation Steps

### 1. Update Module Data Structure
```typescript
// Add to course_content collection
{
  requiresSession: boolean,
  sessionRequired: boolean,
  unlockConditions: {
    sessionsCompleted: number,
    previousModules: string[]
  }
}
```

### 2. Create Plan-Specific Views
```typescript
// Fast Plan: Grid view
<ModuleGrid modules={contentModules} />

// Business Plan: Timeline view
<TimelineView modules={allModules} sessions={sessions} />

// Infinity Plan: Tabbed view
<TabbedView modules={modules} />
```

### 3. Implement Unlock Logic
```typescript
function getModuleAccessibility(
  module: Module,
  planType: PlanType,
  progress: StudentProgress
): { isLocked: boolean; reason?: string } {
  // Implementation based on plan type
}
```

### 4. Add Session Integration
```typescript
// Link sessions to modules
interface SessionModule extends Module {
  sessionId: string
  sessionDate: Date
  sessionStatus: 'scheduled' | 'completed' | 'cancelled'
  meetingLink?: string
}
```

---

## User Experience Flows

### Fast Plan User Flow
```
1. Land on course page
2. See all modules in grid
3. Click any module
4. Watch content
5. Mark complete
6. Move to next (any order)
```

### Business Plan User Flow
```
1. Land on course page
2. See timeline with sessions
3. Complete unlocked modules
4. Attend 1:1 session
5. New modules unlock
6. Continue through timeline
7. Track progress with mentor
```

### Infinity Plan User Flow
```
1. Land on course page
2. Choose learning style (tabs)

Self-Paced Tab:
3a. Browse all content
4a. Learn flexibly

Mentored Tab:
3b. Follow timeline
4b. Attend sessions
5b. Structured progress
```

---

## Testing Scenarios

### Test Case 1: Fast Plan Access
```typescript
// User: Fast plan student
// Expected: All content modules visible and unlocked
// Expected: No session modules shown
// Expected: Can access any module in any order
```

### Test Case 2: Business Plan Unlock
```typescript
// User: Business plan student, completed 1 session
// Expected: Modules 1-4 unlocked
// Expected: Module 5 locked with message "Nach 2. Session"
// Expected: Next session visible in timeline
```

### Test Case 3: Infinity Dual Access
```typescript
// User: Infinity plan student
// Expected: See two tabs (Self-Paced & Mentored)
// Self-Paced Tab: All content modules unlocked
// Mentored Tab: Same as Business plan view
// Expected: Can switch between tabs freely
```

---

## API Endpoints

### Get Course with Plan Logic
```typescript
GET /api/courses/:courseId/modules?enrollmentId=xxx

Response: {
  modules: Module[],
  accessibility: {
    [moduleId]: {
      isLocked: boolean,
      unlockCondition?: string,
      nextUnlockDate?: Date
    }
  },
  nextSession?: Session
}
```

### Update Module Progress
```typescript
POST /api/progress/modules/:moduleId/complete

Body: {
  enrollmentId: string,
  completedAt: Date
}

Side Effects:
- Mark module complete
- Check and unlock next modules
- Update overall progress
```

---

This system provides three distinct learning experiences tailored to each plan tier, ensuring optimal value delivery for each subscription level!
