import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    let error = err

    // If it's not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || 'Internal Server Error'
        error = new ApiError(statusCode, message, 'INTERNAL_ERROR')
    }

    // Log error
    logger.error('Error occurred:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
        path: req.path,
        method: req.method,
    })

    // Send response
    res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    })
}

export const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`))
}
