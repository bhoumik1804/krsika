import {
    createMillEntry,
    getMillById,
    getMillsList,
    getMillsSummary,
    updateMillEntry,
    verifyMillEntry,
    suspendMillEntry,
    reactivateMillEntry,
    deleteMillEntry,
    bulkDeleteMillEntries,
} from '../services/mills.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Mills Controller (Super Admin)
 */

export const createMill = async (req, res, next) => {
    try {
        const mill = await createMillEntry(req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { mill }, 'Mill created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillByIdHandler = async (req, res, next) => {
    try {
        const mill = await getMillById(req.params.id)
        res.status(200).json(
            new ApiResponse(200, { mill }, 'Mill retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillsListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, status, sortBy, sortOrder } = req.query
        const result = await getMillsList({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { mills: result.data, pagination: result.pagination },
                'Mills list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getMillsSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getMillsSummary()
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Mills summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateMillHandler = async (req, res, next) => {
    try {
        const mill = await updateMillEntry(
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { mill }, 'Mill updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const verifyMillHandler = async (req, res, next) => {
    try {
        const { status, rejectionReason } = req.body
        const mill = await verifyMillEntry(
            req.params.id,
            status,
            rejectionReason,
            req.user._id
        )
        const message =
            status === 'ACTIVE' ? 'Mill approved successfully' : 'Mill rejected'
        res.status(200).json(new ApiResponse(200, { mill }, message))
    } catch (error) {
        next(error)
    }
}

export const suspendMillHandler = async (req, res, next) => {
    try {
        const mill = await suspendMillEntry(req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, { mill }, 'Mill suspended successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const reactivateMillHandler = async (req, res, next) => {
    try {
        const mill = await reactivateMillEntry(req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, { mill }, 'Mill reactivated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteMillHandler = async (req, res, next) => {
    try {
        await deleteMillEntry(req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Mill deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteMillsHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteMillEntries(req.body.ids)
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} mills deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
