/**
 * Date utility functions
 * Handles date formatting, calculations, and validations
 */

/**
 * Get start and end of day
 * @param {Date} date - Input date
 * @returns {Object} Start and end of day
 */
export const getStartAndEndOfDay = (date = new Date()) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    return { start, end }
}

/**
 * Get start and end of month
 * @param {Date} date - Input date
 * @returns {Object} Start and end of month
 */
export const getStartAndEndOfMonth = (date = new Date()) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    )

    return { start, end }
}

/**
 * Get start and end of year
 * @param {Date} date - Input date
 * @returns {Object} Start and end of year
 */
export const getStartAndEndOfYear = (date = new Date()) => {
    const start = new Date(date.getFullYear(), 0, 1)
    const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)

    return { start, end }
}

/**
 * Get financial year (April to March)
 * @param {Date} date - Input date
 * @returns {Object} Start and end of financial year
 */
export const getFinancialYear = (date = new Date()) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    // If month is January, February, or March, FY started last year
    const fyStartYear = month < 3 ? year - 1 : year

    const start = new Date(fyStartYear, 3, 1) // April 1st
    const end = new Date(fyStartYear + 1, 2, 31, 23, 59, 59, 999) // March 31st

    return { start, end }
}

/**
 * Get date range from query parameters
 * @param {String} startDate - Start date string
 * @param {String} endDate - End date string
 * @returns {Object} Date range object
 */
export const getDateRangeFromQuery = (startDate, endDate) => {
    let start, end

    if (startDate) {
        start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
    }

    if (endDate) {
        end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
    }

    return { start, end }
}

/**
 * Add days to date
 * @param {Date} date - Input date
 * @param {Number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

/**
 * Add months to date
 * @param {Date} date - Input date
 * @param {Number} months - Number of months to add
 * @returns {Date} New date
 */
export const addMonths = (date, months) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
}

/**
 * Check if date is valid
 * @param {*} date - Date to validate
 * @returns {Boolean} Is valid date
 */
export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date)
}

/**
 * Format date to Indian format (DD/MM/YYYY)
 * @param {Date} date - Input date
 * @returns {String} Formatted date
 */
export const formatIndianDate = (date) => {
    if (!isValidDate(date)) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {Date} date - Input date
 * @returns {String} Formatted date
 */
export const formatISODate = (date) => {
    if (!isValidDate(date)) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {Number} Number of days
 */
export const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.round(Math.abs((date1 - date2) / oneDay))
}

/**
 * Check if date is today
 * @param {Date} date - Input date
 * @returns {Boolean} Is today
 */
export const isToday = (date) => {
    const today = new Date()
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

/**
 * Check if date is in past
 * @param {Date} date - Input date
 * @returns {Boolean} Is in past
 */
export const isPast = (date) => {
    return date < new Date()
}

/**
 * Check if date is in future
 * @param {Date} date - Input date
 * @returns {Boolean} Is in future
 */
export const isFuture = (date) => {
    return date > new Date()
}

export default {
    getStartAndEndOfDay,
    getStartAndEndOfMonth,
    getStartAndEndOfYear,
    getFinancialYear,
    getDateRangeFromQuery,
    addDays,
    addMonths,
    isValidDate,
    formatIndianDate,
    formatISODate,
    daysBetween,
    isToday,
    isPast,
    isFuture,
}
