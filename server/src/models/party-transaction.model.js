import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Party Transaction Schema
 * Tracks party transaction entries for a mill
 */
const PartyTransactionSchema = new Schema(
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
PartyTransactionSchema.index({ millId: 1, date: -1 })
PartyTransactionSchema.index({ millId: 1, partyName: 1 })
PartyTransactionSchema.index({ millId: 1, transactionType: 1, date: -1 })
PartyTransactionSchema.index({ millId: 1, partyName: 1, date: -1 })

// Virtual for formatted date
PartyTransactionSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
PartyTransactionSchema.set('toJSON', { virtuals: true })
PartyTransactionSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
PartyTransactionSchema.plugin(aggregatePaginate)

export const PartyTransaction = model(
    'PartyTransaction',
    PartyTransactionSchema
)
