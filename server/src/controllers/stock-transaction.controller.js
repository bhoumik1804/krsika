import {
    getStockTransactionById,
    getStockTransactionList,
    getStockBalance,
    getStockTransactionSummary,
    getStockByAction,
    deleteTransactionsByRef,
} from '../services/stock-transaction.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const getStockTransactionByIdHandler = async (req, res, next) => {
    try {
        const transaction = await getStockTransactionById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { transaction }, 'Stock transaction retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getStockTransactionListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            commodity,
            variety,
            type,
            action,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getStockTransactionList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            commodity,
            variety,
            type,
            action,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json(
            new ApiResponse(
                200,
                { transactions: result.data, pagination: result.pagination },
                'Stock transaction list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStockBalanceHandler = async (req, res, next) => {
    try {
        const { commodity, variety, asOfDate } = req.query
        const balances = await getStockBalance(req.params.millId, {
            commodity,
            variety,
            asOfDate,
        })

        res.status(200).json(
            new ApiResponse(200, { balances }, 'Stock balance retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getStockTransactionSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate, commodity, variety } = req.query
        const summary = await getStockTransactionSummary(req.params.millId, {
            startDate,
            endDate,
            commodity,
            variety,
        })

        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Stock transaction summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStockByActionHandler = async (req, res, next) => {
    try {
        const { action, startDate, endDate } = req.query
        const result = await getStockByAction(req.params.millId, {
            action,
            startDate,
            endDate,
        })

        res.status(200).json(
            new ApiResponse(
                200,
                { stocks: result },
                'Stock by action retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}
