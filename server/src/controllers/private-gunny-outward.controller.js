import {
    createPrivateGunnyOutwardEntry,
    getPrivateGunnyOutwardById,
    getPrivateGunnyOutwardList,
    getPrivateGunnyOutwardSummary,
    updatePrivateGunnyOutwardEntry,
    deletePrivateGunnyOutwardEntry,
    bulkDeletePrivateGunnyOutwardEntries,
} from '../services/private-gunny-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPrivateGunnyOutward = async (req, res, next) => {
    try {
        const entry = await createPrivateGunnyOutwardEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Private gunny outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateGunnyOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getPrivateGunnyOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private gunny outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateGunnyOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            partyName,
            gunnySaleDealNumber,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getPrivateGunnyOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            gunnySaleDealNumber,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Private gunny outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateGunnyOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getPrivateGunnyOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Private gunny outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePrivateGunnyOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updatePrivateGunnyOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private gunny outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePrivateGunnyOutwardHandler = async (req, res, next) => {
    try {
        await deletePrivateGunnyOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Private gunny outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePrivateGunnyOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePrivateGunnyOutwardEntries(
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
