import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    const code = err.code || 'INTERNAL_ERROR'

    // Log error
    logger.error('Error occurred:', {
        message,
        code,
        statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method,
    })

    // Send response
    res.status(statusCode).json({
        success: false,
        error: message,
        code,
        ...(err.details && { details: err.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}

export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`)
    error.statusCode = 404
    error.code = 'NOT_FOUND'
    next(error)
}
