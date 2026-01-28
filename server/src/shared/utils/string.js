/**
 * String utility functions
 * Handles string formatting, sanitization, and transformations
 */

/**
 * Convert string to slug
 * @param {String} str - Input string
 * @returns {String} Slug string
 */
export const toSlug = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Capitalize first letter
 * @param {String} str - Input string
 * @returns {String} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize each word
 * @param {String} str - Input string
 * @returns {String} Title case string
 */
export const toTitleCase = (str) => {
    if (!str) return ''
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ')
}

/**
 * Truncate string with ellipsis
 * @param {String} str - Input string
 * @param {Number} length - Maximum length
 * @returns {String} Truncated string
 */
export const truncate = (str, length = 100) => {
    if (!str || str.length <= length) return str
    return str.slice(0, length) + '...'
}

/**
 * Remove extra whitespace
 * @param {String} str - Input string
 * @returns {String} Cleaned string
 */
export const cleanWhitespace = (str) => {
    if (!str) return ''
    return str.trim().replace(/\s+/g, ' ')
}

/**
 * Mask string (e.g., phone number, email)
 * @param {String} str - Input string
 * @param {Number} visibleStart - Visible characters from start
 * @param {Number} visibleEnd - Visible characters from end
 * @returns {String} Masked string
 */
export const mask = (str, visibleStart = 3, visibleEnd = 3) => {
    if (!str || str.length <= visibleStart + visibleEnd) return str

    const start = str.slice(0, visibleStart)
    const end = str.slice(-visibleEnd)
    const maskedLength = str.length - visibleStart - visibleEnd

    return `${start}${'*'.repeat(maskedLength)}${end}`
}

/**
 * Generate random string
 * @param {Number} length - Length of string
 * @param {String} charset - Character set to use
 * @returns {String} Random string
 */
export const randomString = (
    length = 10,
    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) => {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
}

/**
 * Generate numeric OTP
 * @param {Number} length - Length of OTP
 * @returns {String} OTP string
 */
export const generateOTP = (length = 6) => {
    return randomString(length, '0123456789')
}

/**
 * Check if string is valid email
 * @param {String} email - Email string
 * @returns {Boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Check if string is valid mobile number (Indian)
 * @param {String} mobile - Mobile number
 * @returns {Boolean} Is valid mobile
 */
export const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
}

/**
 * Format mobile number for display
 * @param {String} mobile - Mobile number
 * @returns {String} Formatted mobile
 */
export const formatMobile = (mobile) => {
    if (!mobile || mobile.length !== 10) return mobile
    return `${mobile.slice(0, 5)}-${mobile.slice(5)}`
}

/**
 * Sanitize filename
 * @param {String} filename - Original filename
 * @returns {String} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase()
}

/**
 * Convert number to words (Indian system)
 * @param {Number} num - Number to convert
 * @returns {String} Number in words
 */
export const numberToWords = (num) => {
    const ones = [
        '',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
    ]
    const tens = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
    ]

    if (num === 0) return 'Zero'

    const convert = (n) => {
        if (n < 20) return ones[n]
        if (n < 100)
            return (
                tens[Math.floor(n / 10)] +
                (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
            )
        if (n < 1000)
            return (
                ones[Math.floor(n / 100)] +
                ' Hundred' +
                (n % 100 !== 0 ? ' ' + convert(n % 100) : '')
            )
        if (n < 100000)
            return (
                convert(Math.floor(n / 1000)) +
                ' Thousand' +
                (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '')
            )
        if (n < 10000000)
            return (
                convert(Math.floor(n / 100000)) +
                ' Lakh' +
                (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '')
            )
        return (
            convert(Math.floor(n / 10000000)) +
            ' Crore' +
            (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '')
        )
    }

    return convert(num)
}

export default {
    toSlug,
    capitalize,
    toTitleCase,
    truncate,
    cleanWhitespace,
    mask,
    randomString,
    generateOTP,
    isValidEmail,
    isValidMobile,
    formatMobile,
    sanitizeFilename,
    numberToWords,
}
