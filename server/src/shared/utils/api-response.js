/**
 * Standard API response utility
 * Provides consistent response structure across all endpoints
 */

class ApiResponse {
    /**
     * Send success response
     * @param {Object} res - Express response object
     * @param {*} data - Response data
     * @param {String} message - Success message
     * @param {Number} statusCode - HTTP status code
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        })
    }

    /**
     * Send error response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {Array} errors - Validation errors (optional)
     */
    static error(res, message = 'Error', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
        }

        if (errors) {
            response.errors = errors
        }

        return res.status(statusCode).json(response)
    }

    /**
     * Send paginated response
     * @param {Object} res - Express response object
     * @param {Array} data - Response data
     * @param {Object} pagination - Pagination metadata
     * @param {String} message - Success message
     */
    static paginated(
        res,
        data,
        pagination,
        message = 'Data retrieved successfully',
        statusCode = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages,
                totalRecords: pagination.totalRecords,
                hasNextPage: pagination.hasNextPage,
                hasPrevPage: pagination.hasPrevPage,
            },
            timestamp: new Date().toISOString(),
        })
    }

    /**
     * Send created response (201)
     * @param {Object} res - Express response object
     * @param {*} data - Created resource data
     * @param {String} message - Success message
     */
    static created(res, data, message = 'Resource created successfully') {
        return ApiResponse.success(res, data, message, 201)
    }

    /**
     * Send no content response (204)
     * @param {Object} res - Express response object
     */
    static noContent(res) {
        return res.status(204).send()
    }

    /**
     * Send unauthorized response (401)
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return ApiResponse.error(res, message, 401)
    }

    /**
     * Send forbidden response (403)
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static forbidden(res, message = 'Access forbidden') {
        return ApiResponse.error(res, message, 403)
    }

    /**
     * Send not found response (404)
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static notFound(res, message = 'Resource not found') {
        return ApiResponse.error(res, message, 404)
    }

    /**
     * Send bad request response (400)
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Array} errors - Validation errors (optional)
     */
    static badRequest(res, message = 'Bad request', errors = null) {
        return ApiResponse.error(res, message, 400, errors)
    }

    /**
     * Send validation error response (422)
     * @param {Object} res - Express response object
     * @param {Array} errors - Validation errors
     * @param {String} message - Error message
     */
    static validationError(res, errors, message = 'Validation failed') {
        return ApiResponse.error(res, message, 422, errors)
    }

    /**
     * Send internal server error response (500)
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static serverError(res, message = 'Internal server error') {
        return ApiResponse.error(res, message, 500)
    }
}

export default ApiResponse
