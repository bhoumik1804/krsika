import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * FRK Purchase Schema
 * Tracks FRK (Fine Rice Kani) purchase entries for a mill
 */
const FrkPurchaseSchema = new Schema(
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
FrkPurchaseSchema.index({ millId: 1, date: -1 })
FrkPurchaseSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
FrkPurchaseSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FrkPurchaseSchema.set('toJSON', { virtuals: true })
FrkPurchaseSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FrkPurchaseSchema.plugin(aggregatePaginate)

export const FrkPurchase = model('FrkPurchase', FrkPurchaseSchema)
