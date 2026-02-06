import {
    createPartyTransactionEntry,
    getPartyTransactionById,
    getPartyTransactionList,
    getPartyTransactionSummary,
    updatePartyTransactionEntry,
    deletePartyTransactionEntry,
    bulkDeletePartyTransactionEntries,
} from '../services/party-transaction.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPartyTransaction = async (req, res, next) => {
    try {
        const transaction = await createPartyTransactionEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { transaction }, 'Party transaction created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPartyTransactionByIdHandler = async (req, res, next) => {
    try {
        const transaction = await getPartyTransactionById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { transaction }, 'Party transaction retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPartyTransactionListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getPartyTransactionList(req.params.millId, {
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
                'Party transaction list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPartyTransactionSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getPartyTransactionSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Party transaction summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePartyTransactionHandler = async (req, res, next) => {
    try {
        const transaction = await updatePartyTransactionEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { transaction }, 'Party transaction updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePartyTransactionHandler = async (req, res, next) => {
    try {
        await deletePartyTransactionEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Party transaction deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePartyTransactionHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePartyTransactionEntries(
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
