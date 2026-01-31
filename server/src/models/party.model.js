import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Party Schema
 * Tracks parties for a mill
 */
const PartySchema = new Schema(
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
        gstn: {
            type: String,
            trim: true,
            uppercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
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
PartySchema.index({ millId: 1, partyName: 1 })
PartySchema.index({ millId: 1, gstn: 1 })

// Ensure virtuals are included in JSON output
PartySchema.set('toJSON', { virtuals: true })
PartySchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
PartySchema.plugin(aggregatePaginate)

export const Party = model('Party', PartySchema)
