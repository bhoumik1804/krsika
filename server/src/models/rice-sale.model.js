import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Rice Sale Schema
 * Tracks rice sales entries for a mill
 */
const RiceSaleSchema = new Schema(
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
        lotOrOther: {
            type: String,
            trim: true,
        },
        fciOrNAN: {
            type: String,
            trim: true,
        },
        riceType: {
            type: String,
            trim: true,
        },
        riceQty: {
            type: Number,
            min: 0,
        },
        riceRatePerQuintal: {
            type: Number,
            min: 0,
        },
        discountPercent: {
            type: Number,
            min: 0,
            max: 100,
        },
        brokeragePerQuintal: {
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
        frkType: {
            type: String,
            trim: true,
        },
        frkRatePerQuintal: {
            type: Number,
            min: 0,
        },
        lotNumber: {
            type: String,
            trim: true,
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
RiceSaleSchema.index({ millId: 1, date: -1 })
RiceSaleSchema.index({ millId: 1, partyName: 1 })
RiceSaleSchema.index({ millId: 1, brokerName: 1 })
RiceSaleSchema.index({ millId: 1, riceType: 1 })
RiceSaleSchema.index({ millId: 1, deliveryType: 1 })
RiceSaleSchema.index({ millId: 1, gunnyType: 1 })
RiceSaleSchema.index({ millId: 1, frkType: 1 })
RiceSaleSchema.index({ millId: 1, lotNumber: 1 })
RiceSaleSchema.index({ millId: 1, createdAt: -1 })

// Apply aggregate paginate plugin
RiceSaleSchema.plugin(aggregatePaginate)

export const RiceSale = model('RiceSale', RiceSaleSchema)
