/**
 * Role Utilities - Phase 1 (Admin + Kunde Only)
 * 
 * Simplified role system for MVP:
 * - Admin: Full system access (manages everything + acts as mentor)
 * - Kunde: Customer/Student access (learning dashboard)
 * - Besucher: Visitor (public website only)
 * - Affiliate: Reserved for Phase 2
 */

import { UserRole } from './types'

/**
 * Map legacy roles to new roles
 */
export function mapLegacyRole(legacyRole: string): UserRole {
  const mapping: Record<string, UserRole> = {
    // Admin stays the same
    'admin': 'admin',
    
    // Mentors become admins (unified for Phase 1)
    'mentor': 'admin',
    
    // Students/Teilnehmer become Kunde (customers)
    'student': 'kunde',
    'teilnehmer': 'kunde',
    
    // Guest becomes Besucher
    'guest': 'besucher',
    
    // Default to besucher for unknown roles
    'default': 'besucher'
  }
  
  return mapping[legacyRole.toLowerCase()] || 'besucher'
}

/**
 * Check if a role has admin privileges
 */
export function hasAdminPrivileges(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * Check if a role can access customer/student features
 */
export function hasCustomerAccess(role: UserRole): boolean {
  // Admin can access kunde features for testing/support
  // Kunde can access their own features
  return role === 'kunde' || role === 'admin'
}

/**
 * Check if a role can access affiliate features (Phase 2)
 */
export function hasAffiliateAccess(role: UserRole): boolean {
  return role === 'affiliate' || role === 'admin'
}

/**
 * Get the dashboard route for a given role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'kunde':
      return '/student' // Kunde use student dashboard
    case 'affiliate':
      return '/affiliate' // Phase 2
    case 'besucher':
      return '/' // Visitors go to homepage
    default:
      return '/'
  }
}

/**
 * Get display name for role (in German)
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    'admin': 'Administrator',
    'kunde': 'Kunde',
    'affiliate': 'Affiliate Partner',
    'besucher': 'Besucher'
  }
  
  return names[role] || 'Unbekannt'
}

/**
 * Get available roles for user creation (admin use)
 * Phase 1: Only admin and kunde
 */
export function getAvailableRoles(): { value: UserRole; label: string }[] {
  return [
    { value: 'kunde', label: 'Kunde' },
    { value: 'admin', label: 'Administrator' },
    // Phase 2: Uncomment when affiliate system is ready
    // { value: 'affiliate', label: 'Affiliate Partner' },
  ]
}

/**
 * Validate if a string is a valid UserRole
 */
export function isValidRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['admin', 'kunde', 'affiliate', 'besucher']
  return validRoles.includes(role as UserRole)
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * Check if user can manage courses
 */
export function canManageCourses(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * Check if user can access intake review
 */
export function canReviewIntake(role: UserRole): boolean {
  return role === 'admin'
}
