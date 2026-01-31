import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Inward Schema
 * Tracks daily inward entries for a mill
 */
const DailyInwardSchema = new Schema(
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
            enum: ['pending', 'completed', 'verified', 'rejected'],
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
DailyInwardSchema.index({ millId: 1, date: -1 })
DailyInwardSchema.index({ millId: 1, status: 1, date: -1 })
DailyInwardSchema.index({ millId: 1, partyName: 1 })
DailyInwardSchema.index({ millId: 1, gatePassNumber: 1 })

// Virtual for formatted date
DailyInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
DailyInwardSchema.set('toJSON', { virtuals: true })
DailyInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailyInwardSchema.plugin(aggregatePaginate)

export const DailyInward = model('DailyInward', DailyInwardSchema)
