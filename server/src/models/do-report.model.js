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
        date: {
            type: Date,
            required: true,
        },
        samitiSangrahan: {
            type: String,
            optional: true,
        },
        doNo: {
            type: String,
            optional: true,
        },
        dhanMota: {
            type: Number,
            optional: true,
        },
        dhanPatla: {
            type: Number,
            optional: true,
        },
        dhanSarna: {
            type: Number,
            optional: true,
        },
        total: {
            type: Number,
            optional: true,
        },
    },
    {
        timestamps: true,
    }
)

DoReportSchema.index({ millId: 1, date: -1 })

// Ensure virtuals are included in JSON output
DoReportSchema.set('toJSON', { virtuals: true })
DoReportSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DoReportSchema.plugin(aggregatePaginate)

export const DoReport = model('DoReport', DoReportSchema)
