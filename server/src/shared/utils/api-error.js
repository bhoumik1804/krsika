/**
 * Custom API Error class
 * Extends Error with additional properties for API error handling
 */
class ApiError extends Error {
    /**
     * Create an API error
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {Array} errors - Validation errors (optional)
     * @param {String} code - Error code (optional)
     */
    constructor(message, statusCode = 500, errors = null, code = null) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.code = code
        this.isOperational = true // Operational errors vs programming errors
        this.timestamp = new Date().toISOString()

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor)
    }

    /**
     * Create a bad request error (400)
     */
    static badRequest(message = 'Bad request', errors = null) {
        return new ApiError(message, 400, errors, 'BAD_REQUEST')
    }

    /**
     * Create an unauthorized error (401)
     */
    static unauthorized(message = 'Unauthorized access') {
        return new ApiError(message, 401, null, 'UNAUTHORIZED')
    }

    /**
     * Create a forbidden error (403)
     */
    static forbidden(message = 'Access forbidden') {
        return new ApiError(message, 403, null, 'FORBIDDEN')
    }

    /**
     * Create a not found error (404)
     */
    static notFound(message = 'Resource not found') {
        return new ApiError(message, 404, null, 'NOT_FOUND')
    }

    /**
     * Create a validation error (422)
     */
    static validationError(errors, message = 'Validation failed') {
        return new ApiError(message, 422, errors, 'VALIDATION_ERROR')
    }

    /**
     * Create a conflict error (409)
     */
    static conflict(message = 'Resource already exists') {
        return new ApiError(message, 409, null, 'CONFLICT')
    }

    /**
     * Create an internal server error (500)
     */
    static internal(message = 'Internal server error') {
        return new ApiError(message, 500, null, 'INTERNAL_ERROR')
    }

    /**
     * Create a service unavailable error (503)
     */
    static serviceUnavailable(message = 'Service unavailable') {
        return new ApiError(message, 503, null, 'SERVICE_UNAVAILABLE')
    }

    /**
     * Create a too many requests error (429)
     */
    static tooManyRequests(message = 'Too many requests') {
        return new ApiError(message, 429, null, 'TOO_MANY_REQUESTS')
    }

    /**
     * Create a token expired error (401)
     */
    static tokenExpired(message = 'Token has expired') {
        return new ApiError(message, 401, null, 'TOKEN_EXPIRED')
    }

    /**
     * Create an invalid token error (401)
     */
    static invalidToken(message = 'Invalid token') {
        return new ApiError(message, 401, null, 'INVALID_TOKEN')
    }

    /**
     * Create a database error (500)
     */
    static databaseError(message = 'Database operation failed') {
        return new ApiError(message, 500, null, 'DATABASE_ERROR')
    }

    /**
     * Convert error to JSON
     */
    toJSON() {
        return {
            success: false,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            errors: this.errors,
            timestamp: this.timestamp,
            stack:
                process.env.NODE_ENV === 'development' ? this.stack : undefined,
        }
    }
}

export default ApiError
