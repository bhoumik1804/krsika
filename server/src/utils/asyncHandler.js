/**
 * AsyncHandler Middleware
 * Wraps async route handlers to catch errors and pass them to Express error handlers
 * Eliminates the need for try-catch blocks in every handler
 */

export const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
}
