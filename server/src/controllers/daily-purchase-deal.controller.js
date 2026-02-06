import {
    createDailyPurchaseDealEntry,
    getDailyPurchaseDealById,
    getDailyPurchaseDealList,
    getDailyPurchaseDealSummary,
    updateDailyPurchaseDealEntry,
    deleteDailyPurchaseDealEntry,
    bulkDeleteDailyPurchaseDealEntries,
} from '../services/daily-purchase-deal.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyPurchaseDeal = async (req, res, next) => {
    try {
        const dailyPurchaseDeal = await createDailyPurchaseDealEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyPurchaseDeal },
                'Daily purchase deal created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPurchaseDealByIdHandler = async (req, res, next) => {
    try {
        const dailyPurchaseDeal = await getDailyPurchaseDealById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyPurchaseDeal },
                'Daily purchase deal retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPurchaseDealListHandler = async (req, res, next) => {
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
        const result = await getDailyPurchaseDealList(req.params.millId, {
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
                    dailyPurchaseDeals: result.data,
                    pagination: result.pagination,
                },
                'Daily purchase deal list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPurchaseDealSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyPurchaseDealSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Daily purchase deal summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        const dailyPurchaseDeal = await updateDailyPurchaseDealEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyPurchaseDeal },
                'Daily purchase deal updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        await deleteDailyPurchaseDealEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily purchase deal deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyPurchaseDealEntries(
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
