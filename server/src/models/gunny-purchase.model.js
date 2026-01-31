import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Gunny Purchase Schema
 * Tracks gunny purchase entries for a mill
 */
const GunnyPurchaseSchema = new Schema(
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
        gunnyType: {
            type: String,
            trim: true,
        },
        totalGunny: {
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
GunnyPurchaseSchema.index({ millId: 1, date: -1 })
GunnyPurchaseSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
GunnyPurchaseSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GunnyPurchaseSchema.set('toJSON', { virtuals: true })
GunnyPurchaseSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
GunnyPurchaseSchema.plugin(aggregatePaginate)

export const GunnyPurchase = model('GunnyPurchase', GunnyPurchaseSchema)
