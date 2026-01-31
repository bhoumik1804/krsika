import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Purchase Deal Schema
 * Tracks daily purchase deals for a mill
 */
const DailyPurchaseDealSchema = new Schema(
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
        farmerName: {
            type: String,
            required: true,
            trim: true,
        },
        commodity: {
            type: String,
            required: true,
            trim: true,
        },
        commodityType: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            required: true,
            trim: true,
        },
        rate: {
            type: Number,
            required: true,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        brokerCommission: {
            type: Number,
            min: 0,
            default: 0,
        },
        advanceAmount: {
            type: Number,
            min: 0,
            default: 0,
        },
        balanceAmount: {
            type: Number,
            min: 0,
            default: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid', 'cancelled'],
            default: 'pending',
            index: true,
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'cancelled'],
            default: 'open',
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
DailyPurchaseDealSchema.index({ millId: 1, date: -1 })
DailyPurchaseDealSchema.index({ millId: 1, paymentStatus: 1, date: -1 })
DailyPurchaseDealSchema.index({ millId: 1, status: 1, date: -1 })
DailyPurchaseDealSchema.index({ millId: 1, farmerName: 1 })
DailyPurchaseDealSchema.index({ millId: 1, commodity: 1 })
DailyPurchaseDealSchema.index({ millId: 1, brokerName: 1 })

// Virtual for formatted date
DailyPurchaseDealSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
DailyPurchaseDealSchema.set('toJSON', { virtuals: true })
DailyPurchaseDealSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailyPurchaseDealSchema.plugin(aggregatePaginate)

export const DailyPurchaseDeal = model(
    'DailyPurchaseDeal',
    DailyPurchaseDealSchema
)
