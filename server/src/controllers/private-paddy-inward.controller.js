import {
    createPrivatePaddyInwardEntry,
    getPrivatePaddyInwardById,
    getPrivatePaddyInwardList,
    getPrivatePaddyInwardSummary,
    updatePrivatePaddyInwardEntry,
    deletePrivatePaddyInwardEntry,
    bulkDeletePrivatePaddyInwardEntries,
} from '../services/private-paddy-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPrivatePaddyInward = async (req, res, next) => {
    try {
        const entry = await createPrivatePaddyInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Private paddy inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getPrivatePaddyInwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private paddy inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getPrivatePaddyInwardList(req.params.millId, {
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
                'Private paddy inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyInwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getPrivatePaddyInwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Private paddy inward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        const entry = await updatePrivatePaddyInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private paddy inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        await deletePrivatePaddyInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Private paddy inward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePrivatePaddyInwardEntries(
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
