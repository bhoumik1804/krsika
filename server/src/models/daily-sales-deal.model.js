import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Sales Deal Schema
 * Tracks daily sales deals for a mill
 */
const DailySalesDealSchema = new Schema(
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
        buyerName: {
            type: String,
            required: true,
            trim: true,
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
        transporterName: {
            type: String,
            trim: true,
        },
        freightAmount: {
            type: Number,
            min: 0,
            default: 0,
        },
        advanceReceived: {
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
            enum: ['pending', 'partial', 'received', 'cancelled'],
            default: 'pending',
            index: true,
        },
        status: {
            type: String,
            enum: ['open', 'dispatched', 'delivered', 'closed', 'cancelled'],
            default: 'open',
            index: true,
        },
        paymentTerms: {
            type: String,
            trim: true,
        },
        deliveryAddress: {
            type: String,
            trim: true,
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
DailySalesDealSchema.index({ millId: 1, date: -1 })
DailySalesDealSchema.index({ millId: 1, paymentStatus: 1, date: -1 })
DailySalesDealSchema.index({ millId: 1, status: 1, date: -1 })
DailySalesDealSchema.index({ millId: 1, buyerName: 1 })
DailySalesDealSchema.index({ millId: 1, commodity: 1 })
DailySalesDealSchema.index({ millId: 1, brokerName: 1 })
DailySalesDealSchema.index({ millId: 1, transporterName: 1 })

// Virtual for formatted date
DailySalesDealSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
DailySalesDealSchema.set('toJSON', { virtuals: true })
DailySalesDealSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailySalesDealSchema.plugin(aggregatePaginate)

export const DailySalesDeal = model('DailySalesDeal', DailySalesDealSchema)
