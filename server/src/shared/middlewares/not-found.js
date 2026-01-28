import ApiResponse from '../utils/api-response.js'

/**
 * Not found middleware
 * Handles 404 errors for undefined routes
 */
export const notFound = (req, res, next) => {
    return ApiResponse.notFound(res, `Route ${req.originalUrl} not found`)
}

export default notFound
