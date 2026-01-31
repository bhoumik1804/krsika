import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Other Inward Schema
 * Tracks other inward entries for a mill
 */
const OtherInwardSchema = new Schema(
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
OtherInwardSchema.index({ millId: 1, date: -1 })
OtherInwardSchema.index({ millId: 1, partyName: 1 })
OtherInwardSchema.index({ millId: 1, itemName: 1 })
OtherInwardSchema.index({ millId: 1, unit: 1 })

// Virtual for formatted date
OtherInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
OtherInwardSchema.set('toJSON', { virtuals: true })
OtherInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
OtherInwardSchema.plugin(aggregatePaginate)

export const OtherInward = model('OtherInward', OtherInwardSchema)
