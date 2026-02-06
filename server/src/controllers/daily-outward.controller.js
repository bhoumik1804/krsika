import {
    createDailyOutwardEntry,
    getDailyOutwardById,
    getDailyOutwardList,
    getDailyOutwardSummary,
    updateDailyOutwardEntry,
    deleteDailyOutwardEntry,
    bulkDeleteDailyOutwardEntries,
} from '../services/daily-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyOutward = async (req, res, next) => {
    try {
        const dailyOutward = await createDailyOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyOutward },
                'Daily outward entry created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyOutwardByIdHandler = async (req, res, next) => {
    try {
        const dailyOutward = await getDailyOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyOutward },
                'Daily outward entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getDailyOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyOutwards: result.data, pagination: result.pagination },
                'Daily outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Daily outward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyOutwardHandler = async (req, res, next) => {
    try {
        const dailyOutward = await updateDailyOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyOutward },
                'Daily outward entry updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyOutwardHandler = async (req, res, next) => {
    try {
        await deleteDailyOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily outward entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyOutwardEntries(
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
