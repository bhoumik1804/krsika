import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Global error handler middleware
 * Handles both ApiError instances and generic errors
 */
export const errorHandler = (err, req, res, next) => {
    // Determine if this is an ApiError or a generic error
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'
    let errors = err.errors || []

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = 'Validation failed'
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }))
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        statusCode = 409
        const field = Object.keys(err.keyValue)[0]
        message = `${field} already exists`
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token'
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token expired'
    }

    // Log error
    logger.error('Error occurred:', {
        message,
        statusCode,
        errors,
        stack: err.stack,
        path: req.path,
        method: req.method,
    })

    // Send standardized error response using same format as ApiResponse
    res.status(statusCode).json({
        success: false,
        statusCode,
        data: null,
        message,
        ...(errors.length > 0 && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`))
}
