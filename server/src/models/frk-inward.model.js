import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * FRK Inward Schema
 * Tracks FRK inward entries for a mill
 */
const FrkInwardSchema = new Schema(
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
FrkInwardSchema.index({ millId: 1, date: -1 })
FrkInwardSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
FrkInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FrkInwardSchema.set('toJSON', { virtuals: true })
FrkInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FrkInwardSchema.plugin(aggregatePaginate)

export const FrkInward = model('FrkInward', FrkInwardSchema)
