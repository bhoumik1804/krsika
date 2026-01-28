/**
 * Application Configuration Constants
 * ====================================
 * App metadata, date formats, currency, and other config
 */

/** Application metadata */
const APP_META = Object.freeze({
    NAME: 'Rice Mill SaaS',
    SHORT_NAME: 'RiceMill',
    DESCRIPTION: 'The complete cloud platform for modern rice mill operations',
    VERSION: '1.0.0',
    CONTACT_EMAIL: 'support@ricemillsaas.com',
    CONTACT_PHONE: '+91 98765 43210',
})

/** Date format patterns */
const DATE_FORMATS = Object.freeze({
    DISPLAY: 'DD MMM YYYY',
    DISPLAY_SHORT: 'DD/MM/YY',
    INPUT: 'YYYY-MM-DD',
    DATETIME: 'DD MMM YYYY, hh:mm A',
    TIME: 'hh:mm A',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
})

/** Currency settings */
const CURRENCY = Object.freeze({
    CODE: 'INR',
    SYMBOL: '₹',
    LOCALE: 'en-IN',
})

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat(CURRENCY.LOCALE, {
        style: 'currency',
        currency: CURRENCY.CODE,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

/** File upload configuration */
const FILE_UPLOAD = Object.freeze({
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
})

/** JWT token configuration */
const TOKEN_CONFIG = Object.freeze({
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
    OTP_EXPIRES_IN_MINUTES: 10,
    PASSWORD_RESET_EXPIRES_IN_HOURS: 1,
})

/** Rate limiting configuration */
const RATE_LIMIT = Object.freeze({
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 10, // Stricter for auth endpoints
})

/** Socket.io configuration */
const SOCKET_CONFIG = Object.freeze({
    PING_TIMEOUT: 60000,
    PING_INTERVAL: 25000,
})

export {
    APP_META,
    DATE_FORMATS,
    CURRENCY,
    formatCurrency,
    FILE_UPLOAD,
    TOKEN_CONFIG,
    RATE_LIMIT,
    SOCKET_CONFIG,
}

export default {
    APP_META,
    DATE_FORMATS,
    CURRENCY,
    formatCurrency,
    FILE_UPLOAD,
    TOKEN_CONFIG,
    RATE_LIMIT,
    SOCKET_CONFIG,
}
