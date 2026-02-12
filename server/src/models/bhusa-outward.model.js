import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Bhusa Outward Schema
 * Tracks bhusa outward entries for a mill
 */
const BhusaOutwardSchema = new Schema(
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
        bhusaSaleDealNumber: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        rate: {
            type: Number,
            min: 0,
        },
        brokerage: {
            type: Number,
            min: 0,
        },
        truckNo: {
            type: String,
            trim: true,
        },
        truckRst: {
            type: String,
            trim: true,
        },
        truckWeight: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
BhusaOutwardSchema.index({ millId: 1, date: -1 })
BhusaOutwardSchema.index({ millId: 1, partyName: 1 })
BhusaOutwardSchema.index({ millId: 1, brokerName: 1 })
BhusaOutwardSchema.index({ millId: 1, truckNo: 1 })

// Add pagination plugin
BhusaOutwardSchema.plugin(aggregatePaginate)

export const BhusaOutward = model('BhusaOutward', BhusaOutwardSchema)
