import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * FRK Sale Schema
 * Tracks FRK sale entries for a mill
 */
const FrkSaleSchema = new Schema(
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
        totalWeight: {
            type: Number,
            min: 0,
        },
        rate: {
            type: Number,
            min: 0,
        },
        amount: {
            type: Number,
            min: 0,
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
    }
)

// Compound indexes for common queries
FrkSaleSchema.index({ millId: 1, date: -1 })
FrkSaleSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
FrkSaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FrkSaleSchema.set('toJSON', { virtuals: true })
FrkSaleSchema.set('toObject', { virtuals: true })

// Apply deal number plugin (auto-generates frkSalesDealNumber)
FrkSaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'frkSalesDealNumber',
    prefix: 'FKS',
})

// Add aggregate paginate plugin
FrkSaleSchema.plugin(aggregatePaginate)

export const FrkSale = model('FrkSale', FrkSaleSchema)
