import {
    createFinancialReceiptEntry,
    getFinancialReceiptById,
    getFinancialReceiptList,
    getFinancialReceiptSummary,
    updateFinancialReceiptEntry,
    deleteFinancialReceiptEntry,
    bulkDeleteFinancialReceiptEntries,
} from '../services/financial-receipt.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFinancialReceipt = async (req, res, next) => {
    try {
        const receipt = await createFinancialReceiptEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { receipt }, 'Financial receipt created')
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialReceiptByIdHandler = async (req, res, next) => {
    try {
        const receipt = await getFinancialReceiptById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { receipt }, 'Financial receipt retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialReceiptListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getFinancialReceiptList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { receipts: result.data, pagination: result.pagination },
                'Financial receipt list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFinancialReceiptSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getFinancialReceiptSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Financial receipt summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateFinancialReceiptHandler = async (req, res, next) => {
    try {
        const receipt = await updateFinancialReceiptEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { receipt }, 'Financial receipt updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteFinancialReceiptHandler = async (req, res, next) => {
    try {
        await deleteFinancialReceiptEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Financial receipt deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFinancialReceiptHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFinancialReceiptEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} receipts deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
