import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Milling Rice Schema
 * Tracks milling rice entries for a mill
 */
const MillingRiceSchema = new Schema(
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
        riceLot: {
            type: String,
            trim: true,
        },
        riceType: {
            type: String,
            trim: true,
        },
        totalPaddy: {
            type: Number,
            min: 0,
        },
        totalRice: {
            type: Number,
            min: 0,
        },
        brokenRice: {
            type: Number,
            min: 0,
        },
        khurai: {
            type: Number,
            min: 0,
        },
        millRecovery: {
            type: Number,
            min: 0,
            max: 100,
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
MillingRiceSchema.index({ millId: 1, date: -1 })
MillingRiceSchema.index({ millId: 1, riceLot: 1 })
MillingRiceSchema.index({ millId: 1, riceType: 1 })

// Virtual for formatted date
MillingRiceSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
MillingRiceSchema.set('toJSON', { virtuals: true })
MillingRiceSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
MillingRiceSchema.plugin(aggregatePaginate)

export const MillingRice = model('MillingRice', MillingRiceSchema)
