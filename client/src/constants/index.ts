// ==========================================
// User Role Constants
// ==========================================

/** * Centralized definition of user roles.
 * Use these constants instead of hardcoded strings.
 */
export const USER_ROLES = {
    SUPER_ADMIN: 'super-admin',
    MILL_ADMIN: 'mill-admin',
    MILL_STAFF: 'mill-staff',
    GUEST_USER: 'guest-user',
} as const

/** * User role type derived automatically from the values of USER_ROLES 
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/** * Default role when none is specified or invalid 
 */
export const DEFAULT_ROLE: UserRole = USER_ROLES.SUPER_ADMIN

/** * Human-readable display names for roles.
 * Uses computed properties so keys stay in sync with USER_ROLES.
 */
export const ROLE_DISPLAY_NAMES: Readonly<Record<UserRole, string>> = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.MILL_ADMIN]: 'Mill Admin',
    [USER_ROLES.MILL_STAFF]: 'Mill Staff',
    [USER_ROLES.GUEST_USER]: 'Guest User',
} as const


export const EXPORT_FILE_TYPES = ['csv', 'xlsx', 'pdf'] as const
export type ExportFileType = (typeof EXPORT_FILE_TYPES)[number]

export const IMPORT_FILE_TYPES = ['csv', 'xlsx'] as const
export type ImportFileType = (typeof IMPORT_FILE_TYPES)[number]

/**
 * Mill Status - Synced with: server/src/constants/mill.status.enum.js
 * Defines the lifecycle states of a rice mill in the system
 */
export const MILL_STATUS = {
    /** Mill registration is pending verification by Super Admin */
    PENDING_VERIFICATION: 'pending-verification',

    /** Mill is verified and actively operating with valid subscription */
    ACTIVE: 'active',

    /** Mill has been temporarily suspended (e.g., payment issues, violations) */
    SUSPENDED: 'suspended',

    /** Mill registration was rejected by Super Admin during verification */
    REJECTED: 'rejected',
} as const

export type MillStatus = (typeof MILL_STATUS)[keyof typeof MILL_STATUS]

