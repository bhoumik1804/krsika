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
        ricePurchaseDealNumber: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        riceType: {
            type: String,
            trim: true,
        },
        balanceInward: {
            type: Number,
            min: 0,
        },
        inwardType: {
            type: String,
            trim: true,
        },
        lotNumber: {
            type: String,
            trim: true,
        },
        frkOrNAN: {
            type: String,
            trim: true,
        },
        gunnyOption: {
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
        juteWeight: {
            type: Number,
            min: 0,
        },
        plasticWeight: {
            type: Number,
            min: 0,
        },
        gunnyWeight: {
            type: Number,
            min: 0,
        },
        truckNumber: {
            type: String,
            trim: true,
        },
        rstNumber: {
            type: String,
            trim: true,
        },
        truckLoadWeight: {
            type: Number,
            min: 0,
        },
        riceMotaNetWeight: {
            type: Number,
            min: 0,
        },
        ricePatlaNetWeight: {
            type: Number,
            min: 0,
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
