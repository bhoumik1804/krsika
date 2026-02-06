/**
 * Mill Status - Used in: src/models/mill.model.js (Mill.status)
 * Defines the lifecycle states of a rice mill in the system
 * Default: PENDING_VERIFICATION
 */
export const MILL_STATUS = Object.freeze({
    /** Mill registration is pending verification by Super Admin */
    PENDING_VERIFICATION: 'pending-verification',

    /** Mill is verified and actively operating with valid subscription */
    ACTIVE: 'active',

    /** Mill has been temporarily suspended (e.g., payment issues, violations) */
    SUSPENDED: 'suspended',

    /** Mill registration was rejected by Super Admin during verification */
    REJECTED: 'rejected',
})
