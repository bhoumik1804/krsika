import {
    createPartyTransactionEntry,
    getPartyTransactionById,
    getPartyTransactionList,
    getPartyTransactionSummary,
    updatePartyTransactionEntry,
    deletePartyTransactionEntry,
    bulkDeletePartyTransactionEntries,
} from '../services/party-transaction.service.js'

/**
 * Party Transaction Controller
 * HTTP request handlers for party transaction endpoints
 */

/**
 * Create a new party transaction entry
 * POST /api/mills/:millId/party-transactions
 */
export const createPartyTransaction = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const partyTransaction = await createPartyTransactionEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: partyTransaction,
            message: 'Party transaction entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party transaction entry by ID
 * GET /api/mills/:millId/party-transactions/:id
 */
export const getPartyTransactionByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const partyTransaction = await getPartyTransactionById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: partyTransaction,
            message: 'Party transaction entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party transaction list with pagination
 * GET /api/mills/:millId/party-transactions
 */
export const getPartyTransactionListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            transactionType,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getPartyTransactionList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            transactionType,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Party transaction list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party transaction summary statistics
 * GET /api/mills/:millId/party-transactions/summary
 */
export const getPartyTransactionSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate, partyName } = req.query

        const summary = await getPartyTransactionSummary(millId, {
            startDate,
            endDate,
            partyName,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Party transaction summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a party transaction entry
 * PUT /api/mills/:millId/party-transactions/:id
 */
export const updatePartyTransactionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const partyTransaction = await updatePartyTransactionEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: partyTransaction,
            message: 'Party transaction entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a party transaction entry
 * DELETE /api/mills/:millId/party-transactions/:id
 */
export const deletePartyTransactionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deletePartyTransactionEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Party transaction entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete party transaction entries
 * DELETE /api/mills/:millId/party-transactions/bulk
 */
export const bulkDeletePartyTransactionHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeletePartyTransactionEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} party transaction entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
