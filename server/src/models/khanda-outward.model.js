import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Khanda Outward Schema
 * Tracks khanda outward entries for a mill
 */
const KhandaOutwardSchema = new Schema(
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
        khandaSaleDealNumber: {
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
KhandaOutwardSchema.index({ millId: 1, date: -1 })
KhandaOutwardSchema.index({ millId: 1, partyName: 1 })
KhandaOutwardSchema.index({ millId: 1, brokerName: 1 })

// Add aggregate pagination plugin
KhandaOutwardSchema.plugin(aggregatePaginate)

const KhandaOutward = model('KhandaOutward', KhandaOutwardSchema)

export default KhandaOutward
