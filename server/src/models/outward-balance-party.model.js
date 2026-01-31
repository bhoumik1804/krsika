import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Outward Balance Party Schema
 * Tracks outward balance party entries for a mill
 */
const OutwardBalancePartySchema = new Schema(
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
OutwardBalancePartySchema.index({ millId: 1, partyName: 1 })
OutwardBalancePartySchema.index({ millId: 1, createdAt: -1 })

// Ensure virtuals are included in JSON output
OutwardBalancePartySchema.set('toJSON', { virtuals: true })
OutwardBalancePartySchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
OutwardBalancePartySchema.plugin(aggregatePaginate)

export const OutwardBalanceParty = model(
    'OutwardBalanceParty',
    OutwardBalancePartySchema
)
