/**
 * Authentication Utilities
 * Helper functions for auth-related operations
 */
import { USER_ROLES, UserRole } from '@/constants'
import type { User } from '@/types'

/**
 * Get redirect path based on user role
 * Maps different user roles to their respective dashboard paths
 *
 * @param user - The user object containing role and millId
 * @returns The redirect path for the user's dashboard
 *
 * Examples:
 * - SUPER_ADMIN: '/admin'
 * - MILL_ADMIN: '/mill/123'
 * - MILL_STAFF: '/staff/123'
 * - GUEST_USER: '/'
 */
export function getRedirectPath(user: User | null): string {
    if (!user) return '/'

    const roleRedirectMap: Record<UserRole, string> = {
        [USER_ROLES.SUPER_ADMIN]: '/admin',
        [USER_ROLES.MILL_ADMIN]: `/mill/${user.millId}`,
        [USER_ROLES.MILL_STAFF]: `/staff/${user.millId}`,
        [USER_ROLES.GUEST_USER]: '/',
    }

    return roleRedirectMap[user.role] ?? '/'
}
