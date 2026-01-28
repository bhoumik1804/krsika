/**
 * Inward & Outward Types Constants
 * ================================
 * Based on client inward/outward form constants
 */

/** Inward types */
const INWARD_TYPES = Object.freeze({
    PADDY: 'धान आवक',
    RICE: 'चावल आवक',
    GUNNY: 'बारदाना आवक',
    FRK: 'FRK आवक',
    OTHER: 'अन्य आवक',
})

/** Array of all inward types */
const INWARD_TYPES_ARRAY = Object.freeze(Object.values(INWARD_TYPES))

/** Outward types */
const OUTWARD_TYPES = Object.freeze({
    PADDY: 'धान जावक',
    RICE: 'चावल जावक',
    GUNNY: 'बारदाना जावक',
    FRK: 'FRK जावक',
    KHANDA: 'खंडा जावक',
    NAKKHI: 'नक्खी जावक',
    BHUSA: 'भूसा जावक',
    KODHA: 'कोढ़ा जावक',
    SILKY_KODHA: 'सिल्की कोढ़ा जावक',
    OTHER: 'अन्य जावक',
})

/** Array of all outward types */
const OUTWARD_TYPES_ARRAY = Object.freeze(Object.values(OUTWARD_TYPES))

/** Inward categories for internal use */
const INWARD_CATEGORIES = Object.freeze({
    GOVT_PADDY: 'GOVT_PADDY',
    PRIVATE_PADDY: 'PRIVATE_PADDY',
    RICE: 'RICE',
    GUNNY: 'GUNNY',
    FRK: 'FRK',
    OTHER: 'OTHER',
})

/** Array of inward categories */
const INWARD_CATEGORIES_ARRAY = Object.freeze(Object.values(INWARD_CATEGORIES))

/** Outward categories for internal use */
const OUTWARD_CATEGORIES = Object.freeze({
    GOVT_RICE: 'GOVT_RICE',
    PRIVATE_RICE: 'PRIVATE_RICE',
    PADDY: 'PADDY',
    GUNNY: 'GUNNY',
    FRK: 'FRK',
    KHANDA: 'KHANDA',
    NAKKHI: 'NAKKHI',
    BHUSA: 'BHUSA',
    KODHA: 'KODHA',
    SILKY_KODHA: 'SILKY_KODHA',
    OTHER: 'OTHER',
})

/** Array of outward categories */
const OUTWARD_CATEGORIES_ARRAY = Object.freeze(
    Object.values(OUTWARD_CATEGORIES)
)

export {
    INWARD_TYPES,
    INWARD_TYPES_ARRAY,
    OUTWARD_TYPES,
    OUTWARD_TYPES_ARRAY,
    INWARD_CATEGORIES,
    INWARD_CATEGORIES_ARRAY,
    OUTWARD_CATEGORIES,
    OUTWARD_CATEGORIES_ARRAY,
}

export default {
    INWARD_TYPES,
    INWARD_TYPES_ARRAY,
    OUTWARD_TYPES,
    OUTWARD_TYPES_ARRAY,
    INWARD_CATEGORIES,
    INWARD_CATEGORIES_ARRAY,
    OUTWARD_CATEGORIES,
    OUTWARD_CATEGORIES_ARRAY,
}
