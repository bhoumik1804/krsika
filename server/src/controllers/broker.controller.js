import {
    createBrokerEntry,
    getBrokerById,
    getBrokerList,
    getBrokerSummary,
    updateBrokerEntry,
    deleteBrokerEntry,
    bulkDeleteBrokerEntries,
} from '../services/broker.service.js'

/**
 * Broker Controller
 * HTTP request handlers for broker endpoints
 */

/**
 * Create a new broker
 * POST /api/mills/:millId/brokers
 */
export const createBroker = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const broker = await createBrokerEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: broker,
            message: 'Broker created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker by ID
 * GET /api/mills/:millId/brokers/:id
 */
export const getBrokerByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const broker = await getBrokerById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: broker,
            message: 'Broker retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker list with pagination
 * GET /api/mills/:millId/brokers
 */
export const getBrokerListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getBrokerList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Broker list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker summary statistics
 * GET /api/mills/:millId/brokers/summary
 */
export const getBrokerSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getBrokerSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Broker summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a broker
 * PUT /api/mills/:millId/brokers/:id
 */
export const updateBrokerHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const broker = await updateBrokerEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: broker,
            message: 'Broker updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a broker
 * DELETE /api/mills/:millId/brokers/:id
 */
export const deleteBrokerHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteBrokerEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Broker deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete brokers
 * DELETE /api/mills/:millId/brokers/bulk
 */
export const bulkDeleteBrokerHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteBrokerEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} brokers deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
