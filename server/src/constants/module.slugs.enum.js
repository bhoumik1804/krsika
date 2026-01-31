/**
 * Module Slugs - Used in: src/models/user.model.js (permissions.moduleSlug)
 * Defines the functional modules available in the mill management system
 */
export const MODULE_SLUGS = Object.freeze({
    /** Purchase management module - track paddy/rice purchases */
    PURCHASES: 'purchases',

    /** Sales management module - track rice sales and invoicing */
    SALES: 'sales',

    /** Inward inventory module - track incoming stock/materials */
    INWARD: 'inward',

    /** Outward inventory module - track outgoing stock/dispatches */
    OUTWARD: 'outward',

    /** Milling operations module - track rice processing activities */
    MILLING: 'milling',
})
