/**
 * Purchase Types Constants
 * ========================
 * Based on client purchase form constants
 */

/** Paddy purchase types */
const PADDY_PURCHASE_TYPES = Object.freeze({
    DO_KHARIDI: 'DO खरीदी',
    OTHER_KHARIDI: 'अन्य खरीदी',
})

/** Array of paddy purchase types */
const PADDY_PURCHASE_TYPES_ARRAY = Object.freeze(
    Object.values(PADDY_PURCHASE_TYPES)
)

/** Rice purchase types */
const RICE_PURCHASE_TYPES = Object.freeze({
    LOT_KHARIDI: 'LOT खरीदी',
    RICE_KHARIDI: 'चावल खरीदी',
})

/** Array of rice purchase types */
const RICE_PURCHASE_TYPES_ARRAY = Object.freeze(
    Object.values(RICE_PURCHASE_TYPES)
)

/** Lot or other purchase types */
const LOT_OR_OTHER_TYPES = Object.freeze({
    LOT_KHARIDI: 'LOT खरीदी',
    OTHER_KHARIDI: 'अन्य खरीदी',
})

/** Array of lot or other types */
const LOT_OR_OTHER_TYPES_ARRAY = Object.freeze(
    Object.values(LOT_OR_OTHER_TYPES)
)

/** All purchase deal types */
const PURCHASE_DEAL_TYPES = Object.freeze({
    PADDY: 'धान खरीदी',
    RICE: 'चावल खरीदी',
    GUNNY: 'बोरी खरीदी',
    FRK: 'FRK खरीदी',
    OTHER: 'अन्य खरीदी',
})

/** Array of all purchase deal types */
const PURCHASE_DEAL_TYPES_ARRAY = Object.freeze(
    Object.values(PURCHASE_DEAL_TYPES)
)

/** Purchase categories for internal use */
const PURCHASE_CATEGORIES = Object.freeze({
    PADDY: 'PADDY',
    RICE: 'RICE',
    GUNNY: 'GUNNY',
    FRK: 'FRK',
    OTHER: 'OTHER',
})

/** Array of purchase categories */
const PURCHASE_CATEGORIES_ARRAY = Object.freeze(
    Object.values(PURCHASE_CATEGORIES)
)

export {
    PADDY_PURCHASE_TYPES,
    PADDY_PURCHASE_TYPES_ARRAY,
    RICE_PURCHASE_TYPES,
    RICE_PURCHASE_TYPES_ARRAY,
    LOT_OR_OTHER_TYPES,
    LOT_OR_OTHER_TYPES_ARRAY,
    PURCHASE_DEAL_TYPES,
    PURCHASE_DEAL_TYPES_ARRAY,
    PURCHASE_CATEGORIES,
    PURCHASE_CATEGORIES_ARRAY,
}

// Alias for model compatibility
export const PURCHASE_TYPE = PURCHASE_CATEGORIES

export default {
    PADDY_PURCHASE_TYPES,
    PADDY_PURCHASE_TYPES_ARRAY,
    RICE_PURCHASE_TYPES,
    RICE_PURCHASE_TYPES_ARRAY,
    LOT_OR_OTHER_TYPES,
    LOT_OR_OTHER_TYPES_ARRAY,
    PURCHASE_DEAL_TYPES,
    PURCHASE_DEAL_TYPES_ARRAY,
    PURCHASE_CATEGORIES,
    PURCHASE_CATEGORIES_ARRAY,
    PURCHASE_TYPE,
}
