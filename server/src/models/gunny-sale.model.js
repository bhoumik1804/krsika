import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Gunny Sale Schema
 * Tracks gunny sale entries for a mill
 */
const GunnySaleSchema = new Schema(
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
            required: true,
            trim: true,
        },
        newGunnyQty: {
            type: Number,
            min: 0,
        },
        newGunnyRate: {
            type: Number,
            min: 0,
        },
        oldGunnyQty: {
            type: Number,
            min: 0,
        },
        oldGunnyRate: {
            type: Number,
            min: 0,
        },
        plasticGunnyQty: {
            type: Number,
            min: 0,
        },
        plasticGunnyRate: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
GunnySaleSchema.index({ millId: 1, date: -1 })
GunnySaleSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
GunnySaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GunnySaleSchema.set('toJSON', { virtuals: true })
GunnySaleSchema.set('toObject', { virtuals: true })

// Apply deal number plugin (auto-generates gunnySalesDealNumber)
GunnySaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'gunnySalesDealNumber',
    prefix: 'GNS',
})

// Add aggregate paginate plugin
GunnySaleSchema.plugin(aggregatePaginate)

export const GunnySale = model('GunnySale', GunnySaleSchema)
