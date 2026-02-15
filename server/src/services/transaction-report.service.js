import mongoose from 'mongoose'
import { DailyPurchaseDeal } from '../models/daily-purchase-deal.model.js'
import { DailySalesDeal } from '../models/daily-sales-deal.model.js'
import { DailyInward } from '../models/daily-inward.model.js'
import { DailyOutward } from '../models/daily-outward.model.js'
import { DailyReceipt } from '../models/daily-receipt.model.js'
import { DailyPayment } from '../models/daily-payment.model.js'

/**
 * Transaction Report Service
 * Aggregates real data from DailyPurchaseDeal, DailySalesDeal, DailyInward,
 * DailyOutward, DailyReceipt, DailyPayment - so whenever any sale/purchase
 * deal happens, it appears in the report.
 */

const millMatch = (millId) => ({ millId: new mongoose.Types.ObjectId(millId) })

const dateFilter = (startDate, endDate) => {
    const filter = {}
    if (startDate || endDate) {
        filter.date = {}
        if (startDate) filter.date.$gte = new Date(startDate)
        if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    return filter
}

/**
 * Get Party Transaction Report - aggregated from deals, inward, outward, receipt, payment
 * Returns one row per (partyName, brokerName) with totals
 */
export const getPartyTransactionReport = async (millId, options = {}) => {
    const { startDate, endDate, partyName, page = 1, limit = 50 } = options

    const [purchaseAgg, salesAgg, inwardAgg, outwardAgg, receiptAgg, paymentAgg] =
        await Promise.all([
            DailyPurchaseDeal.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$farmerName',
                            brokerName: { $ifNull: ['$brokerName', ''] },
                        },
                        purchaseDeal: { $sum: '$totalAmount' },
                        brokerage: { $sum: { $ifNull: ['$brokerCommission', 0] } },
                    },
                },
            ]),
            DailySalesDeal.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$buyerName',
                            brokerName: { $ifNull: ['$brokerName', ''] },
                        },
                        salesDeal: { $sum: '$totalAmount' },
                        brokerage: { $sum: { $ifNull: ['$brokerCommission', 0] } },
                    },
                },
            ]),
            DailyInward.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$partyName',
                            brokerName: '',
                        },
                        inward: { $sum: '$weight' },
                    },
                },
            ]),
            DailyOutward.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$partyName',
                            brokerName: '',
                        },
                        outward: { $sum: '$weight' },
                    },
                },
            ]),
            DailyReceipt.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$partyName',
                            brokerName: '',
                        },
                        receipt: { $sum: '$amount' },
                    },
                },
            ]),
            DailyPayment.aggregate([
                { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
                {
                    $group: {
                        _id: {
                            partyName: '$partyName',
                            brokerName: '',
                        },
                        payment: { $sum: '$amount' },
                    },
                },
            ]),
        ])

    const map = new Map()

    const merge = (arr, fields) => {
        for (const row of arr) {
            const k = `${(row._id.partyName || '').trim()}|||${(row._id.brokerName || '').trim()}`
            if (!map.has(k)) {
                map.set(k, {
                    partyName: (row._id.partyName || '').trim(),
                    brokerName: (row._id.brokerName || '').trim(),
                    date: endDate || startDate || new Date().toISOString().split('T')[0],
                    purchaseDeal: 0,
                    salesDeal: 0,
                    inward: 0,
                    outward: 0,
                    accountReceipt: 0,
                    accountPayment: 0,
                    accountBrokerage: 0,
                    receipt: 0,
                    payment: 0,
                    brokerage: 0,
                })
            }
            const r = map.get(k)
            fields.forEach((key) => {
                if (row[key] != null) r[key] = (r[key] || 0) + row[key]
            })
        }
    }

    merge(purchaseAgg, ['purchaseDeal', 'brokerage'])
    merge(salesAgg, ['salesDeal', 'brokerage'])
    merge(inwardAgg, ['inward'])
    merge(outwardAgg, ['outward'])
    merge(receiptAgg, ['receipt'])
    merge(paymentAgg, ['payment'])

    let data = Array.from(map.values())
    if (partyName) {
        const re = new RegExp(partyName, 'i')
        data = data.filter(
            (r) => re.test(r.partyName) || re.test(r.brokerName)
        )
    }
    data.sort((a, b) => (a.partyName || '').localeCompare(b.partyName || ''))

    const total = data.length
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const paginated = data.slice(skip, skip + parseInt(limit, 10))

    return {
        data: paginated.map((r) => ({
            ...r,
            _id: `${r.partyName}-${r.brokerName}-${r.date}`.replace(/\s+/g, '-'),
        })),
        pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            totalPages: Math.ceil(total / parseInt(limit, 10)),
        },
    }
}

