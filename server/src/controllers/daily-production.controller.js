import {
    createDailyProductionEntry,
    getDailyProductionById,
    getDailyProductionList,
    getDailyProductionSummary,
    updateDailyProductionEntry,
    deleteDailyProductionEntry,
    bulkDeleteDailyProductionEntries,
} from '../services/daily-production.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyProduction = async (req, res, next) => {
    try {
        const dailyProduction = await createDailyProductionEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyProduction },
                'Daily production entry created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyProductionByIdHandler = async (req, res, next) => {
    try {
        const dailyProduction = await getDailyProductionById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyProduction },
                'Daily production entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyProductionListHandler = async (req, res, next) => {
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
        const result = await getDailyProductionList(req.params.millId, {
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
                {
                    dailyProductions: result.data,
                    pagination: result.pagination,
                },
                'Daily production list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyProductionSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyProductionSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Daily production summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyProductionHandler = async (req, res, next) => {
    try {
        const dailyProduction = await updateDailyProductionEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyProduction },
                'Daily production entry updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyProductionHandler = async (req, res, next) => {
    try {
        await deleteDailyProductionEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily production entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyProductionHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyProductionEntries(
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
