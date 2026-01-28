/**
 * Party Service
 * =============
 * Business logic for party (customer/supplier) management
 */
import mongoose from 'mongoose'
import Party from '../../../shared/models/party.model.js'

const PartyService = {
    /**
     * Find all parties with filters and pagination
     */
    async findAll({
        millId,
        page = 1,
        limit = 10,
        search,
        sortBy = 'name',
        sortOrder = 'asc',
        isActive,
        hasBalance = null,
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
                { address: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ]
        }

        const aggregate = Party.aggregate([
            { $match: query },
            ...(hasBalance !== null
                ? [
                      {
                          $match: hasBalance
                              ? { currentBalance: { $ne: 0 } }
                              : { currentBalance: 0 },
                      },
                  ]
                : []),
            {
                $lookup: {
                    from: 'purchases',
                    let: { partyId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$party', '$$partyId'] } } },
                        { $count: 'count' },
                    ],
                    as: 'purchaseCount',
                },
            },
            {
                $lookup: {
                    from: 'sales',
                    let: { partyId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$party', '$$partyId'] } } },
                        { $count: 'count' },
                    ],
                    as: 'saleCount',
                },
            },
            {
                $addFields: {
                    purchaseCount: {
                        $ifNull: [
                            { $arrayElemAt: ['$purchaseCount.count', 0] },
                            0,
                        ],
                    },
                    saleCount: {
                        $ifNull: [{ $arrayElemAt: ['$saleCount.count', 0] }, 0],
                    },
                    totalTransactions: {
                        $add: [
                            {
                                $ifNull: [
                                    {
                                        $arrayElemAt: [
                                            '$purchaseCount.count',
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                            {
                                $ifNull: [
                                    { $arrayElemAt: ['$saleCount.count', 0] },
                                    0,
                                ],
                            },
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

        return Party.aggregatePaginate(aggregate, options)
    },

    /**
     * Find party by ID
     */
    async findById(partyId, millId) {
        return Party.findOne({
            _id: partyId,
            millId: millId,
        })
    },

    /**
     * Find party by phone
     */
    async findByPhone(phone, millId) {
        return Party.findOne({
            phone,
            millId: millId,
        })
    },

    /**
     * Create new party
     */
    async create({
        millId,
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        gstn,
        bankName,
        accountNumber,
        ifscCode,
        openingBalance = 0,
    }) {
        // Check for duplicate phone in same mill
        if (phone) {
            const existing = await Party.findOne({ phone, millId })
            if (existing) {
                throw new Error('Party with this phone number already exists')
            }
        }

        const party = new Party({
            millId,
            name,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            gstn,
            bankName,
            accountNumber,
            ifscCode,
            openingBalance,
            currentBalance: openingBalance,
        })

        return party.save()
    },

    /**
     * Update party
     */
    async update(partyId, millId, updateData) {
        // Check for duplicate phone if phone is being updated
        if (updateData.phone) {
            const existing = await Party.findOne({
                phone: updateData.phone,
                millId: millId,
                _id: { $ne: partyId },
            })
            if (existing) {
                throw new Error('Party with this phone number already exists')
            }
        }

        return Party.findOneAndUpdate(
            { _id: partyId, millId: millId },
            updateData,
            { new: true, runValidators: true }
        )
    },

    /**
     * Delete party
     */
    async delete(partyId, millId) {
        // Check if party has transactions
        const party = await Party.findOne({ _id: partyId, millId: millId })
        if (!party) {
            return null
        }

        const Purchase = mongoose.model('Purchase')
        const Sale = mongoose.model('Sale')

        const purchaseCount = await Purchase.countDocuments({ party: partyId })
        const saleCount = await Sale.countDocuments({ party: partyId })

        if (purchaseCount > 0 || saleCount > 0) {
            throw new Error('Cannot delete party with existing transactions')
        }

        return Party.findByIdAndDelete(partyId)
    },

    /**
     * Update party balance
     */
    async updateBalance(partyId, amount) {
        return Party.findByIdAndUpdate(
            partyId,
            { $inc: { currentBalance: amount } },
            { new: true }
        )
    },

    /**
     * Get party ledger (all transactions)
     */
    async getLedger(
        partyId,
        millId,
        { startDate, endDate, page = 1, limit = 20 }
    ) {
        const party = await Party.findOne({ _id: partyId, millId: millId })
        if (!party) {
            return null
        }

        const dateFilter = {}
        if (startDate) {
            dateFilter.$gte = new Date(startDate)
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate)
        }

        // Get purchases
        const Purchase = mongoose.model('Purchase')
        const purchaseQuery = { party: partyId }
        if (Object.keys(dateFilter).length) {
            purchaseQuery.date = dateFilter
        }
        const purchases = await Purchase.find(purchaseQuery).lean()

        // Get sales
        const Sale = mongoose.model('Sale')
        const saleQuery = { party: partyId }
        if (Object.keys(dateFilter).length) {
            saleQuery.date = dateFilter
        }
        const sales = await Sale.find(saleQuery).lean()

        // Combine and sort by date
        const transactions = [
            ...purchases.map((p) => ({
                type: 'purchase',
                date: p.date,
                invoiceNumber: p.invoiceNumber,
                amount: p.totalAmount,
                paid: p.paidAmount,
                pending: p.pendingAmount,
                stockType: p.stockType,
                quantity: p.quantity,
            })),
            ...sales.map((s) => ({
                type: 'sale',
                date: s.date,
                invoiceNumber: s.invoiceNumber,
                amount: s.totalAmount,
                paid: s.paidAmount,
                pending: s.pendingAmount,
                stockType: s.stockType,
                quantity: s.quantity,
            })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date))

        // Manual pagination
        const skip = (page - 1) * limit
        const paginatedTransactions = transactions.slice(skip, skip + limit)

        return {
            party,
            transactions: paginatedTransactions,
            pagination: {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalDocs: transactions.length,
                totalPages: Math.ceil(transactions.length / limit),
                hasNextPage: skip + limit < transactions.length,
                hasPrevPage: page > 1,
            },
        }
    },

    /**
     * Get party summary
     */
    async getSummary(millId) {
        return Party.aggregate([
            { $match: { millId: new mongoose.Types.ObjectId(millId) } },
            {
                $group: {
                    _id: '$isActive',
                    count: { $sum: 1 },
                    totalBalance: { $sum: '$currentBalance' },
                    positiveBalance: {
                        $sum: {
                            $cond: [
                                { $gt: ['$currentBalance', 0] },
                                '$currentBalance',
                                0,
                            ],
                        },
                    },
                    negativeBalance: {
                        $sum: {
                            $cond: [
                                { $lt: ['$currentBalance', 0] },
                                '$currentBalance',
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalParties: { $sum: '$count' },
                    byStatus: {
                        $push: {
                            isActive: '$_id',
                            count: '$count',
                            totalBalance: '$totalBalance',
                            positiveBalance: '$positiveBalance',
                            negativeBalance: '$negativeBalance',
                        },
                    },
                    overallBalance: { $sum: '$totalBalance' },
                    totalReceivable: { $sum: '$positiveBalance' },
                    totalPayable: { $sum: { $abs: '$negativeBalance' } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalParties: 1,
                    byStatus: 1,
                    overallBalance: 1,
                    totalReceivable: 1,
                    totalPayable: 1,
                },
            },
        ])
    },

    /**
     * Get parties with outstanding balance
     */
    async getOutstandingBalances(
        millId,
        { type = 'all', sortBy = 'currentBalance', sortOrder = 'desc' }
    ) {
        const query = {
            millId: new mongoose.Types.ObjectId(millId),
            currentBalance: { $ne: 0 },
        }

        if (type === 'receivable') {
            query.currentBalance = { $gt: 0 }
        } else if (type === 'payable') {
            query.currentBalance = { $lt: 0 }
        }

        return Party.find(query)
            .select('name phone currentBalance city')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .lean()
    },

    /**
     * Toggle party active status
     */
    async toggleStatus(partyId, millId) {
        const party = await Party.findOne({ _id: partyId, millId })
        if (!party) {
            return null
        }

        party.isActive = !party.isActive
        return party.save()
    },
}

export default PartyService
