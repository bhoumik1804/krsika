import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Payment Schema
 * Tracks daily payment entries for a mill
 */
const DailyPaymentSchema = new Schema(
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
        voucherNumber: {
            type: String,
            required: true,
            trim: true,
        },
        partyName: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMode: {
            type: String,
            enum: ['Cash', 'Bank', 'Cheque', 'UPI'],
            required: true,
        },
        purpose: {
            type: String,
            required: true,
            trim: true,
        },
        referenceNumber: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled', 'failed'],
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
DailyPaymentSchema.index({ millId: 1, date: -1 })
DailyPaymentSchema.index({ millId: 1, status: 1, date: -1 })
DailyPaymentSchema.index({ millId: 1, partyName: 1 })
DailyPaymentSchema.index({ millId: 1, voucherNumber: 1 })
DailyPaymentSchema.index({ millId: 1, paymentMode: 1, date: -1 })

// Virtual for formatted date
DailyPaymentSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
DailyPaymentSchema.set('toJSON', { virtuals: true })
DailyPaymentSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
DailyPaymentSchema.plugin(aggregatePaginate)

export const DailyPayment = model('DailyPayment', DailyPaymentSchema)
