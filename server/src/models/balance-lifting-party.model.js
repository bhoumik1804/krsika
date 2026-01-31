import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Balance Lifting Party Schema
 * Tracks balance lifting party entries for a mill
 */
const BalanceLiftingPartySchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        partyName: {
            type: String,
            required: true,
            trim: true,
        },
        paddy: {
            type: Number,
            min: 0,
            default: 0,
        },
        rice: {
            type: Number,
            min: 0,
            default: 0,
        },
        gunny: {
            type: Number,
            min: 0,
            default: 0,
        },
        frk: {
            type: Number,
            min: 0,
            default: 0,
        },
        other: {
            type: Number,
            min: 0,
            default: 0,
        },
        totalBalance: {
            type: Number,
            min: 0,
            default: 0,
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
BalanceLiftingPartySchema.index({ millId: 1, partyName: 1 })
BalanceLiftingPartySchema.index({ millId: 1, createdAt: -1 })

// Ensure virtuals are included in JSON output
BalanceLiftingPartySchema.set('toJSON', { virtuals: true })
BalanceLiftingPartySchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
BalanceLiftingPartySchema.plugin(aggregatePaginate)

export const BalanceLiftingParty = model(
    'BalanceLiftingParty',
    BalanceLiftingPartySchema
)
