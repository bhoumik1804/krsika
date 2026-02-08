import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Gunny Inward Schema
 * Tracks gunny inward entries for a mill
 */
const GunnyInwardSchema = new Schema(
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
        purchaseDealId: {
            type: String,
            trim: true,
        },
        delivery: {
            type: String,
            trim: true,
        },
        samitiSangrahan: {
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
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
GunnyInwardSchema.index({ millId: 1, date: -1 })
GunnyInwardSchema.index({ millId: 1, partyName: 1 })
GunnyInwardSchema.index({ millId: 1, gunnyType: 1 })

// Virtual for formatted date
GunnyInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GunnyInwardSchema.set('toJSON', { virtuals: true })
GunnyInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
GunnyInwardSchema.plugin(aggregatePaginate)

export const GunnyInward = model('GunnyInward', GunnyInwardSchema)
