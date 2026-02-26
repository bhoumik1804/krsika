import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Other Sale Schema
 * Tracks other sale entries for a mill
 */
const OtherSaleSchema = new Schema(
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
        otherSaleName: {
            type: String,
            trim: true,
        },
        otherSaleQty: {
            type: Number,
            min: 0,
        },
        qtyType: {
            type: String,
            trim: true,
        },
        rate: {
            type: Number,
            min: 0,
        },
        discountPercent: {
            type: Number,
            min: 0,
            max: 100,
        },
        gst: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
OtherSaleSchema.index({ millId: 1, date: -1 })
OtherSaleSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
OtherSaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
OtherSaleSchema.set('toJSON', { virtuals: true })
OtherSaleSchema.set('toObject', { virtuals: true })

// Apply deal number plugin (auto-generates otherSalesDealNumber)
OtherSaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'otherSalesDealNumber',
    prefix: 'OTS',
})

// Add aggregate paginate plugin
OtherSaleSchema.plugin(aggregatePaginate)

export const OtherSale = model('OtherSale', OtherSaleSchema)
