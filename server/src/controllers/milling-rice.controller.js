import {
    createMillingRiceEntry,
    getMillingRiceById,
    getMillingRiceList,
    getMillingRiceSummary,
    updateMillingRiceEntry,
    deleteMillingRiceEntry,
    bulkDeleteMillingRiceEntries,
} from '../services/milling-rice.service.js'

/**
 * Milling Rice Controller
 * HTTP request handlers for milling rice endpoints
 */

/**
 * Create a new milling rice entry
 * POST /api/mills/:millId/milling-rice
 */
export const createMillingRice = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const millingRice = await createMillingRiceEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: millingRice,
            message: 'Milling rice entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling rice entry by ID
 * GET /api/mills/:millId/milling-rice/:id
 */
export const getMillingRiceByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const millingRice = await getMillingRiceById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: millingRice,
            message: 'Milling rice entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling rice list with pagination
 * GET /api/mills/:millId/milling-rice
 */
export const getMillingRiceListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getMillingRiceList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Milling rice list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling rice summary statistics
 * GET /api/mills/:millId/milling-rice/summary
 */
export const getMillingRiceSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getMillingRiceSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Milling rice summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a milling rice entry
 * PUT /api/mills/:millId/milling-rice/:id
 */
export const updateMillingRiceHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const millingRice = await updateMillingRiceEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: millingRice,
            message: 'Milling rice entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a milling rice entry
 * DELETE /api/mills/:millId/milling-rice/:id
 */
export const deleteMillingRiceHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteMillingRiceEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Milling rice entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete milling rice entries
 * DELETE /api/mills/:millId/milling-rice/bulk
 */
export const bulkDeleteMillingRiceHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteMillingRiceEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} milling rice entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
