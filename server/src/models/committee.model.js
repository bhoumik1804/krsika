import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Committee Schema
 * Tracks committees for a mill
 */
const CommitteeSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        committeeName: {
            type: String,
            required: true,
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
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
CommitteeSchema.index({ millId: 1, committeeName: 1 })

// Ensure virtuals are included in JSON output
CommitteeSchema.set('toJSON', { virtuals: true })
CommitteeSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
CommitteeSchema.plugin(aggregatePaginate)

export const Committee = model('Committee', CommitteeSchema)
