/**
 * Subscription Billing Cycle - Used in: src/models/subscription.model.js (Subscription.billingCycle)
 * Defines the payment frequency for mill subscription plans
 */
export const SUBSCRIPTION_BILLING_CYCLE = Object.freeze({
    /** Billed and renewed every month */
    MONTHLY: 'monthly',

    /** Billed and renewed annually (typically with discount) */
    YEARLY: 'yearly',

    /** Single one-time payment (no auto-renewal) */
    ONE_TIME: 'one_time',
})
