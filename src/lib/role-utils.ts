/**
 * Role Migration Utilities
 * 
 * These utilities help with the transition from the old role system to the new one.
 * 
 * OLD ROLES: 'admin', 'mentor', 'teilnehmer', 'student', 'guest'
 * NEW ROLES: 'admin', 'kunde', 'affiliate', 'besucher'
 */

import { UserRole, LegacyRole } from './types'

/**
 * Map legacy roles to new roles
 */
export function mapLegacyRole(legacyRole: string): UserRole {
  const mapping: Record<string, UserRole> = {
    // Admin stays the same
    'admin': 'admin',
    
    // Mentors become admins (or keep as separate if needed)
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
 * Check if a role can access customer features
 */
export function hasCustomerAccess(role: UserRole): boolean {
  return role === 'kunde' || role === 'admin'
}

/**
 * Check if a role can access affiliate features
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
      return '/student' // Kunde use student dashboard for now
    case 'affiliate':
      return '/affiliate' // Will be created in Phase 3
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
 * Get all available roles for selection (admin use)
 */
export function getAvailableRoles(): { value: UserRole; label: string }[] {
  return [
    { value: 'besucher', label: 'Besucher' },
    { value: 'kunde', label: 'Kunde' },
    { value: 'affiliate', label: 'Affiliate Partner' },
    { value: 'admin', label: 'Administrator' },
  ]
}

/**
 * Validate if a string is a valid UserRole
 */
export function isValidRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['admin', 'kunde', 'affiliate', 'besucher']
  return validRoles.includes(role as UserRole)
}
