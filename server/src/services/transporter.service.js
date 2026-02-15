import mongoose from 'mongoose'
import { Transporter } from '../models/transporter.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createTransporterEntry = async (millId, data) => {
    const transporter = new Transporter({ ...data, millId })
    await transporter.save()
    logger.info('Transporter created', { id: transporter._id, millId })
    return transporter
}

export const getTransporterById = async (millId, id) => {
    const transporter = await Transporter.findOne({ _id: id, millId })

    if (!transporter) throw new ApiError(404, 'Transporter not found')
    return transporter
}

export const getTransporterList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'transporterName',
        sortOrder = 'asc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { transporterName: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = Transporter.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await Transporter.aggregatePaginate(aggregate, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        customLabels: {
            docs: 'data',
            totalDocs: 'total',
            totalPages: 'totalPages',
            page: 'page',
            limit: 'limit',
            hasPrevPage: 'hasPrevPage',
            hasNextPage: 'hasNextPage',
            prevPage: 'prevPage',
            nextPage: 'nextPage',
        },
    })

    return {
        data: result.data,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
        },
    }
}

export const getTransporterSummary = async (millId) => {
    const [summary] = await Transporter.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalTransporters: { $sum: 1 } } },
        { $project: { _id: 0, totalTransporters: 1 } },
    ])
    return summary || { totalTransporters: 0 }
}

export const updateTransporterEntry = async (millId, id, data) => {
    const transporter = await Transporter.findOneAndUpdate(
        { _id: id, millId },
        { ...data },
        { new: true, runValidators: true }
    )

    if (!transporter) throw new ApiError(404, 'Transporter not found')
    logger.info('Transporter updated', { id, millId })
    return transporter
}

export const deleteTransporterEntry = async (millId, id) => {
    const transporter = await Transporter.findOneAndDelete({ _id: id, millId })
    if (!transporter) throw new ApiError(404, 'Transporter not found')
    logger.info('Transporter deleted', { id, millId })
}

export const bulkDeleteTransporterEntries = async (millId, ids) => {
    const result = await Transporter.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Transporters bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
