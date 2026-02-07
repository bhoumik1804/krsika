// Import centralized constants
import {
    USER_ROLES,
    DEFAULT_ROLE,
    ROLE_DISPLAY_NAMES,
    type UserRole,
} from '@/constants'
import { type SidebarData } from '../types'
import { getGuestUserSidebarData } from './guest-user-sidebar-data'
import { getMillAdminSidebarData } from './mill-admin-sidebar-data'
import { getMillStaffSidebarData } from './mill-staff-sidebar-data'
import { superAdminSidebarData } from './super-admin-sidebar-data'

// ==========================================
// Sidebar Data Factories
// ==========================================

export type SidebarContext = {
    millId?: string
    staffId?: string
}

export type SidebarFactory = (context?: SidebarContext) => SidebarData

/**
 * Record-based sidebar data mapping.
 * Values are functions that return SidebarData.
 */
export const SIDEBAR_FACTORIES: Readonly<Record<UserRole, SidebarFactory>> = {
    'super-admin': () => superAdminSidebarData,
    'mill-admin': (ctx) => getMillAdminSidebarData(ctx?.millId || ''),
    'mill-staff': (ctx) => getMillStaffSidebarData(ctx?.millId || ''),
    'guest-user': () => getGuestUserSidebarData(),
} as const

// ==========================================
// Utility Functions
// ==========================================

/**
 * Type guard to check if a string is a valid UserRole
 * @param role - The role string to validate
 * @returns True if the role is a valid UserRole
 */
export function isValidRole(role: unknown): role is UserRole {
    return (
        typeof role === 'string' &&
        Object.values(USER_ROLES).includes(role as UserRole)
    )
}

/**
 * Get sidebar data by user role with context
 * @param role - The user role to get sidebar data for
 * @param context - Context containing dynamic params like millId
 * @returns SidebarData for the specified role
 */
export function getSidebarData(
    role: UserRole,
    context?: SidebarContext
): SidebarData {
    const factory = SIDEBAR_FACTORIES[role] ?? SIDEBAR_FACTORIES[DEFAULT_ROLE]
    return factory(context)
}

/**
 * Get all available roles (useful for dropdowns, selects)
 * @returns Array of all available user roles
 */
// export function getAvailableRoles(): UserRole[] {
//     return USER_ROLES
// }

/**
 * Get role display name (for UI)
 * @param role - The role to get display name for
 * @returns Human-readable role name
 */
export function getRoleDisplayName(role: UserRole): string {
    return ROLE_DISPLAY_NAMES[role] ?? 'Unknown Role'
}

// ==========================================
// Re-exports for Convenience
// ==========================================

// Re-export sidebar data generators
export { superAdminSidebarData } from './super-admin-sidebar-data'
export { getMillAdminSidebarData } from './mill-admin-sidebar-data'
export { getMillStaffSidebarData } from './mill-staff-sidebar-data'

// Re-export types
export type {
    SidebarData,
    NavGroup,
    NavItem,
    NavCollapsible,
    NavLink,
} from '../types'

// Re-export role constants from central location
export {
    USER_ROLES,
    DEFAULT_ROLE,
    ROLE_DISPLAY_NAMES,
    type UserRole,
} from '@/constants'
