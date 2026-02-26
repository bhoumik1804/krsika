import {
    createGunnyInwardEntry,
    getGunnyInwardById,
    getGunnyInwardList,
    getGunnyInwardSummary,
    updateGunnyInwardEntry,
    deleteGunnyInwardEntry,
    bulkDeleteGunnyInwardEntries,
} from '../services/gunny-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGunnyInward = async (req, res, next) => {
    try {
        const entry = await createGunnyInwardEntry(req.params.millId, req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Gunny inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getGunnyInwardById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Gunny inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query
        const result = await getGunnyInwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Gunny inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getGunnyInwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Gunny inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateGunnyInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateGunnyInwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Gunny inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGunnyInwardHandler = async (req, res, next) => {
    try {
        await deleteGunnyInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Gunny inward deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGunnyInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGunnyInwardEntries(
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
