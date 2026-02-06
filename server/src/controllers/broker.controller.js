import {
    createBrokerEntry,
    getBrokerById,
    getBrokerList,
    getBrokerSummary,
    updateBrokerEntry,
    deleteBrokerEntry,
    bulkDeleteBrokerEntries,
} from '../services/broker.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createBroker = async (req, res, next) => {
    try {
        const broker = await createBrokerEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { broker }, 'Broker created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerByIdHandler = async (req, res, next) => {
    try {
        const broker = await getBrokerById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { broker }, 'Broker retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getBrokerList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { brokers: result.data, pagination: result.pagination },
                'Broker list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getBrokerSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Broker summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateBrokerHandler = async (req, res, next) => {
    try {
        const broker = await updateBrokerEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { broker }, 'Broker updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteBrokerHandler = async (req, res, next) => {
    try {
        await deleteBrokerEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Broker deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteBrokerHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteBrokerEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} brokers deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
