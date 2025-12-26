# 🔧 MANUAL INTEGRATION STEPS FOR ORDER-PROCESSING.TS

## File: `/src/lib/order-processing.ts`

### Step 1: Add Import at Top of File

Add this import near the other imports:

```typescript
import { calculateCommission, recordCommission } from './affiliate-utils'
```

### Step 2: Add Commission Recording After Line ~327

Find the section where the order is updated with enrollment ID.
It should look like this:

```typescript
// 4. Update order with enrollment ID
await updateDoc(doc(db, 'orders', orderId), {
  courseEnrollmentId: enrollmentId,
  accessGranted: true,
  accessGrantedAt: Timestamp.now(),
  updatedAt: Timestamp.now()
})

// 5. Send welcome email
```

**Add this code between steps 4 and 5:**

```typescript
// 4. Update order with enrollment ID
await updateDoc(doc(db, 'orders', orderId), {
  courseEnrollmentId: enrollmentId,
  accessGranted: true,
  accessGrantedAt: Timestamp.now(),
  updatedAt: Timestamp.now()
})

// 5. Record affiliate commission if applicable
if (params.affiliateId) {
  try {
    const commission = calculateCommission(params.plan, params.amount)
    await recordCommission({
      affiliateId: params.affiliateId,
      orderId,
      amount: commission.amount,
      rate: commission.rate
    })
  } catch (error) {
    console.error('Error recording commission:', error)
    // Don't fail the order if commission recording fails
  }
}

// 6. Send welcome email
```

### Step 3: Update Comment Numbers

After adding the commission step, update the comment numbers:
- "5. Send welcome email" → "6. Send welcome email"

### That's it!

The commission will now be automatically recorded when orders are processed with an affiliateId.

---

## Testing Checklist:

1. ✅ Create an affiliate application
2. ✅ Admin approves application
3. ✅ Affiliate gets unique code
4. ✅ Affiliate shares referral link
5. ✅ User clicks link (cookie set)
6. ✅ User completes purchase
7. ✅ Commission recorded
8. ✅ Shows in affiliate dashboard
9. ✅ Admin can approve/pay commission
