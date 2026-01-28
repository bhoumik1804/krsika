/**
 * Transaction Types Constants
 * ===========================
 * Transaction status and related constants
 */

/** Transaction status values */
const TRANSACTION_STATUS = Object.freeze({
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    PARTIAL: 'partial',
})

/** Array of all transaction statuses */
const TRANSACTION_STATUS_ARRAY = Object.freeze(
    Object.values(TRANSACTION_STATUS)
)

/** Transaction types for receipts */
const TRANSACTION_TYPE = Object.freeze({
    SALE_PAYMENT: 'SALE_PAYMENT',
    PURCHASE_PAYMENT: 'PURCHASE_PAYMENT',
    LABOUR_PAYMENT: 'LABOUR_PAYMENT',
    TRANSPORT_PAYMENT: 'TRANSPORT_PAYMENT',
    BROKER_COMMISSION: 'BROKER_COMMISSION',
    SALARY: 'SALARY',
    ADVANCE: 'ADVANCE',
    OTHER: 'OTHER',
})

/** Array of all transaction types */
const TRANSACTION_TYPE_ARRAY = Object.freeze(Object.values(TRANSACTION_TYPE))

/** Delivery types */
const DELIVERY_TYPES = Object.freeze({
    PADE_MEIN: 'पड़े में',
    PAHUNCHA_KAR: 'पहुंचा कर',
})

/** Array of all delivery types */
const DELIVERY_TYPES_ARRAY = Object.freeze(Object.values(DELIVERY_TYPES))

/** FCI or NAN options */
const FCI_NAN_OPTIONS = Object.freeze({
    FCI: 'FCI',
    NAN: 'NAN',
})

/** Array of FCI/NAN options */
const FCI_NAN_OPTIONS_ARRAY = Object.freeze(Object.values(FCI_NAN_OPTIONS))

/** Gunny delivery location types */
const GUNNY_DELIVERY_LOCATIONS = Object.freeze({
    MILL: 'मिल में',
    COMMITTEE: 'समिति / संग्रहण केंद्र में',
})

/** Array of gunny delivery locations */
const GUNNY_DELIVERY_LOCATIONS_ARRAY = Object.freeze(
    Object.values(GUNNY_DELIVERY_LOCATIONS)
)

export {
    TRANSACTION_STATUS,
    TRANSACTION_STATUS_ARRAY,
    TRANSACTION_TYPE,
    TRANSACTION_TYPE_ARRAY,
    DELIVERY_TYPES,
    DELIVERY_TYPES_ARRAY,
    FCI_NAN_OPTIONS,
    FCI_NAN_OPTIONS_ARRAY,
    GUNNY_DELIVERY_LOCATIONS,
    GUNNY_DELIVERY_LOCATIONS_ARRAY,
}

export default {
    TRANSACTION_STATUS,
    TRANSACTION_STATUS_ARRAY,
    TRANSACTION_TYPE,
    TRANSACTION_TYPE_ARRAY,
    DELIVERY_TYPES,
    DELIVERY_TYPES_ARRAY,
    FCI_NAN_OPTIONS,
    FCI_NAN_OPTIONS_ARRAY,
    GUNNY_DELIVERY_LOCATIONS,
    GUNNY_DELIVERY_LOCATIONS_ARRAY,
}
