import mongoose from 'mongoose'
import { Party } from '../models/party.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createPartyEntry = async (millId, data, userId) => {
    const party = new Party({
        ...data,
        millId,
        createdBy: userId,
    })

    await party.save()
    logger.info('Party created', { id: party._id, millId, userId })

    return party
}

export const getPartyById = async (millId, id) => {
    const party = await Party.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!party) {
        throw new ApiError(404, 'Party not found')
    }

    return party
}

export const getPartyList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'partyName',
        sortOrder = 'asc',
    } = options

    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = Party.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
        {
            $addFields: {
                id: { $toString: '$_id' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdByUser',
                pipeline: [{ $project: { fullName: 1, email: 1 } }],
            },
        },
        {
            $unwind: {
                path: '$createdByUser',
                preserveNullAndEmptyArrays: true,
            },
        },
    ])

    const result = await Party.aggregatePaginate(aggregate, {
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

export const getPartySummary = async (millId) => {
    const [summary] = await Party.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalParties: { $sum: 1 } } },
        { $project: { _id: 0, totalParties: 1 } },
    ])

    return summary || { totalParties: 0 }
}

export const updatePartyEntry = async (millId, id, data, userId) => {
    const party = await Party.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!party) {
        throw new ApiError(404, 'Party not found')
    }

    logger.info('Party updated', { id, millId, userId })
    return party
}

export const deletePartyEntry = async (millId, id) => {
    const party = await Party.findOneAndDelete({ _id: id, millId })

    if (!party) {
        throw new ApiError(404, 'Party not found')
    }

    logger.info('Party deleted', { id, millId })
}

export const bulkDeletePartyEntries = async (millId, ids) => {
    const result = await Party.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Parties bulk deleted', { millId, count: result.deletedCount })
    return result.deletedCount
}
