import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * DO Report Schema
 * Tracks DO (Delivery Order) reports for a mill
 */
const DoReportSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        doNumber: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        itemType: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            min: 0,
        },
        validFrom: {
            type: Date,
        },
        validTo: {
            type: Date,
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
DoReportSchema.index({ millId: 1, doNumber: 1 })
DoReportSchema.index({ millId: 1, date: -1 })

// Ensure virtuals are included in JSON output
DoReportSchema.set('toJSON', { virtuals: true })
DoReportSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DoReportSchema.plugin(aggregatePaginate)

export const DoReport = model('DoReport', DoReportSchema)
