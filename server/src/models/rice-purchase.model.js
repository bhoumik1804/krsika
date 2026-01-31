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
            required: true,
            trim: true,
        },
        riceType: {
            type: String,
            trim: true,
        },
        riceGunny: {
            type: Number,
            min: 0,
        },
        netWeight: {
            type: Number,
            min: 0,
        },
        rate: {
            type: Number,
            min: 0,
        },
        amount: {
            type: Number,
            min: 0,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        brokerage: {
            type: Number,
            min: 0,
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
