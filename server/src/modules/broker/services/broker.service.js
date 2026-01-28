/**
 * Broker Service
 * ==============
 * Business logic for broker management
 */
import mongoose from 'mongoose'
import Broker from '../../../shared/models/broker.model.js'

const BrokerService = {
    /**
     * Find all brokers with filters and pagination
     */
    async findAll({
        millId,
        page = 1,
        limit = 10,
        search,
        isActive,
        sortBy = 'name',
        sortOrder = 'asc',
    }) {
        const query = { millId: new mongoose.Types.ObjectId(millId) }

        if (typeof isActive === 'boolean') {
            query.isActive = isActive
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        const aggregate = Broker.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'purchases',
                    let: { brokerId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$broker', '$$brokerId'] },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalPurchases: { $sum: 1 },
                                totalAmount: { $sum: '$totalAmount' },
                                totalCommission: { $sum: '$brokerCommission' },
                            },
                        },
                    ],
                    as: 'purchaseStats',
                },
            },
            {
                $lookup: {
                    from: 'sales',
                    let: { brokerId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$broker', '$$brokerId'] },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: 1 },
                                totalAmount: { $sum: '$totalAmount' },
                                totalCommission: { $sum: '$brokerCommission' },
                            },
                        },
                    ],
                    as: 'saleStats',
                },
            },
            {
                $addFields: {
                    purchaseStats: {
                        $ifNull: [
                            { $arrayElemAt: ['$purchaseStats', 0] },
                            {
                                totalPurchases: 0,
                                totalAmount: 0,
                                totalCommission: 0,
                            },
                        ],
                    },
                    saleStats: {
                        $ifNull: [
                            { $arrayElemAt: ['$saleStats', 0] },
                            {
                                totalSales: 0,
                                totalAmount: 0,
                                totalCommission: 0,
                            },
                        ],
                    },
                },
            },
            {
                $addFields: {
                    totalTransactions: {
                        $add: [
                            '$purchaseStats.totalPurchases',
                            '$saleStats.totalSales',
                        ],
                    },
                    totalCommissionEarned: {
                        $add: [
                            '$purchaseStats.totalCommission',
                            '$saleStats.totalCommission',
                        ],
                    },
                },
            },
            {
                $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
            },
        ])

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }

        return Broker.aggregatePaginate(aggregate, options)
    },

    /**
     * Find broker by ID
     */
    async findById(brokerId, millId) {
        return Broker.findOne({
            _id: brokerId,
            millId: millId,
        })
    },

    /**
     * Find broker by phone
     */
    async findByPhone(phone, millId) {
        return Broker.findOne({
            phone,
            millId: millId,
        })
    },

    /**
     * Create new broker
     */
    async create({
        millId,
        name,
        phone,
        email,
        address,
        commissionRate,
        openingBalance = 0,
    }) {
        // Check for duplicate phone in same mill
        if (phone) {
            const existing = await Broker.findOne({ phone, millId })
            if (existing) {
                throw new Error('Broker with this phone number already exists')
            }
        }

        const broker = new Broker({
            millId,
            name,
            phone,
            email,
            address,
            commissionRate: commissionRate || 0,
            openingBalance,
            currentBalance: openingBalance,
            isActive: true,
        })

        return broker.save()
    },

    /**
     * Update broker
     */
    async update(brokerId, millId, updateData) {
        // Check for duplicate phone if phone is being updated
        if (updateData.phone) {
            const existing = await Broker.findOne({
                phone: updateData.phone,
                millId: millId,
                _id: { $ne: brokerId },
            })
            if (existing) {
                throw new Error('Broker with this phone number already exists')
            }
        }

        return Broker.findOneAndUpdate(
            { _id: brokerId, millId: millId },
            updateData,
            { new: true, runValidators: true }
        )
    },

    /**
     * Delete broker (soft delete by setting inactive)
     */
    async delete(brokerId, millId) {
        const broker = await Broker.findOne({ _id: brokerId, millId: millId })
        if (!broker) {
            return null
        }

        // Check if broker has transactions
        const Purchase = mongoose.model('Purchase')
        const Sale = mongoose.model('Sale')

        const purchaseCount = await Purchase.countDocuments({
            broker: brokerId,
        })
        const saleCount = await Sale.countDocuments({ broker: brokerId })

        if (purchaseCount > 0 || saleCount > 0) {
            // Soft delete - mark as inactive
            broker.isActive = false
            return broker.save()
        }

        // Hard delete if no transactions
        return Broker.findByIdAndDelete(brokerId)
    },

    /**
     * Toggle broker active status
     */
    async toggleStatus(brokerId, millId) {
        const broker = await Broker.findOne({ _id: brokerId, millId: millId })
        if (!broker) {
            return null
        }

        broker.isActive = !broker.isActive
        return broker.save()
    },

    /**
     * Update broker balance
     */
    async updateBalance(brokerId, amount) {
        return Broker.findByIdAndUpdate(
            brokerId,
            { $inc: { currentBalance: amount } },
            { new: true }
        )
    },

    /**
     * Record commission payment to broker
     */
    async recordPayment(
        brokerId,
        millId,
        { amount, paymentMode, reference, date }
    ) {
        const broker = await Broker.findOne({ _id: brokerId, millId: millId })
        if (!broker) {
            return null
        }

        // Reduce balance (pay out commission)
        broker.currentBalance = Math.max(0, broker.currentBalance - amount)

        return broker.save()
    },

    /**
     * Get broker commission summary
     */
    async getCommissionSummary(millId) {
        return Broker.aggregate([
            {
                $match: {
                    millId: new mongoose.Types.ObjectId(millId),
                    isActive: true,
                },
            },
            {
                $lookup: {
                    from: 'purchases',
                    let: { brokerId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$broker', '$$brokerId'] },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$brokerCommission' },
                            },
                        },
                    ],
                    as: 'purchaseCommission',
                },
            },
            {
                $lookup: {
                    from: 'sales',
                    let: { brokerId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$broker', '$$brokerId'] },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$brokerCommission' },
                            },
                        },
                    ],
                    as: 'saleCommission',
                },
            },
            {
                $addFields: {
                    totalEarned: {
                        $add: [
                            {
                                $ifNull: [
                                    {
                                        $arrayElemAt: [
                                            '$purchaseCommission.total',
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                            {
                                $ifNull: [
                                    {
                                        $arrayElemAt: [
                                            '$saleCommission.total',
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalBrokers: { $sum: 1 },
                    totalCommissionEarned: { $sum: '$totalEarned' },
                    totalCurrentBalance: { $sum: '$currentBalance' },
                    brokers: {
                        $push: {
                            id: '$_id',
                            name: '$name',
                            totalEarned: '$totalEarned',
                            currentBalance: '$currentBalance',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalBrokers: 1,
                    totalCommissionEarned: 1,
                    totalCurrentBalance: 1,
                    brokers: 1,
                },
            },
        ])
    },
}

export default BrokerService
