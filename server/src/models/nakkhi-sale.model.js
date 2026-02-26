import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Nakkhi Sale Schema
 * Tracks nakkhi sale entries for a mill
 */
const NakkhiSaleSchema = new Schema(
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
        nakkhiQty: {
            type: Number,
            min: 0,
        },
        nakkhiRate: {
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
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
NakkhiSaleSchema.index({ millId: 1, date: -1 })
NakkhiSaleSchema.index({ millId: 1, partyName: 1 })
NakkhiSaleSchema.index({ millId: 1, brokerName: 1 })

// Virtual for formatted date
NakkhiSaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
NakkhiSaleSchema.set('toJSON', { virtuals: true })
NakkhiSaleSchema.set('toObject', { virtuals: true })

// Apply deal number plugin (auto-generates nakkhiSalesDealNumber)
NakkhiSaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'nakkhiSalesDealNumber',
    prefix: 'NKS',
})

// Add aggregate paginate plugin
NakkhiSaleSchema.plugin(aggregatePaginate)

export const NakkhiSale = model('NakkhiSale', NakkhiSaleSchema)
