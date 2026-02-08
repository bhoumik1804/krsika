import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * FRK Inward Schema
 * Tracks FRK inward entries for a mill
 */
const FrkInwardSchema = new Schema(
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
        purchaseDealId: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        gunnyPlastic: {
            type: Number,
        },
        plasticWeight: {
            type: Number,
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
        },
        gunnyWeight: {
            type: Number,
        },
        netWeight: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
FrkInwardSchema.index({ millId: 1, date: -1 })
FrkInwardSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
FrkInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FrkInwardSchema.set('toJSON', { virtuals: true })
FrkInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FrkInwardSchema.plugin(aggregatePaginate)

export const FrkInward = model('FrkInward', FrkInwardSchema)
