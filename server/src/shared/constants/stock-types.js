/**
 * Stock Types Constants
 * =====================
 * Based on client constants for paddy, rice, and by-products
 */

/** Paddy (धान) types */
const PADDY_TYPES = Object.freeze({
    MOTA: 'धान(मोटा)',
    PATLA: 'धान(पतला)',
    SARNA: 'धान(सरना)',
    MAHAMAYA: 'धान(महामाया)',
    RB_GOLD: 'धान(RB GOLD)',
})

/** Array of all paddy types */
const PADDY_TYPES_ARRAY = Object.freeze(Object.values(PADDY_TYPES))

/** Rice (चावल) types */
const RICE_TYPES = Object.freeze({
    MOTA: 'चावल(मोटा)',
    PATLA: 'चावल(पतला)',
})

/** Array of all rice types */
const RICE_TYPES_ARRAY = Object.freeze(Object.values(RICE_TYPES))

/** Gunny/Bori (बारदाना) types */
const GUNNY_TYPES = Object.freeze({
    WITH_WEIGHT: 'सहित (वजन में)',
    WITH_RATE: 'सहित (भाव में)',
    RETURN: 'वापसी',
})

/** Array of all gunny types */
const GUNNY_TYPES_ARRAY = Object.freeze(Object.values(GUNNY_TYPES))

/** FRK types */
const FRK_TYPES = Object.freeze({
    WITH_FRK: 'FRK साहित',
    FRK_TO_GIVE: 'FRK देना है',
    NON_FRK: 'NON FRK',
})

/** Array of all FRK types */
const FRK_TYPES_ARRAY = Object.freeze(Object.values(FRK_TYPES))

/** By-products stock types */
const BY_PRODUCT_TYPES = Object.freeze({
    KHANDA: 'खंडा',
    NAKKHI: 'नक्खी',
    BHUSA: 'भूसा',
    KODHA: 'कोढ़ा',
    SILKY_KODHA: 'सिल्की कोढ़ा',
})

/** Array of all by-product types */
const BY_PRODUCT_TYPES_ARRAY = Object.freeze(Object.values(BY_PRODUCT_TYPES))

/** All stock categories */
const STOCK_CATEGORIES = Object.freeze({
    PADDY: 'PADDY',
    RICE: 'RICE',
    GUNNY: 'GUNNY',
    FRK: 'FRK',
    KHANDA: 'KHANDA',
    NAKKHI: 'NAKKHI',
    BHUSA: 'BHUSA',
    KODHA: 'KODHA',
    SILKY_KODHA: 'SILKY_KODHA',
    OTHER: 'OTHER',
})

/** Array of all stock categories */
const STOCK_CATEGORIES_ARRAY = Object.freeze(Object.values(STOCK_CATEGORIES))

/** Quantity units */
const QUANTITY_UNITS = Object.freeze({
    QUINTAL: 'क्विंटल',
    KG: 'कि.ग्रा.',
    TON: 'टन',
    PIECE: 'नग',
    OTHER: 'अन्य',
})

/** Array of all quantity units */
const QUANTITY_UNITS_ARRAY = Object.freeze(Object.values(QUANTITY_UNITS))

export {
    PADDY_TYPES,
    PADDY_TYPES_ARRAY,
    RICE_TYPES,
    RICE_TYPES_ARRAY,
    GUNNY_TYPES,
    GUNNY_TYPES_ARRAY,
    FRK_TYPES,
    FRK_TYPES_ARRAY,
    BY_PRODUCT_TYPES,
    BY_PRODUCT_TYPES_ARRAY,
    STOCK_CATEGORIES,
    STOCK_CATEGORIES_ARRAY,
    QUANTITY_UNITS,
    QUANTITY_UNITS_ARRAY,
}

// Alias for model compatibility
export const STOCK_TYPE = STOCK_CATEGORIES

export default {
    PADDY_TYPES,
    PADDY_TYPES_ARRAY,
    RICE_TYPES,
    RICE_TYPES_ARRAY,
    GUNNY_TYPES,
    GUNNY_TYPES_ARRAY,
    FRK_TYPES,
    FRK_TYPES_ARRAY,
    BY_PRODUCT_TYPES,
    BY_PRODUCT_TYPES_ARRAY,
    STOCK_CATEGORIES,
    STOCK_CATEGORIES_ARRAY,
    QUANTITY_UNITS,
    QUANTITY_UNITS_ARRAY,
    STOCK_TYPE,
}
