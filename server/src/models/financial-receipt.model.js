import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Financial Receipt Schema
 * Tracks financial receipt entries for a mill
 */
const FinancialReceiptSchema = new Schema(
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
        receiptMode: {
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
FinancialReceiptSchema.index({ millId: 1, date: -1 })
FinancialReceiptSchema.index({ millId: 1, partyName: 1 })
FinancialReceiptSchema.index({ millId: 1, receiptMode: 1, date: -1 })
FinancialReceiptSchema.index({ millId: 1, accountHead: 1 })

// Virtual for formatted date
FinancialReceiptSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
FinancialReceiptSchema.set('toJSON', { virtuals: true })
FinancialReceiptSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
FinancialReceiptSchema.plugin(aggregatePaginate)

export const FinancialReceipt = model(
    'FinancialReceipt',
    FinancialReceiptSchema
)
