import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Stock Overview Schema
 * Tracks stock overview entries for a mill
 */
const StockOverviewSchema = new Schema(
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
        rate: {
            type: Number,
            required: true,
            min: 0,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
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
StockOverviewSchema.index({ millId: 1, date: -1 })
StockOverviewSchema.index({ millId: 1, status: 1, date: -1 })
StockOverviewSchema.index({ millId: 1, partyName: 1 })

// Virtual for formatted date
StockOverviewSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
StockOverviewSchema.set('toJSON', { virtuals: true })
StockOverviewSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
StockOverviewSchema.plugin(aggregatePaginate)

export const StockOverview = model('StockOverview', StockOverviewSchema)
