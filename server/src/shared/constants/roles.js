/**
 * User Roles Constants
 * ====================
 */

/** Available user roles in the system */
const USER_ROLES = Object.freeze({
    SUPER_ADMIN: 'super-admin',
    MILL_ADMIN: 'mill-admin',
    MILL_STAFF: 'mill-staff',
})

/** Array of all user roles */
const USER_ROLES_ARRAY = Object.freeze(Object.values(USER_ROLES))

/** Default role when none is specified */
const DEFAULT_ROLE = USER_ROLES.SUPER_ADMIN

/** Human-readable display names for roles */
const ROLE_DISPLAY_NAMES = Object.freeze({
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.MILL_ADMIN]: 'Mill Admin',
    [USER_ROLES.MILL_STAFF]: 'Mill Staff',
})

/** Staff roles within a mill */
const STAFF_ROLES = Object.freeze({
    MANAGER: 'MANAGER',
    ACCOUNTANT: 'ACCOUNTANT',
    SUPERVISOR: 'SUPERVISOR',
    OPERATOR: 'OPERATOR',
    LABOURER: 'LABOURER',
    SECURITY: 'SECURITY',
    OTHER: 'OTHER',
})

/** Array of all staff roles */
const STAFF_ROLES_ARRAY = Object.freeze(Object.values(STAFF_ROLES))

export {
    USER_ROLES,
    USER_ROLES_ARRAY,
    DEFAULT_ROLE,
    ROLE_DISPLAY_NAMES,
    STAFF_ROLES,
    STAFF_ROLES_ARRAY,
}

export default {
    USER_ROLES,
    USER_ROLES_ARRAY,
    DEFAULT_ROLE,
    ROLE_DISPLAY_NAMES,
    STAFF_ROLES,
    STAFF_ROLES_ARRAY,
}
