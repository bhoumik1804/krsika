import {
    createGovtPaddyInwardEntry,
    getGovtPaddyInwardById,
    getGovtPaddyInwardList,
    getGovtPaddyInwardSummary,
    updateGovtPaddyInwardEntry,
    deleteGovtPaddyInwardEntry,
    bulkDeleteGovtPaddyInwardEntries,
} from '../services/govt-paddy-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGovtPaddyInward = async (req, res, next) => {
    try {
        const entry = await createGovtPaddyInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Govt paddy inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtPaddyInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getGovtPaddyInwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt paddy inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtPaddyInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getGovtPaddyInwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { data: result.data, pagination: result.pagination },
                'Govt paddy inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtPaddyInwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getGovtPaddyInwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Govt paddy inward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateGovtPaddyInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt paddy inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        await deleteGovtPaddyInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Govt paddy inward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGovtPaddyInwardEntries(
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
