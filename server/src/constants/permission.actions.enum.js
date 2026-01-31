/**
 * Permission Actions - Used in: src/models/user.model.js (permissions.actions)
 * Defines granular CRUD permissions for mill staff on each module
 */
export const PERMISSION_ACTIONS = Object.freeze({
    /** Can view/read data in the module */
    VIEW: 'view',

    /** Can create new records in the module */
    CREATE: 'create',

    /** Can update/modify existing records in the module */
    EDIT: 'edit',

    /** Can delete records from the module */
    DELETE: 'delete',
})
