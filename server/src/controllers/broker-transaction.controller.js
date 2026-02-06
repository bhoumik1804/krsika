import {
    createBrokerTransactionEntry,
    getBrokerTransactionById,
    getBrokerTransactionList,
    getBrokerTransactionSummary,
    updateBrokerTransactionEntry,
    deleteBrokerTransactionEntry,
    bulkDeleteBrokerTransactionEntries,
} from '../services/broker-transaction.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createBrokerTransaction = async (req, res, next) => {
    try {
        const transaction = await createBrokerTransactionEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { transaction }, 'Broker transaction created')
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerTransactionByIdHandler = async (req, res, next) => {
    try {
        const transaction = await getBrokerTransactionById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { transaction },
                'Broker transaction retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerTransactionListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getBrokerTransactionList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { transactions: result.data, pagination: result.pagination },
                'Broker transaction list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerTransactionSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getBrokerTransactionSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Broker transaction summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateBrokerTransactionHandler = async (req, res, next) => {
    try {
        const transaction = await updateBrokerTransactionEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { transaction }, 'Broker transaction updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteBrokerTransactionHandler = async (req, res, next) => {
    try {
        await deleteBrokerTransactionEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Broker transaction deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteBrokerTransactionHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteBrokerTransactionEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} transactions deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
