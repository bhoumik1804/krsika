import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Other Outward Schema
 * Tracks other outward entries for a mill
 */
const OtherOutwardSchema = new Schema(
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
        otherSaleDealNumber: {
            type: String,
            trim: true,
        },
        itemName: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            min: 0,
        },
        quantityType: {
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
        gunnyNew: {
            type: Number,
            min: 0,
        },
        gunnyOld: {
            type: Number,
            min: 0,
        },
        gunnyPlastic: {
            type: Number,
            min: 0,
        },
        juteGunnyWeight: {
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
OtherOutwardSchema.index({ millId: 1, date: -1 })
OtherOutwardSchema.index({ millId: 1, partyName: 1 })
OtherOutwardSchema.index({ millId: 1, brokerName: 1 })
OtherOutwardSchema.index({ millId: 1, itemName: 1 })
OtherOutwardSchema.index({ millId: 1, truckNo: 1 })

// Add pagination plugin
OtherOutwardSchema.plugin(aggregatePaginate)

export const OtherOutward = model('OtherOutward', OtherOutwardSchema)
