/**
 * Payment Status - Used in: src/models/subscription.payment.model.js (Payment.status)
 * Tracks the lifecycle of subscription payment transactions
 * Default: PENDING
 */
export const PAYMENT_STAUS = Object.freeze({
    /** Payment received but awaiting Super Admin verification */
    PENDING: 'pending',

    /** Payment has been verified and confirmed by Super Admin */
    VERIFIED: 'verified',

    /** Payment transaction failed or was declined */
    FAILED: 'failed',

    /** Payment was refunded to the mill */
    REFUNDED: 'refunded',
})
