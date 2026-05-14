# Quick Reference Card - Plan-Based Dashboard

## 🎯 Three Plans at a Glance

| Feature | Fast | Business | Infinity |
|---------|------|----------|----------|
| **Price** | €200 | €1,000 | €1,400-€3,000 |
| **Videos** | ✅ | ✅ | ✅ |
| **Materials** | ✅ | ✅ | ✅ |
| **Community** | ✅ | ✅ | ✅ |
| **1:1 Sessions** | ❌ | ✅ 6x | ✅ Unlimited |
| **Custom Website** | ❌ | ❌ | ✅ (DS) |
| **Product Research** | ❌ | ❌ | ✅ (DS) |
| **Mentoring Tab** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ |

---

## 📊 What Students See

### Fast Plan Student
```
Dashboard Tabs: [Übersicht] [Kurse]
Main View: Course content + Progress tracking
Special Feature: Upgrade CTA
Mentoring: Hidden ❌
```

### Business Plan Student
```
Dashboard Tabs: [Übersicht] [Kurse] [Mentoring 🎯]
Main View: Course content + Next session card
Special Feature: Session booking (6 sessions)
Mentoring: Visible ✅
```

### Infinity Plan Student
```
Dashboard Tabs: [Übersicht] [Kurse] [Mentoring 👑]
Main View: Course + Session + Premium services
Special Feature: Custom deliverables tracking
Mentoring: Enhanced with priority ✅
```

---

## 💾 Key Data Structure

```typescript
// Minimal enrollment object
{
  planType: 'fast' | 'business' | 'infinity',
  
  // Fast: Just this
  progress: { currentWeek, totalProgress, ... }
  
  // Business: Add this
  mentoring: {
    sessionsRemaining: number,
    totalSessions: number
  }
  
  // Infinity: Add this too
  infinityExtras: {
    customWebsite: { status, url },
    productResearch: { status, reportUrl }
  }
}
```

---

## 🎨 Visual Indicators

### Colors
- Fast: `bg-gray-600`
- Business: `from-yellow-500 to-yellow-600`
- Infinity: `from-purple-600 to-blue-600`

### Icons
- Fast: 📘 Blue theme
- Business: 🟢 Green for mentoring
- Infinity: 👑 Crown + purple theme

---

## 🔐 Access Control

```typescript
const hasMentoringAccess = ['business', 'infinity'].includes(planType)
const hasInfinityFeatures = planType === 'infinity'

// Usage
{hasMentoringAccess && <MentoringTab />}
{hasInfinityFeatures && <PremiumServicesCard />}
{planType === 'fast' && <UpgradeCTA />}
```

---

## 📍 Important Files

```
Components:
  src/components/StudentDashboardPlanBased.tsx

Documentation:
  README_PLAN_DASHBOARD.md         (Start here)
  PLAN_BASED_DASHBOARD.md          (Full guide)
  FIRESTORE_PLAN_STRUCTURE.md      (Database)
  IMPLEMENTATION_CHECKLIST.md      (Tasks)
  PLAN_VISUAL_COMPARISON.md        (Mockups)
  ARCHITECTURE_DIAGRAM.md          (System design)
```

---

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Test Fast plan
Visit: /student (with planType: 'fast' in mock data)

# Test Business plan  
Visit: /student (with planType: 'business' in mock data)

# Test Infinity plan
Visit: /student (with planType: 'infinity' in mock data)

# Build
npm run build

# Deploy
vercel --prod
```

---

## ✅ Implementation Priority

**Week 1:**
1. Update Firestore (add planType)
2. Replace StudentDashboard component
3. Create API endpoints

**Week 2:**
4. Build session management
5. Add Infinity features
6. Test & deploy

---

## 🧪 Testing Checklist

### Fast Plan
- [ ] No Mentoring tab visible
- [ ] Cannot book sessions
- [ ] Sees upgrade prompt
- [ ] Full course access

### Business Plan
- [ ] Mentoring tab visible
- [ ] Can book 6 sessions
- [ ] Session counter accurate
- [ ] Next session card shows

### Infinity Plan
- [ ] Premium services card shows
- [ ] Can request additional sessions
- [ ] Custom website tracked
- [ ] Product research tracked
- [ ] Crown icons (👑) visible

---

## 💡 Key Concepts

### Plan Detection
```typescript
// In component
const { planType } = enrollment
```

### Conditional Features
```typescript
// Show mentoring to Business & Infinity only
{['business', 'infinity'].includes(planType) && (
  <MentoringTab />
)}
```

### Session Limits
```typescript
// Business: Limited (6 sessions)
sessionsRemaining <= totalSessions

// Infinity: Unlimited
canRequestAdditional = true
```

---

## 🆘 Common Issues & Solutions

### Issue: Mentoring tab not showing
**Solution:** Check `planType` is 'business' or 'infinity'

### Issue: Session booking disabled
**Solution:** Verify `sessionsRemaining > 0` for Business

### Issue: Infinity features missing
**Solution:** Check `infinityExtras` object exists in enrollment

### Issue: Wrong plan badge color
**Solution:** Verify `planType` matches expected value

---

## 📞 Support

- Check documentation files first
- Test with mock data
- Verify Firestore structure
- Review component props
- Check console for errors

---

## 🎓 Remember

1. **Fast** = Self-paced learning only
2. **Business** = Fast + 1:1 Mentoring
3. **Infinity** = Business + Premium services

Each tier builds on the previous one!

---

## 📝 Quick Notes

- All plans get full course content
- Mentoring is Business & Infinity only
- Infinity has premium deliverables (Dropshipping)
- Session limits: Fast=0, Business=6, Infinity=unlimited
- Plan badge shows in header
- Colors indicate plan tier
- Tabs change based on access

---

**This card covers the essentials. For details, see the full documentation!**
