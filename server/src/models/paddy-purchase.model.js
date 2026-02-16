import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Paddy Purchase Schema
 * Tracks paddy purchase entries for a mill
 */
const PaddyPurchaseSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        deliveryType: {
            type: String,
            trim: true,
        },
        purchaseType: {
            type: String,
            trim: true,
        },
        doNumber: {
            type: String,
            trim: true,
        },
        committeeName: {
            type: String,
            trim: true,
        },
        doPaddyQty: {
            type: Number,
            min: 0,
        },
        paddyType: {
            type: String,
            trim: true,
        },
        totalPaddyQty: {
            type: Number,
            min: 0,
        },
        paddyRatePerQuintal: {
            type: Number,
            min: 0,
        },
        discountPercent: {
            type: Number,
            min: 0,
            max: 100,
        },
        brokerage: {
            type: Number,
            min: 0,
        },
        gunnyType: {
            type: String,
            trim: true,
        },
        newGunnyRate: {
            type: Number,
            min: 0,
        },
        oldGunnyRate: {
            type: Number,
            min: 0,
        },
        plasticGunnyRate: {
            type: Number,
            min: 0,
        },
        balance: {
            type: Number,
        },
        balanceLifting: {
            type: Number,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Indexes for common queries
PaddyPurchaseSchema.index({ millId: 1, date: -1 })
PaddyPurchaseSchema.index({ millId: 1, partyName: 1 })
PaddyPurchaseSchema.index({ millId: 1, brokerName: 1 })
PaddyPurchaseSchema.index({ millId: 1, purchaseType: 1 })
PaddyPurchaseSchema.index({ millId: 1, paddyType: 1 })
PaddyPurchaseSchema.index({ millId: 1, deliveryType: 1 })
PaddyPurchaseSchema.index({ millId: 1, gunnyType: 1 })
PaddyPurchaseSchema.index({ millId: 1, createdAt: -1 })

// Apply deal number plugin (auto-generates paddyPurchaseDealNumber)
PaddyPurchaseSchema.plugin(dealNumberPlugin, {
    fieldName: 'paddyPurchaseDealNumber',
    prefix: 'PDP',
})

// Apply aggregate paginate plugin
PaddyPurchaseSchema.plugin(aggregatePaginate)

export const PaddyPurchase = model('PaddyPurchase', PaddyPurchaseSchema)
