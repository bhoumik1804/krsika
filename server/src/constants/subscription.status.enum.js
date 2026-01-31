/**
 * Subscription Status - Used in: src/models/subscription.model.js (Subscription.status)
 * Tracks the current state of a mill's subscription plan
 * Default: ACTIVE
 */
export const SUBSCRIPTION_STATUS = Object.freeze({
    /** Subscription is currently active and valid */
    ACTIVE: 'active',

    /** Subscription was cancelled by the mill */
    CANCELLED: 'cancelled',

    /** Subscription period has ended without renewal */
    EXPIRED: 'expired',

    /** Subscription was upgraded to a higher tier plan */
    UPGRADED: 'upgraded',
})
