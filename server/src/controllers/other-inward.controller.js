import {
    createOtherInwardEntry,
    getOtherInwardById,
    getOtherInwardList,
    getOtherInwardSummary,
    updateOtherInwardEntry,
    deleteOtherInwardEntry,
    bulkDeleteOtherInwardEntries,
} from '../services/other-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createOtherInward = async (req, res, next) => {
    try {
        const entry = await createOtherInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Other inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getOtherInwardById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Other inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getOtherInwardList(req.params.millId, {
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
                'Other inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherInwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getOtherInwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Other inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateOtherInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateOtherInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Other inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteOtherInwardHandler = async (req, res, next) => {
    try {
        await deleteOtherInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Other inward deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteOtherInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteOtherInwardEntries(
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
