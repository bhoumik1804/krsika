import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Rice Inward Schema
 * Tracks rice inward entries for a mill
 */
const RiceInwardSchema = new Schema(
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
        truckNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        riceGunny: {
            type: Number,
            min: 0,
        },
        frk: {
            type: Number,
            min: 0,
        },
        sampleWeight: {
            type: Number,
            min: 0,
        },
        grossWeight: {
            type: Number,
            min: 0,
        },
        tareWeight: {
            type: Number,
            min: 0,
        },
        netWeight: {
            type: Number,
            min: 0,
        },
        brokerName: {
            type: String,
            trim: true,
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
RiceInwardSchema.index({ millId: 1, date: -1 })
RiceInwardSchema.index({ millId: 1, partyName: 1 })
RiceInwardSchema.index({ millId: 1, brokerName: 1 })
RiceInwardSchema.index({ millId: 1, riceType: 1 })
RiceInwardSchema.index({ millId: 1, truckNumber: 1 })

// Virtual for formatted date
RiceInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
RiceInwardSchema.set('toJSON', { virtuals: true })
RiceInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
RiceInwardSchema.plugin(aggregatePaginate)

export const RiceInward = model('RiceInward', RiceInwardSchema)
