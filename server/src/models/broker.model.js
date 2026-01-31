import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Broker Schema
 * Tracks brokers for a mill
 */
const BrokerSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        brokerName: {
            type: String,
            required: true,
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
BrokerSchema.index({ millId: 1, brokerName: 1 })

// Ensure virtuals are included in JSON output
BrokerSchema.set('toJSON', { virtuals: true })
BrokerSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
BrokerSchema.plugin(aggregatePaginate)

export const Broker = model('Broker', BrokerSchema)
