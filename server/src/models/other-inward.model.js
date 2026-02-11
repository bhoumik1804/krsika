import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Other Inward Schema
 * Tracks other inward entries for a mill
 */
const OtherInwardSchema = new Schema(
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
        otherPurchaseDealNumber: {
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
        truckNumber: {
            type: String,
            trim: true,
        },
        rstNumber: {
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
OtherInwardSchema.index({ millId: 1, date: -1 })
OtherInwardSchema.index({ millId: 1, partyName: 1 })
OtherInwardSchema.index({ millId: 1, itemName: 1 })
OtherInwardSchema.index({ millId: 1, unit: 1 })

// Virtual for formatted date
OtherInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
OtherInwardSchema.set('toJSON', { virtuals: true })
OtherInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
OtherInwardSchema.plugin(aggregatePaginate)

export const OtherInward = model('OtherInward', OtherInwardSchema)
