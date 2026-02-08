import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Other Purchase Schema
 * Tracks miscellaneous purchase entries for a mill
 */
const OtherPurchaseSchema = new Schema(
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
        otherPurchaseName: {
            type: String,
            trim: true,
        },
        otherPurchaseQty: {
            type: Number,
        },
        qtyType: {
            type: String,
            trim: true,
        },
        rate: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        },
        gst: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
OtherPurchaseSchema.index({ millId: 1, date: -1 })
OtherPurchaseSchema.index({ millId: 1, partyName: 1 })
OtherPurchaseSchema.index({ millId: 1, itemName: 1 })

// Virtual for formatted date
OtherPurchaseSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
OtherPurchaseSchema.set('toJSON', { virtuals: true })
OtherPurchaseSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
OtherPurchaseSchema.plugin(aggregatePaginate)

export const OtherPurchase = model('OtherPurchase', OtherPurchaseSchema)
