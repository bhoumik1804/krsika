/**
 * Error Codes Constants
 * =====================
 * Standardized error codes for API responses
 */

/** HTTP Status based error codes */
const ERROR_CODES = Object.freeze({
    // 400 - Bad Request
    BAD_REQUEST: 'BAD_REQUEST',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // 401 - Unauthorized
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',

    // 403 - Forbidden
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    ACCESS_DENIED: 'ACCESS_DENIED',

    // 404 - Not Found
    NOT_FOUND: 'NOT_FOUND',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    MILL_NOT_FOUND: 'MILL_NOT_FOUND',

    // 409 - Conflict
    CONFLICT: 'CONFLICT',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',

    // 422 - Unprocessable Entity
    UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
    BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',

    // 429 - Too Many Requests
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

    // 500 - Internal Server Error
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',

    // Custom Application Errors
    SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
    SUBSCRIPTION_LIMIT_REACHED: 'SUBSCRIPTION_LIMIT_REACHED',
    INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
    PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
    OTP_EXPIRED: 'OTP_EXPIRED',
    OTP_INVALID: 'OTP_INVALID',
})

/** Error messages for error codes */
const ERROR_MESSAGES = Object.freeze({
    [ERROR_CODES.BAD_REQUEST]: 'Bad request',
    [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed',
    [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Missing required field',
    [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
    [ERROR_CODES.INVALID_TOKEN]: 'Invalid authentication token',
    [ERROR_CODES.TOKEN_EXPIRED]: 'Authentication token has expired',
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password',
    [ERROR_CODES.ACCOUNT_DEACTIVATED]: 'Account has been deactivated',
    [ERROR_CODES.FORBIDDEN]: 'Access forbidden',
    [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
    [ERROR_CODES.ACCESS_DENIED]: 'Access denied to this resource',
    [ERROR_CODES.NOT_FOUND]: 'Resource not found',
    [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Requested resource not found',
    [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
    [ERROR_CODES.MILL_NOT_FOUND]: 'Mill not found',
    [ERROR_CODES.CONFLICT]: 'Resource conflict',
    [ERROR_CODES.DUPLICATE_ENTRY]: 'Duplicate entry exists',
    [ERROR_CODES.EMAIL_ALREADY_EXISTS]: 'Email already registered',
    [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
    [ERROR_CODES.UNPROCESSABLE_ENTITY]: 'Unable to process request',
    [ERROR_CODES.BUSINESS_RULE_VIOLATION]: 'Business rule violation',
    [ERROR_CODES.INSUFFICIENT_STOCK]: 'Insufficient stock available',
    [ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests',
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
    [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred',
    [ERROR_CODES.UNEXPECTED_ERROR]: 'An unexpected error occurred',
    [ERROR_CODES.SUBSCRIPTION_EXPIRED]: 'Subscription has expired',
    [ERROR_CODES.SUBSCRIPTION_LIMIT_REACHED]: 'Subscription limit reached',
    [ERROR_CODES.INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
    [ERROR_CODES.PASSWORD_TOO_WEAK]: 'Password does not meet requirements',
    [ERROR_CODES.OTP_EXPIRED]: 'OTP has expired',
    [ERROR_CODES.OTP_INVALID]: 'Invalid OTP',
})

export { ERROR_CODES, ERROR_MESSAGES }

export default {
    ERROR_CODES,
    ERROR_MESSAGES,
}
