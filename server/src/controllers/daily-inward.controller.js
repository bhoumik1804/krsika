import {
    createDailyInwardEntry,
    getDailyInwardById,
    getDailyInwardList,
    getDailyInwardSummary,
    updateDailyInwardEntry,
    deleteDailyInwardEntry,
    bulkDeleteDailyInwardEntries,
} from '../services/daily-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyInward = async (req, res, next) => {
    try {
        const dailyInward = await createDailyInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { dailyInward }, 'Daily inward entry created')
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyInwardByIdHandler = async (req, res, next) => {
    try {
        const dailyInward = await getDailyInwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyInward },
                'Daily inward entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyInwardListHandler = async (req, res, next) => {
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
        const result = await getDailyInwardList(req.params.millId, {
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
                { dailyInwards: result.data, pagination: result.pagination },
                'Daily inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyInwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Daily inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyInwardHandler = async (req, res, next) => {
    try {
        const dailyInward = await updateDailyInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { dailyInward }, 'Daily inward entry updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyInwardHandler = async (req, res, next) => {
    try {
        await deleteDailyInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily inward entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyInwardEntries(
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
