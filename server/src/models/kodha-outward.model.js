import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Kodha Outward Schema
 * Tracks kodha outward entries for a mill
 */
const KodhaOutwardSchema = new Schema(
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
        kodhaSaleDealNumber: {
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
        plasticGunnyWeight: {
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
KodhaOutwardSchema.index({ millId: 1, date: -1 })
KodhaOutwardSchema.index({ millId: 1, partyName: 1 })
KodhaOutwardSchema.index({ millId: 1, brokerName: 1 })
KodhaOutwardSchema.index({ millId: 1, truckNo: 1 })

// Add pagination plugin
KodhaOutwardSchema.plugin(aggregatePaginate)

export const KodhaOutward = model('KodhaOutward', KodhaOutwardSchema)
