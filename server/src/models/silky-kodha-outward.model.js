import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Silky Kodha Outward Schema
 * Tracks silky kodha outward entries for a mill
 */
const SilkyKodhaOutwardSchema = new Schema(
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
        silkyKodhaSaleDealNumber: {
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
        oil: {
            type: Number,
            min: 0,
        },
        brokerage: {
            type: Number,
            min: 0,
        },
        gunnyPlastic: {
            type: Number,
            min: 0,
        },
        plasticWeight: {
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
        gunnyWeight: {
            type: Number,
            min: 0,
        },
        netWeight: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
SilkyKodhaOutwardSchema.index({ millId: 1, date: -1 })
SilkyKodhaOutwardSchema.index({ millId: 1, partyName: 1 })
SilkyKodhaOutwardSchema.index({ millId: 1, brokerName: 1 })
SilkyKodhaOutwardSchema.index({ millId: 1, truckNo: 1 })

// Add pagination plugin
SilkyKodhaOutwardSchema.plugin(aggregatePaginate)

export const SilkyKodhaOutward = model(
    'SilkyKodhaOutward',
    SilkyKodhaOutwardSchema
)
