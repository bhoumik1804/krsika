import {
    createDailyPaymentEntry,
    getDailyPaymentById,
    getDailyPaymentList,
    getDailyPaymentSummary,
    updateDailyPaymentEntry,
    deleteDailyPaymentEntry,
    bulkDeleteDailyPaymentEntries,
} from '../services/daily-payment.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDailyPayment = async (req, res, next) => {
    try {
        const dailyPayment = await createDailyPaymentEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { dailyPayment },
                'Daily payment entry created'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPaymentByIdHandler = async (req, res, next) => {
    try {
        const dailyPayment = await getDailyPaymentById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyPayment },
                'Daily payment entry retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPaymentListHandler = async (req, res, next) => {
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
        const result = await getDailyPaymentList(req.params.millId, {
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
                { dailyPayments: result.data, pagination: result.pagination },
                'Daily payment list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDailyPaymentSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getDailyPaymentSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Daily payment summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDailyPaymentHandler = async (req, res, next) => {
    try {
        const dailyPayment = await updateDailyPaymentEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { dailyPayment },
                'Daily payment entry updated'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDailyPaymentHandler = async (req, res, next) => {
    try {
        await deleteDailyPaymentEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Daily payment entry deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDailyPaymentHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDailyPaymentEntries(
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
