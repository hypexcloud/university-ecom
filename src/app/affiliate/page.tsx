import { redirect } from 'next/navigation'

// Affiliate dashboard moved to student portal
export default function AffiliateRedirect() {
  redirect('/student/affiliate')
}
