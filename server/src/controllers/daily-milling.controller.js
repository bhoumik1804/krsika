import {
    createDailyMillingEntry,
    getDailyMillingById,
    getDailyMillingList,
    getDailyMillingSummary,
    updateDailyMillingEntry,
    deleteDailyMillingEntry,
    bulkDeleteDailyMillingEntries,
} from '../services/daily-milling.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyMilling = async (req, res, next) => {
    try {
        const dailyMilling = await createDailyMillingEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyMilling },
                'Daily milling entry created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyMillingByIdHandler = async (req, res, next) => {
    try {
        const dailyMilling = await getDailyMillingById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyMilling },
                'Daily milling entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyMillingListHandler = async (req, res, next) => {
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
        const result = await getDailyMillingList(req.params.millId, {
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
                { dailyMillings: result.data, pagination: result.pagination },
                'Daily milling list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyMillingSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyMillingSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Daily milling summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyMillingHandler = async (req, res, next) => {
    try {
        const dailyMilling = await updateDailyMillingEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyMilling },
                'Daily milling entry updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyMillingHandler = async (req, res, next) => {
    try {
        await deleteDailyMillingEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily milling entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyMillingHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyMillingEntries(
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
