import {
    createMillingPaddyEntry,
    getMillingPaddyById,
    getMillingPaddyList,
    getMillingPaddySummary,
    updateMillingPaddyEntry,
    deleteMillingPaddyEntry,
    bulkDeleteMillingPaddyEntries,
} from '../services/milling-paddy.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createMillingPaddy = async (req, res, next) => {
    try {
        const entry = await createMillingPaddyEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Milling paddy created')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingPaddyByIdHandler = async (req, res, next) => {
    try {
        const entry = await getMillingPaddyById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Milling paddy retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingPaddyListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getMillingPaddyList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Milling paddy list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingPaddySummaryHandler = async (req, res, next) => {
    try {
        const summary = await getMillingPaddySummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Milling paddy summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateMillingPaddyHandler = async (req, res, next) => {
    try {
        const entry = await updateMillingPaddyEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Milling paddy updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteMillingPaddyHandler = async (req, res, next) => {
    try {
        await deleteMillingPaddyEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Milling paddy deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteMillingPaddyHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteMillingPaddyEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} entries deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
