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
