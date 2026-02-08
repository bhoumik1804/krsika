import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Govt Gunny Outward Schema
 * Tracks government gunny outward entries for a mill
 */
const GovtGunnyOutwardSchema = new Schema(
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
        gunnyDmNumber: {
            type: String,
            trim: true,
        },
        samitiSangrahan: {
            type: String,
            trim: true,
        },
        oldGunnyQty: {
            type: Number,
            min: 0,
        },
        plasticGunnyQty: {
            type: Number,
            min: 0,
        },
        truckNo: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
GovtGunnyOutwardSchema.index({ millId: 1, date: -1 })
GovtGunnyOutwardSchema.index({ millId: 1, gunnyDmNumber: 1 })
GovtGunnyOutwardSchema.index({ millId: 1, truckNo: 1 })

// Virtual for formatted date
GovtGunnyOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GovtGunnyOutwardSchema.set('toJSON', { virtuals: true })
GovtGunnyOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
GovtGunnyOutwardSchema.plugin(aggregatePaginate)

export const GovtGunnyOutward = model(
    'GovtGunnyOutward',
    GovtGunnyOutwardSchema
)
