import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Milling Paddy Schema
 * Tracks milling paddy entries for a mill
 */
const MillingPaddySchema = new Schema(
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
        paddyType: {
            type: String,
            required: true,
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
        riceType: {
            type: String,
            trim: true,
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
        kodhaQuantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        kodhaPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        bhusaTon: {
            type: Number,
            min: 0,
            default: 0,
        },
        bhusaPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        nakkhiQuantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        nakkhiPercentage: {
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
MillingPaddySchema.index({ millId: 1, date: -1 })
MillingPaddySchema.index({ millId: 1, paddyType: 1 })
MillingPaddySchema.index({ millId: 1, riceType: 1 })

// Plugin for aggregate pagination
MillingPaddySchema.plugin(aggregatePaginate)

export const MillingPaddy = model('MillingPaddy', MillingPaddySchema)
