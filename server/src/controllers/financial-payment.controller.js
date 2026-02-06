import {
    createFinancialPaymentEntry,
    getFinancialPaymentById,
    getFinancialPaymentList,
    getFinancialPaymentSummary,
    updateFinancialPaymentEntry,
    deleteFinancialPaymentEntry,
    bulkDeleteFinancialPaymentEntries,
} from '../services/financial-payment.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFinancialPayment = async (req, res, next) => {
    try {
        const payment = await createFinancialPaymentEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { payment }, 'Financial payment created')
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialPaymentByIdHandler = async (req, res, next) => {
    try {
        const payment = await getFinancialPaymentById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { payment }, 'Financial payment retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialPaymentListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getFinancialPaymentList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { payments: result.data, pagination: result.pagination },
                'Financial payment list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialPaymentSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getFinancialPaymentSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Financial payment summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateFinancialPaymentHandler = async (req, res, next) => {
    try {
        const payment = await updateFinancialPaymentEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { payment }, 'Financial payment updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteFinancialPaymentHandler = async (req, res, next) => {
    try {
        await deleteFinancialPaymentEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Financial payment deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFinancialPaymentHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFinancialPaymentEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} payments deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
