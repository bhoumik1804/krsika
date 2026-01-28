/**
 * Sale Types Constants
 * ====================
 * Based on client sale form constants
 */

/** Paddy sale types */
const PADDY_SALE_TYPES = Object.freeze({
    DO_SALE: 'DO बिक्री',
    OTHER_SALE: 'अन्य (मिल से बिक्री)',
})

/** Array of paddy sale types */
const PADDY_SALE_TYPES_ARRAY = Object.freeze(Object.values(PADDY_SALE_TYPES))

/** Lot or other sale types */
const LOT_OR_OTHER_SALE_TYPES = Object.freeze({
    LOT_SALE: 'LOT बिक्री',
    OTHER_SALE: 'अन्य बिक्री',
})

/** Array of lot or other sale types */
const LOT_OR_OTHER_SALE_TYPES_ARRAY = Object.freeze(
    Object.values(LOT_OR_OTHER_SALE_TYPES)
)

/** All sale deal types */
const SALE_DEAL_TYPES = Object.freeze({
    RICE: 'चावल बिक्री',
    PADDY: 'धान बिक्री',
    KHANDA: 'खंडा बिक्री',
    NAKKHI: 'नक्खी बिक्री',
    BHUSA: 'भूसा बिक्री',
    KODHA: 'कोढ़ा बिक्री',
    SILKY_KODHA: 'सिल्की कोढ़ा बिक्री',
    GUNNY: 'बोरी बिक्री',
    FRK: 'FRK बिक्री',
    OTHER: 'अन्य बिक्री',
})

/** Array of all sale deal types */
const SALE_DEAL_TYPES_ARRAY = Object.freeze(Object.values(SALE_DEAL_TYPES))

/** Sale categories for internal use */
const SALE_CATEGORIES = Object.freeze({
    RICE: 'RICE',
    PADDY: 'PADDY',
    KHANDA: 'KHANDA',
    NAKKHI: 'NAKKHI',
    BHUSA: 'BHUSA',
    KODHA: 'KODHA',
    SILKY_KODHA: 'SILKY_KODHA',
    GUNNY: 'GUNNY',
    FRK: 'FRK',
    OTHER: 'OTHER',
})

/** Array of sale categories */
const SALE_CATEGORIES_ARRAY = Object.freeze(Object.values(SALE_CATEGORIES))

export {
    PADDY_SALE_TYPES,
    PADDY_SALE_TYPES_ARRAY,
    LOT_OR_OTHER_SALE_TYPES,
    LOT_OR_OTHER_SALE_TYPES_ARRAY,
    SALE_DEAL_TYPES,
    SALE_DEAL_TYPES_ARRAY,
    SALE_CATEGORIES,
    SALE_CATEGORIES_ARRAY,
}

// Alias for model compatibility
export const SALE_TYPE = SALE_CATEGORIES

export default {
    PADDY_SALE_TYPES,
    PADDY_SALE_TYPES_ARRAY,
    LOT_OR_OTHER_SALE_TYPES,
    LOT_OR_OTHER_SALE_TYPES_ARRAY,
    SALE_DEAL_TYPES,
    SALE_DEAL_TYPES_ARRAY,
    SALE_CATEGORIES,
    SALE_CATEGORIES_ARRAY,
    SALE_TYPE,
}
