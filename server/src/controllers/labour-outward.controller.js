import {
    createLabourOutwardEntry,
    getLabourOutwardById,
    getLabourOutwardList,
    getLabourOutwardSummary,
    updateLabourOutwardEntry,
    deleteLabourOutwardEntry,
    bulkDeleteLabourOutwardEntries,
} from '../services/labour-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createLabourOutward = async (req, res, next) => {
    try {
        const entry = await createLabourOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Labour outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getLabourOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOutwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getLabourOutwardList(req.params.millId, {
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
                'Labour outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOutwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getLabourOutwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Labour outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateLabourOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateLabourOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteLabourOutwardHandler = async (req, res, next) => {
    try {
        await deleteLabourOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Labour outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteLabourOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteLabourOutwardEntries(
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
