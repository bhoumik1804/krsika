import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Rice Purchase Schema
 * Tracks rice purchase entries for a mill
 */
const RicePurchaseSchema = new Schema(
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
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        deliveryType: {
            type: String,
            trim: true,
        },
        lotOrOther: {
            type: String,
            trim: true,
        }, // LOT / Other
        fciOrNAN: {
            type: String,
            trim: true,
        }, // FCI/NAN
        riceType: {
            type: String,
            trim: true,
        },
        riceQty: {
            type: Number,
        },
        riceRate: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        },
        brokeragePerQuintal: {
            type: Number,
        },
        gunnyType: {
            type: String,
            trim: true,
        },
        newGunnyRate: {
            type: Number,
        },
        oldGunnyRate: {
            type: Number,
        },
        plasticGunnyRate: {
            type: Number,
        },
        frkType: {
            type: String,
            trim: true,
        },
        frkRatePerQuintal: {
            type: Number,
        },
        lotNumber: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
RicePurchaseSchema.index({ millId: 1, date: -1 })
RicePurchaseSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
RicePurchaseSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
RicePurchaseSchema.set('toJSON', { virtuals: true })
RicePurchaseSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
RicePurchaseSchema.plugin(aggregatePaginate)

export const RicePurchase = model('RicePurchase', RicePurchaseSchema)
