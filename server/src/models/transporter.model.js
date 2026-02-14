import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Transporter Schema
 * Tracks transporters for a mill
 */
const TransporterSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        transporterName: {
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
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
TransporterSchema.index({ millId: 1, transporterName: 1 })

// Ensure virtuals are included in JSON output
TransporterSchema.set('toJSON', { virtuals: true })
TransporterSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
TransporterSchema.plugin(aggregatePaginate)

export const Transporter = model('Transporter', TransporterSchema)
