/**
 * Payment Types Constants
 * =======================
 * Based on client payment and financial constants
 */

/** Payment modes */
const PAYMENT_MODES = Object.freeze({
    CASH: 'cash',
    UPI: 'upi',
    BANK: 'bank',
    CREDIT: 'credit',
    CHEQUE: 'cheque',
})

/** Array of all payment modes */
const PAYMENT_MODES_ARRAY = Object.freeze(Object.values(PAYMENT_MODES))

/** Payment mode display names */
const PAYMENT_MODE_NAMES = Object.freeze({
    [PAYMENT_MODES.CASH]: 'Cash',
    [PAYMENT_MODES.UPI]: 'UPI',
    [PAYMENT_MODES.BANK]: 'Bank Transfer',
    [PAYMENT_MODES.CREDIT]: 'Credit',
    [PAYMENT_MODES.CHEQUE]: 'Cheque',
})

/** Payment status */
const PAYMENT_STATUS = Object.freeze({
    PENDING: 'PENDING',
    PARTIAL: 'PARTIAL',
    PAID: 'PAID',
})

/** Array of all payment statuses */
const PAYMENT_STATUS_ARRAY = Object.freeze(Object.values(PAYMENT_STATUS))

/** Payment types (what the payment is for) - Hindi */
const PAYMENT_TYPES = Object.freeze({
    DEAL_PAYMENT: 'सौदे का भुगतान',
    TRANSPORT_PAYMENT: 'परिवहन भुगतान',
    LABOUR_PAYMENT: 'हमाली भुगतान',
    SALARY_ADVANCE: 'वेतन / एडवांस भुगतान',
    MISC_EXPENSES: 'अन्य / चिल्हर खर्च',
})

/** Array of all payment types */
const PAYMENT_TYPES_ARRAY = Object.freeze(Object.values(PAYMENT_TYPES))

/** Receipt modes (same as payment modes for receiving money) */
const RECEIPT_MODES = PAYMENT_MODES
const RECEIPT_MODES_ARRAY = PAYMENT_MODES_ARRAY

export {
    PAYMENT_MODES,
    PAYMENT_MODES_ARRAY,
    PAYMENT_MODE_NAMES,
    PAYMENT_STATUS,
    PAYMENT_STATUS_ARRAY,
    PAYMENT_TYPES,
    PAYMENT_TYPES_ARRAY,
    RECEIPT_MODES,
    RECEIPT_MODES_ARRAY,
}

// Alias for backward compatibility
export const PAYMENT_MODE = PAYMENT_MODES

export default {
    PAYMENT_MODES,
    PAYMENT_MODES_ARRAY,
    PAYMENT_MODE_NAMES,
    PAYMENT_STATUS,
    PAYMENT_STATUS_ARRAY,
    PAYMENT_TYPES,
    PAYMENT_TYPES_ARRAY,
    RECEIPT_MODES,
    RECEIPT_MODES_ARRAY,
    PAYMENT_MODE: PAYMENT_MODES,
}
