import {
    createBrokerTransactionEntry,
    getBrokerTransactionById,
    getBrokerTransactionList,
    getBrokerTransactionSummary,
    updateBrokerTransactionEntry,
    deleteBrokerTransactionEntry,
    bulkDeleteBrokerTransactionEntries,
} from '../services/broker-transaction.service.js'

/**
 * Broker Transaction Controller
 * HTTP request handlers for broker transaction endpoints
 */

/**
 * Create a new broker transaction entry
 * POST /api/mills/:millId/broker-transactions
 */
export const createBrokerTransaction = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const brokerTransaction = await createBrokerTransactionEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: brokerTransaction,
            message: 'Broker transaction entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker transaction entry by ID
 * GET /api/mills/:millId/broker-transactions/:id
 */
export const getBrokerTransactionByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const brokerTransaction = await getBrokerTransactionById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: brokerTransaction,
            message: 'Broker transaction entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker transaction list with pagination
 * GET /api/mills/:millId/broker-transactions
 */
export const getBrokerTransactionListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            transactionType,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getBrokerTransactionList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            transactionType,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Broker transaction list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get broker transaction summary statistics
 * GET /api/mills/:millId/broker-transactions/summary
 */
export const getBrokerTransactionSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate, brokerName } = req.query

        const summary = await getBrokerTransactionSummary(millId, {
            startDate,
            endDate,
            brokerName,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Broker transaction summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a broker transaction entry
 * PUT /api/mills/:millId/broker-transactions/:id
 */
export const updateBrokerTransactionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const brokerTransaction = await updateBrokerTransactionEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: brokerTransaction,
            message: 'Broker transaction entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a broker transaction entry
 * DELETE /api/mills/:millId/broker-transactions/:id
 */
export const deleteBrokerTransactionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteBrokerTransactionEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Broker transaction entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete broker transaction entries
 * DELETE /api/mills/:millId/broker-transactions/bulk
 */
export const bulkDeleteBrokerTransactionHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteBrokerTransactionEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} broker transaction entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
