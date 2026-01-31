import {
    createRiceSaleEntry,
    getRiceSaleById,
    getRiceSaleList,
    getRiceSaleSummary,
    updateRiceSaleEntry,
    deleteRiceSaleEntry,
    bulkDeleteRiceSaleEntries,
} from '../services/rice-sale.service.js'

/**
 * Rice Sale Controller
 * HTTP request handlers for rice sale endpoints
 */

/**
 * Create a new rice sale entry
 * POST /api/mills/:millId/rice-sales
 */
export const createRiceSale = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const riceSale = await createRiceSaleEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: riceSale,
            message: 'Rice sale entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice sale entry by ID
 * GET /api/mills/:millId/rice-sales/:id
 */
export const getRiceSaleByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const riceSale = await getRiceSaleById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: riceSale,
            message: 'Rice sale entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice sale list with pagination
 * GET /api/mills/:millId/rice-sales
 */
export const getRiceSaleListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            partyName,
            brokerName,
            deliveryType,
            lotOrOther,
            fciOrNAN,
            riceType,
            gunnyType,
            frkType,
            lotNumber,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getRiceSaleList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            brokerName,
            deliveryType,
            lotOrOther,
            fciOrNAN,
            riceType,
            gunnyType,
            frkType,
            lotNumber,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Rice sale list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice sale summary statistics
 * GET /api/mills/:millId/rice-sales/summary
 */
export const getRiceSaleSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getRiceSaleSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Rice sale summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a rice sale entry
 * PUT /api/mills/:millId/rice-sales/:id
 */
export const updateRiceSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const riceSale = await updateRiceSaleEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: riceSale,
            message: 'Rice sale entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a rice sale entry
 * DELETE /api/mills/:millId/rice-sales/:id
 */
export const deleteRiceSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteRiceSaleEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Rice sale entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete rice sale entries
 * DELETE /api/mills/:millId/rice-sales/bulk
 */
export const bulkDeleteRiceSaleHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteRiceSaleEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} rice sale entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
