import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Nakkhi Outward Schema
 * Tracks nakkhi outward entries for a mill
 */
const NakkhiOutwardSchema = new Schema(
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
        nakkhiSaleDealNumber: {
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
NakkhiOutwardSchema.index({ millId: 1, date: -1 })
NakkhiOutwardSchema.index({ millId: 1, partyName: 1 })
NakkhiOutwardSchema.index({ millId: 1, brokerName: 1 })

// Add aggregate pagination plugin
NakkhiOutwardSchema.plugin(aggregatePaginate)

const NakkhiOutward = model('NakkhiOutward', NakkhiOutwardSchema)

export default NakkhiOutward
