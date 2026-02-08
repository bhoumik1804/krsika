import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Private Paddy Outward Schema
 * Tracks private paddy outward entries for a mill
 */
const PrivatePaddyOutwardSchema = new Schema(
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

        paddySaleDealNumber: {
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

        paddyType: {
            type: String,
            trim: true,
        },

        doQty: {
            type: Number,
            min: 0,
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

        truckNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },

        rstNumber: {
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
PrivatePaddyOutwardSchema.index({ millId: 1, date: -1 })
PrivatePaddyOutwardSchema.index({ millId: 1, paddySaleDealNumber: 1 })
PrivatePaddyOutwardSchema.index({ millId: 1, partyName: 1 })
PrivatePaddyOutwardSchema.index({ millId: 1, brokerName: 1 })
PrivatePaddyOutwardSchema.index({ millId: 1, paddyType: 1 })
PrivatePaddyOutwardSchema.index({ millId: 1, truckNumber: 1 })

// Virtual for formatted date
PrivatePaddyOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
PrivatePaddyOutwardSchema.set('toJSON', { virtuals: true })
PrivatePaddyOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
PrivatePaddyOutwardSchema.plugin(aggregatePaginate)

export const PrivatePaddyOutward = model(
    'PrivatePaddyOutward',
    PrivatePaddyOutwardSchema
)
