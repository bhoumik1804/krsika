import {
    createLabourInwardEntry,
    getLabourInwardById,
    getLabourInwardList,
    getLabourInwardSummary,
    updateLabourInwardEntry,
    deleteLabourInwardEntry,
    bulkDeleteLabourInwardEntries,
} from '../services/labour-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createLabourInward = async (req, res, next) => {
    try {
        const entry = await createLabourInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Labour inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getLabourInwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getLabourInwardList(req.params.millId, {
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
                'Labour inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourInwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getLabourInwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Labour inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateLabourInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateLabourInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteLabourInwardHandler = async (req, res, next) => {
    try {
        await deleteLabourInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Labour inward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteLabourInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteLabourInwardEntries(
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