/**
 * Get Broker Transaction Report - aggregated by broker
 * Returns one row per (brokerName, partyName) with totals
 */
export const getBrokerTransactionReport = async (millId, options = {}) => {
    const { startDate, endDate, brokerName, page = 1, limit = 50 } = options
    const matchBase = { ...millMatch(millId), ...dateFilter(startDate, endDate) }

    const [purchaseAgg, salesAgg] = await Promise.all([
        DailyPurchaseDeal.aggregate([
            { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
            { $match: { brokerName: { $exists: true, $ne: '', $nin: [null] } } },
            {
                $group: {
                    _id: {
                        brokerName: '$brokerName',
                        partyName: '$farmerName',
                    },
                    purchaseDeal: { $sum: '$totalAmount' },
                    brokerage: { $sum: { $ifNull: ['$brokerCommission', 0] } },
                },
            },
        ]),
        DailySalesDeal.aggregate([
            { $match: { ...millMatch(millId), ...dateFilter(startDate, endDate) } },
            { $match: { brokerName: { $exists: true, $ne: '', $nin: [null] } } },
            {
                $group: {
                    _id: {
                        brokerName: '$brokerName',
                        partyName: '$buyerName',
                    },
                    salesDeal: { $sum: '$totalAmount' },
                    brokerage: { $sum: { $ifNull: ['$brokerCommission', 0] } },
                },
            },
        ]),
    ])

    const map = new Map()

    const merge = (arr) => {
        for (const row of arr) {
            const k = `${(row._id.brokerName || '').trim()}|||${(row._id.partyName || '').trim()}`
            if (!map.has(k)) {
                map.set(k, {
                    brokerName: (row._id.brokerName || '').trim(),
                    partyName: (row._id.partyName || '').trim(),
                    date: endDate || startDate || new Date().toISOString().split('T')[0],
                    purchaseDeal: 0,
                    salesDeal: 0,
                    inward: 0,
                    outward: 0,
                    accountReceipt: 0,
                    accountPayment: 0,
                    accountBrokerage: 0,
                    receipt: 0,
                    payment: 0,
                    brokerage: 0,
                })
            }
            const r = map.get(k)
            if (row.purchaseDeal != null) r.purchaseDeal += row.purchaseDeal
            if (row.salesDeal != null) r.salesDeal += row.salesDeal
            if (row.brokerage != null) r.brokerage += row.brokerage
        }
    }

    merge(purchaseAgg)
    merge(salesAgg)

    let data = Array.from(map.values())
    if (brokerName) {
        const re = new RegExp(brokerName, 'i')
        data = data.filter(
            (r) => re.test(r.brokerName) || re.test(r.partyName)
        )
    }
    data.sort((a, b) => (a.brokerName || '').localeCompare(b.brokerName || ''))

    const total = data.length
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const paginated = data.slice(skip, skip + parseInt(limit, 10))

    return {
        data: paginated.map((r) => ({
            ...r,
            _id: `${r.brokerName}-${r.partyName}-${r.date}`.replace(/\s+/g, '-'),
        })),
        pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            totalPages: Math.ceil(total / parseInt(limit, 10)),
        },
    }
}
