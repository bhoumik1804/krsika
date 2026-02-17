import {
    createPrivateRiceOutwardEntry,
    getPrivateRiceOutwardById,
    getPrivateRiceOutwardList,
    getPrivateRiceOutwardSummary,
    updatePrivateRiceOutwardEntry,
    deletePrivateRiceOutwardEntry,
    bulkDeletePrivateRiceOutwardEntries,
} from '../services/private-rice-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPrivateRiceOutward = async (req, res, next) => {
    try {
        const entry = await createPrivateRiceOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Private rice outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateRiceOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getPrivateRiceOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private rice outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateRiceOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            riceType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getPrivateRiceOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            riceType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Private rice outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivateRiceOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getPrivateRiceOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Private rice outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updatePrivateRiceOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private rice outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        await deletePrivateRiceOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Private rice outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePrivateRiceOutwardEntries(
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
