import {
    createLabourMillingEntry,
    getLabourMillingById,
    getLabourMillingList,
    getLabourMillingSummary,
    updateLabourMillingEntry,
    deleteLabourMillingEntry,
    bulkDeleteLabourMillingEntries,
} from '../services/labour-milling.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createLabourMilling = async (req, res, next) => {
    try {
        const entry = await createLabourMillingEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Labour milling created')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourMillingByIdHandler = async (req, res, next) => {
    try {
        const entry = await getLabourMillingById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour milling retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourMillingListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getLabourMillingList(req.params.millId, {
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
                'Labour milling list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourMillingSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getLabourMillingSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Labour milling summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateLabourMillingHandler = async (req, res, next) => {
    try {
        const entry = await updateLabourMillingEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour milling updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteLabourMillingHandler = async (req, res, next) => {
    try {
        await deleteLabourMillingEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Labour milling deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteLabourMillingHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteLabourMillingEntries(
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
