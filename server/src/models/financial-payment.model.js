import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Financial Payment Schema
 * Tracks financial payment entries for a mill
 */
const FinancialPaymentSchema = new Schema(
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
        paymentMode: {
            type: String,
            enum: ['Cash', 'Bank', 'Cheque', 'UPI'],
            trim: true,
        },
        bank: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        narration: {
            type: String,
            trim: true,
        },
        accountHead: {
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
FinancialPaymentSchema.index({ millId: 1, date: -1 })
FinancialPaymentSchema.index({ millId: 1, partyName: 1 })
FinancialPaymentSchema.index({ millId: 1, paymentMode: 1, date: -1 })
FinancialPaymentSchema.index({ millId: 1, accountHead: 1 })

// Virtual for formatted date
FinancialPaymentSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FinancialPaymentSchema.set('toJSON', { virtuals: true })
FinancialPaymentSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FinancialPaymentSchema.plugin(aggregatePaginate)

export const FinancialPayment = model(
    'FinancialPayment',
    FinancialPaymentSchema
)
