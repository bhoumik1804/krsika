import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Govt Rice Outward Schema
 * Tracks government rice outward entries for a mill
 */
const GovtRiceOutwardSchema = new Schema(
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
        lotNo: {
            type: String,
            trim: true,
        },
        fciNan: {
            type: String,
            trim: true,
        },
        riceType: {
            type: String,
            trim: true,
        },
        gunnyNew: {
            type: Number,
            min: 0,
            default: 0,
        },
        gunnyOld: {
            type: Number,
            min: 0,
            default: 0,
        },
        juteWeight: {
            type: Number,
            min: 0,
            default: 0,
        },
        truckNo: {
            type: String,
            trim: true,
            uppercase: true,
        },
        truckRst: {
            type: String,
            trim: true,
        },
        truckWeight: {
            type: Number,
            min: 0,
            default: 0,
        },
        gunnyWeight: {
            type: Number,
            min: 0,
            default: 0,
        },
        netWeight: {
            type: Number,
            min: 0,
            default: 0,
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
GovtRiceOutwardSchema.index({ millId: 1, date: -1 })
GovtRiceOutwardSchema.index({ millId: 1, lotNo: 1 })
GovtRiceOutwardSchema.index({ millId: 1, riceType: 1, date: -1 })
GovtRiceOutwardSchema.index({ millId: 1, truckNo: 1 })

// Virtual for formatted date
GovtRiceOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GovtRiceOutwardSchema.set('toJSON', { virtuals: true })
GovtRiceOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
GovtRiceOutwardSchema.plugin(aggregatePaginate)

export const GovtRiceOutward = model('GovtRiceOutward', GovtRiceOutwardSchema)
