import {
    createDailySalesDealEntry,
    getDailySalesDealById,
    getDailySalesDealList,
    getDailySalesDealSummary,
    updateDailySalesDealEntry,
    deleteDailySalesDealEntry,
    bulkDeleteDailySalesDealEntries,
} from '../services/daily-sales-deal.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailySalesDeal = async (req, res, next) => {
    try {
        const dailySalesDeal = await createDailySalesDealEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { dailySalesDeal }, 'Daily sales deal created')
        )
    } catch (error) {
        next(error)
    }
}

export const getDailySalesDealByIdHandler = async (req, res, next) => {
    try {
        const dailySalesDeal = await getDailySalesDealById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailySalesDeal },
                'Daily sales deal retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailySalesDealListHandler = async (req, res, next) => {
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
        const result = await getDailySalesDealList(req.params.millId, {
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
                { dailySalesDeals: result.data, pagination: result.pagination },
                'Daily sales deal list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailySalesDealSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailySalesDealSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Daily sales deal summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailySalesDealHandler = async (req, res, next) => {
    try {
        const dailySalesDeal = await updateDailySalesDealEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { dailySalesDeal }, 'Daily sales deal updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailySalesDealHandler = async (req, res, next) => {
    try {
        await deleteDailySalesDealEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily sales deal deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailySalesDealHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailySalesDealEntries(
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
