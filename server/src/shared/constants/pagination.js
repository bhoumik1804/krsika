/**
 * Pagination Constants
 * ====================
 * Default pagination settings matching client constants
 */

/** Default pagination settings */
const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
})

/** Sort order options */
const SORT_ORDER = Object.freeze({
    ASC: 'asc',
    DESC: 'desc',
})

/** Array of sort orders */
const SORT_ORDER_ARRAY = Object.freeze(Object.values(SORT_ORDER))

export { PAGINATION, SORT_ORDER, SORT_ORDER_ARRAY }

export default {
    PAGINATION,
    SORT_ORDER,
    SORT_ORDER_ARRAY,
}
