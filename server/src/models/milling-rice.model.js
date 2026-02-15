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
        riceType: {
            type: String,
            trim: true,
        },
        hopperInGunny: {
            type: Number,
            min: 0,
            default: 0,
        },
        hopperInQintal: {
            type: Number,
            min: 0,
            default: 0,
        },
        riceQuantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        ricePercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        khandaQuantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        khandaPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        silkyKodhaQuantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        silkyKodhaPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        wastagePercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
MillingRiceSchema.index({ millId: 1, date: -1 })
MillingRiceSchema.index({ millId: 1, riceType: 1 })
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
