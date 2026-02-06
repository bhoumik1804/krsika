import {
    createDailyReceiptEntry,
    getDailyReceiptById,
    getDailyReceiptList,
    getDailyReceiptSummary,
    updateDailyReceiptEntry,
    deleteDailyReceiptEntry,
    bulkDeleteDailyReceiptEntries,
} from '../services/daily-receipt.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyReceipt = async (req, res, next) => {
    try {
        const dailyReceipt = await createDailyReceiptEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyReceipt },
                'Daily receipt entry created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyReceiptByIdHandler = async (req, res, next) => {
    try {
        const dailyReceipt = await getDailyReceiptById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyReceipt },
                'Daily receipt entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyReceiptListHandler = async (req, res, next) => {
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
        const result = await getDailyReceiptList(req.params.millId, {
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
                { dailyReceipts: result.data, pagination: result.pagination },
                'Daily receipt list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyReceiptSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyReceiptSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Daily receipt summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyReceiptHandler = async (req, res, next) => {
    try {
        const dailyReceipt = await updateDailyReceiptEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyReceipt },
                'Daily receipt entry updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyReceiptHandler = async (req, res, next) => {
    try {
        await deleteDailyReceiptEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily receipt entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyReceiptHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyReceiptEntries(
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
