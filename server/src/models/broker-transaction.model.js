import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Broker Transaction Schema
 * Tracks broker transaction entries for a mill
 */
const BrokerTransactionSchema = new Schema(
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
        brokerName: {
            type: String,
            required: true,
            trim: true,
        },
        transactionType: {
            type: String,
            enum: ['debit', 'credit'],
            required: true,
            trim: true,
        },
        debit: {
            type: Number,
            min: 0,
            default: 0,
        },
        credit: {
            type: Number,
            min: 0,
            default: 0,
        },
        balance: {
            type: Number,
            default: 0,
        },
        narration: {
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
BrokerTransactionSchema.index({ millId: 1, date: -1 })
BrokerTransactionSchema.index({ millId: 1, brokerName: 1 })
BrokerTransactionSchema.index({ millId: 1, transactionType: 1, date: -1 })
BrokerTransactionSchema.index({ millId: 1, brokerName: 1, date: -1 })

// Virtual for formatted date
BrokerTransactionSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
BrokerTransactionSchema.set('toJSON', { virtuals: true })
BrokerTransactionSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
BrokerTransactionSchema.plugin(aggregatePaginate)

export const BrokerTransaction = model(
    'BrokerTransaction',
    BrokerTransactionSchema
)
