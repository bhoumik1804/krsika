import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

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
            required: true,
            trim: true,
        },
        itemName: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            min: 0,
        },
        unit: {
            type: String,
            trim: true,
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
OtherSaleSchema.index({ millId: 1, date: -1 })
OtherSaleSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
OtherSaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
OtherSaleSchema.set('toJSON', { virtuals: true })
OtherSaleSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
OtherSaleSchema.plugin(aggregatePaginate)

export const OtherSale = model('OtherSale', OtherSaleSchema)
