/**
 * Miscellaneous Types Constants
 * =============================
 * Labour, committee, subscription, and other types
 */

/** Labour types */
const LABOUR_TYPES = Object.freeze({
    PALA_BHARAI: 'पाला भराई',
    KANTA: 'कांटा',
    SILAI: 'सिलाई',
    INWARD: 'INWARD',
    OUTWARD: 'OUTWARD',
    MILLING: 'MILLING',
    OTHER: 'अन्य',
})

/** Array of all labour types */
const LABOUR_TYPES_ARRAY = Object.freeze(Object.values(LABOUR_TYPES))

/** Committee types */
const COMMITTEE_TYPES = Object.freeze({
    SAMITI: 'समिति',
    SANGHRAHAN: 'संग्रहण',
})

/** Array of committee types */
const COMMITTEE_TYPES_ARRAY = Object.freeze(Object.values(COMMITTEE_TYPES))

/** Mill status */
const MILL_STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING: 'PENDING',
})

/** Array of mill statuses */
const MILL_STATUS_ARRAY = Object.freeze(Object.values(MILL_STATUS))

/** Subscription plans */
const SUBSCRIPTION_PLANS = Object.freeze({
    FREE: 'FREE',
    BASIC: 'BASIC',
    PROFESSIONAL: 'PROFESSIONAL',
    ENTERPRISE: 'ENTERPRISE',
})

/** Array of subscription plans */
const SUBSCRIPTION_PLANS_ARRAY = Object.freeze(
    Object.values(SUBSCRIPTION_PLANS)
)

/** Subscription status */
const SUBSCRIPTION_STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
    TRIAL: 'TRIAL',
})

/** Array of subscription statuses */
const SUBSCRIPTION_STATUS_ARRAY = Object.freeze(
    Object.values(SUBSCRIPTION_STATUS)
)

/** Billing cycles */
const BILLING_CYCLES = Object.freeze({
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
})

/** Array of billing cycles */
const BILLING_CYCLES_ARRAY = Object.freeze(Object.values(BILLING_CYCLES))

/** Attendance status */
const ATTENDANCE_STATUS = Object.freeze({
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    HALF_DAY: 'HALF_DAY',
    LEAVE: 'LEAVE',
})

/** Array of attendance statuses */
const ATTENDANCE_STATUS_ARRAY = Object.freeze(Object.values(ATTENDANCE_STATUS))

/** Delivery order status */
const DO_STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    PARTIAL: 'PARTIAL',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
})

/** Array of DO statuses */
const DO_STATUS_ARRAY = Object.freeze(Object.values(DO_STATUS))

/** Milling types */
const MILLING_TYPES = Object.freeze({
    PADDY_TO_RICE: 'PADDY_TO_RICE',
    RICE_SORTING: 'RICE_SORTING',
})

/** Array of milling types */
const MILLING_TYPES_ARRAY = Object.freeze(Object.values(MILLING_TYPES))

/** Export file types */
const EXPORT_FILE_TYPES = Object.freeze({
    CSV: 'csv',
    XLSX: 'xlsx',
    PDF: 'pdf',
})

/** Array of export file types */
const EXPORT_FILE_TYPES_ARRAY = Object.freeze(Object.values(EXPORT_FILE_TYPES))

export {
    LABOUR_TYPES,
    LABOUR_TYPES_ARRAY,
    COMMITTEE_TYPES,
    COMMITTEE_TYPES_ARRAY,
    MILL_STATUS,
    MILL_STATUS_ARRAY,
    SUBSCRIPTION_PLANS,
    SUBSCRIPTION_PLANS_ARRAY,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_STATUS_ARRAY,
    BILLING_CYCLES,
    BILLING_CYCLES_ARRAY,
    ATTENDANCE_STATUS,
    ATTENDANCE_STATUS_ARRAY,
    DO_STATUS,
    DO_STATUS_ARRAY,
    MILLING_TYPES,
    MILLING_TYPES_ARRAY,
    EXPORT_FILE_TYPES,
    EXPORT_FILE_TYPES_ARRAY,
}

export default {
    LABOUR_TYPES,
    LABOUR_TYPES_ARRAY,
    COMMITTEE_TYPES,
    COMMITTEE_TYPES_ARRAY,
    MILL_STATUS,
    MILL_STATUS_ARRAY,
    SUBSCRIPTION_PLANS,
    SUBSCRIPTION_PLANS_ARRAY,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_STATUS_ARRAY,
    BILLING_CYCLES,
    BILLING_CYCLES_ARRAY,
    ATTENDANCE_STATUS,
    ATTENDANCE_STATUS_ARRAY,
    DO_STATUS,
    DO_STATUS_ARRAY,
    MILLING_TYPES,
    MILLING_TYPES_ARRAY,
    EXPORT_FILE_TYPES,
    EXPORT_FILE_TYPES_ARRAY,
}
