import config from '../../config/index.js'

/**
 * Pagination utility
 * Handles pagination logic for database queries
 */

class Pagination {
    /**
     * Get pagination parameters from request
     * @param {Object} query - Request query object
     * @returns {Object} Pagination parameters
     */
    static getParams(query) {
        const page = parseInt(query.page, 10) || 1
        const limit = Math.min(
            parseInt(query.limit, 10) || config.pagination.defaultPageSize,
            config.pagination.maxPageSize
        )
        const skip = (page - 1) * limit

        return { page, limit, skip }
    }

    /**
     * Get pagination metadata
     * @param {Number} totalRecords - Total number of records
     * @param {Number} page - Current page
     * @param {Number} limit - Records per page
     * @returns {Object} Pagination metadata
     */
    static getMetadata(totalRecords, page, limit) {
        const totalPages = Math.ceil(totalRecords / limit) || 1
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return {
            page,
            limit,
            totalPages,
            totalRecords,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
        }
    }

    /**
     * Apply pagination to Mongoose query
     * @param {Object} query - Mongoose query object
     * @param {Number} page - Current page
     * @param {Number} limit - Records per page
     * @returns {Object} Modified query
     */
    static apply(query, page, limit) {
        const skip = (page - 1) * limit
        return query.skip(skip).limit(limit)
    }

    /**
     * Create paginated response
     * @param {Array} data - Data array
     * @param {Number} totalRecords - Total number of records
     * @param {Number} page - Current page
     * @param {Number} limit - Records per page
     * @returns {Object} Paginated response
     */
    static createResponse(data, totalRecords, page, limit) {
        const metadata = Pagination.getMetadata(totalRecords, page, limit)
        return {
            data,
            pagination: metadata,
        }
    }

    /**
     * Handle Mongoose aggregate pagination
     * Using mongoose-aggregate-paginate-v2
     * @param {Object} model - Mongoose model
     * @param {Array} pipeline - Aggregation pipeline
     * @param {Object} options - Pagination options
     * @returns {Promise<Object>} Paginated results
     */
    static async aggregatePaginate(model, pipeline, options = {}) {
        const { page = 1, limit = config.pagination.defaultPageSize } = options

        const aggregateOptions = {
            page,
            limit: Math.min(limit, config.pagination.maxPageSize),
            customLabels: {
                docs: 'data',
                totalDocs: 'totalRecords',
                limit: 'limit',
                page: 'page',
                totalPages: 'totalPages',
                hasNextPage: 'hasNextPage',
                hasPrevPage: 'hasPrevPage',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                pagingCounter: 'pagingCounter',
            },
        }

        // Create aggregate query
        const aggregate = model.aggregate(pipeline)

        // Apply pagination
        const result = await model.aggregatePaginate(
            aggregate,
            aggregateOptions
        )

        return {
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                totalRecords: result.totalRecords,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextPage: result.nextPage,
                prevPage: result.prevPage,
            },
        }
    }
}

// Export named functions for convenience
export const paginate = (data, options) => {
    const { page, limit, total } = options
    return Pagination.createResponse(data, total, page, limit)
}

export const aggregatePaginate = Pagination.aggregatePaginate.bind(Pagination)

export default Pagination
