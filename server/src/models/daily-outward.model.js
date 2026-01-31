import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Outward Schema
 * Tracks daily outward entries for a mill
 */
const DailyOutwardSchema = new Schema(
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
        gatePassNumber: {
            type: String,
            required: true,
            trim: true,
        },
        partyName: {
            type: String,
            required: true,
            trim: true,
        },
        item: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        bags: {
            type: Number,
            required: true,
            min: 0,
        },
        weight: {
            type: Number,
            required: true,
            min: 0,
        },
        driverName: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'dispatched', 'cancelled'],
            default: 'pending',
            index: true,
        },
        remarks: {
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
DailyOutwardSchema.index({ millId: 1, date: -1 })
DailyOutwardSchema.index({ millId: 1, status: 1, date: -1 })
DailyOutwardSchema.index({ millId: 1, partyName: 1 })
DailyOutwardSchema.index({ millId: 1, gatePassNumber: 1 })

// Virtual for formatted date
DailyOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
DailyOutwardSchema.set('toJSON', { virtuals: true })
DailyOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailyOutwardSchema.plugin(aggregatePaginate)

export const DailyOutward = model('DailyOutward', DailyOutwardSchema)
