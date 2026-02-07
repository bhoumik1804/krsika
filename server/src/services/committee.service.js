import mongoose from 'mongoose'
import { Committee } from '../models/committee.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createCommitteeEntry = async (millId, data, userId) => {
    const committee = new Committee({ ...data, millId })
    await committee.save()
    logger.info('Committee created', { id: committee._id, millId, userId })
    return committee
}

export const bulkCreateCommitteeEntries = async (
    millId,
    committees,
    userId
) => {
    const committeeData = committees.map((c) => ({
        ...c,
        millId,
    }))
    const result = await Committee.insertMany(committeeData)
    logger.info('Committees bulk created', {
        millId,
        count: result.length,
        userId,
    })
    return result
}

export const getCommitteeById = async (millId, id) => {
    const committee = await Committee.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!committee) throw new ApiError(404, 'Committee not found')
    return committee
}

export const getCommitteeList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'committeeName',
        sortOrder = 'asc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { committeeName: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = Committee.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
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

    const result = await Committee.aggregatePaginate(aggregate, {
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

export const getCommitteeSummary = async (millId) => {
    const [summary] = await Committee.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalCommittees: { $sum: 1 } } },
        { $project: { _id: 0, totalCommittees: 1 } },
    ])
    return summary || { totalCommittees: 0 }
}

export const updateCommitteeEntry = async (millId, id, data, userId) => {
    const committee = await Committee.findOneAndUpdate(
        { _id: id, millId },
        { ...data },
        { new: true, runValidators: true }
    )

    if (!committee) throw new ApiError(404, 'Committee not found')
    logger.info('Committee updated', { id, millId, userId })
    return committee
}

export const deleteCommitteeEntry = async (millId, id) => {
    const committee = await Committee.findOneAndDelete({ _id: id, millId })
    if (!committee) throw new ApiError(404, 'Committee not found')
    logger.info('Committee deleted', { id, millId })
}

export const bulkDeleteCommitteeEntries = async (millId, ids) => {
    const result = await Committee.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Committees bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
