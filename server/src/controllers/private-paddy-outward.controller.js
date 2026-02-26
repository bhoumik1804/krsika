import {
    createPrivatePaddyOutwardEntry,
    getPrivatePaddyOutwardById,
    getPrivatePaddyOutwardList,
    getPrivatePaddyOutwardSummary,
    updatePrivatePaddyOutwardEntry,
    deletePrivatePaddyOutwardEntry,
    bulkDeletePrivatePaddyOutwardEntries,
} from '../services/private-paddy-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPrivatePaddyOutward = async (req, res, next) => {
    try {
        const entry = await createPrivatePaddyOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Private paddy outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getPrivatePaddyOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private paddy outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            paddyType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getPrivatePaddyOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            paddyType,
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
                'Private paddy outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPrivatePaddyOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getPrivatePaddyOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Private paddy outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePrivatePaddyOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updatePrivatePaddyOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Private paddy outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePrivatePaddyOutwardHandler = async (req, res, next) => {
    try {
        await deletePrivatePaddyOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Private paddy outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePrivatePaddyOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePrivatePaddyOutwardEntries(
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
