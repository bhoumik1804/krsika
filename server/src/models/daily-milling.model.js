import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Milling Schema
 * Tracks daily milling operations for a mill
 */
const DailyMillingSchema = new Schema(
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
        shift: {
            type: String,
            enum: ['Day', 'Night'],
            required: true,
            index: true,
        },
        paddyType: {
            type: String,
            required: true,
            trim: true,
        },
        paddyQuantity: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Quantity in Quintals (Qtl)',
        },
        riceYield: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Yield in Kilograms (Kg)',
        },
        brokenYield: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Broken rice yield in Kilograms (Kg)',
        },
        branYield: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Bran yield in Kilograms (Kg)',
        },
        huskYield: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Husk yield in Kilograms (Kg)',
        },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'halted'],
            default: 'scheduled',
            index: true,
        },
        remarks: {
            type: String,
            trim: true,
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
DailyMillingSchema.index({ millId: 1, date: -1 })
DailyMillingSchema.index({ millId: 1, status: 1, date: -1 })
DailyMillingSchema.index({ millId: 1, shift: 1, date: -1 })
DailyMillingSchema.index({ millId: 1, paddyType: 1 })

// Virtual for formatted date
DailyMillingSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Virtual for total yield
DailyMillingSchema.virtual('totalYield').get(function () {
    return this.riceYield + this.brokenYield + this.branYield + this.huskYield
})

// Ensure virtuals are included in JSON output
DailyMillingSchema.set('toJSON', { virtuals: true })
DailyMillingSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailyMillingSchema.plugin(aggregatePaginate)

export const DailyMilling = model('DailyMilling', DailyMillingSchema)
