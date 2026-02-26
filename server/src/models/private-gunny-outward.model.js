import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Private Gunny Outward Schema
 * Tracks private gunny outward entries for a mill
 */
const PrivateGunnyOutwardSchema = new Schema(
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
        gunnySaleDealNumber: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        newGunnyQty: {
            type: Number,
            min: 0,
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
PrivateGunnyOutwardSchema.index({ millId: 1, date: -1 })
PrivateGunnyOutwardSchema.index({ millId: 1, partyName: 1 })
// Index on deal number (use purchase deal field name)
PrivateGunnyOutwardSchema.index({ millId: 1, gunnySaleDealNumber: 1 })
PrivateGunnyOutwardSchema.index({ millId: 1, truckNo: 1 })

// Virtual for formatted date
PrivateGunnyOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
PrivateGunnyOutwardSchema.set('toJSON', { virtuals: true })
PrivateGunnyOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
PrivateGunnyOutwardSchema.plugin(aggregatePaginate)

export const PrivateGunnyOutward = model(
    'PrivateGunnyOutward',
    PrivateGunnyOutwardSchema
)
