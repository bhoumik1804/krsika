import config from '../../config/index.js'
import ApiError from '../utils/api-error.js'
import ApiResponse from '../utils/api-response.js'
import logger from '../utils/logger.js'

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
    let error = err

    // If error is not an instance of ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || 'Internal server error'
        error = new ApiError(message, statusCode)
    }

    // Log error
    logger.error('Error:', {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
    })

    // Prepare response
    const response = {
        success: false,
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
    }

    // Include errors if available (for validation errors)
    if (error.errors) {
        response.errors = error.errors
    }

    // Include stack trace in development
    if (config.server.isDevelopment) {
        response.stack = error.stack
    }

    // Send response
    return res.status(error.statusCode || 500).json(response)
}

/**
 * Handle Mongoose validation errors
 */
export const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
    }))

    return ApiError.validationError(errors, 'Validation failed')
}

/**
 * Handle Mongoose duplicate key errors
 */
export const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    const message = `${field} '${value}' already exists`

    return ApiError.conflict(message)
}

/**
 * Handle Mongoose cast errors
 */
export const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return ApiError.badRequest(message)
}

/**
 * Enhanced error handler with specific error type handling
 */
export const enhancedErrorHandler = (err, req, res, next) => {
    let error = err

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error = handleValidationError(err)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        error = handleDuplicateKeyError(err)
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error = handleCastError(err)
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = ApiError.unauthorized('Invalid token')
    }

    if (err.name === 'TokenExpiredError') {
        error = ApiError.unauthorized('Token expired')
    }

    // Pass to main error handler
    errorHandler(error, req, res, next)
}

export default enhancedErrorHandler
