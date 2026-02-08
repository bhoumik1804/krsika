import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * FRK Outward Schema
 * Tracks FRK outward entries for a mill
 */
const FrkOutwardSchema = new Schema(
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
        gunnyPlastic: {
            type: Number,
            min: 0,
        },
        plasticWeight: {
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
FrkOutwardSchema.index({ millId: 1, date: -1 })
FrkOutwardSchema.index({ millId: 1, partyName: 1 })
FrkOutwardSchema.index({ millId: 1, truckNo: 1 })

// Virtual for formatted date
FrkOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FrkOutwardSchema.set('toJSON', { virtuals: true })
FrkOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FrkOutwardSchema.plugin(aggregatePaginate)

export const FrkOutward = model('FrkOutward', FrkOutwardSchema)
