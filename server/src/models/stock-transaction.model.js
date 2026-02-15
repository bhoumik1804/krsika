import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Stock Transaction Schema
 * Centralized model to track ALL stock movements across the mill
 * Supports date-wise history and efficient querying
 */
const StockTransactionSchema = new Schema(
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
        commodity: {
            type: String,
            required: true,
            trim: true,
            index: true,
            // Examples: Paddy, Rice, FRK, Gunny, Khanda, Bhusa, Nakkhi, Koda, etc.
        },
        variety: {
            type: String,
            trim: true,
            index: true,
            // Examples: Mota, Patla, Sarna, Mahamaya, RB GOLD, New, Old, Plastic, etc.
        },
        type: {
            type: String,
            enum: ['CREDIT', 'DEBIT'],
            required: true,
            index: true,
            // CREDIT = Stock Increase (Purchase, Inward, Production Output)
            // DEBIT = Stock Decrease (Sale, Outward, Production Input, Milling)
        },
        action: {
            type: String,
            required: true,
            trim: true,
            index: true,
            // Examples: Purchase, Sale, Inward, Outward, Production, Milling, etc.
        },
        quantity: {
            type: Number,
            required: true,
            // Quantity in Quintals (Qtl)
        },
        bags: {
            type: Number,
            default: 0,
            // Number of bags
        },
        refModel: {
            type: String,
            trim: true,
            // Reference model name: PaddyPurchase, RiceSale, DailyInward, etc.
        },
        refId: {
            type: Schema.Types.ObjectId,
            // Reference to the original transaction document
        },
        remarks: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Compound indexes for optimized queries
StockTransactionSchema.index({ millId: 1, date: -1 })
StockTransactionSchema.index({ millId: 1, commodity: 1, date: -1 })
StockTransactionSchema.index({ millId: 1, commodity: 1, variety: 1, date: -1 })
StockTransactionSchema.index({ millId: 1, type: 1, date: -1 })
StockTransactionSchema.index({ millId: 1, action: 1, date: -1 })
StockTransactionSchema.index({ refModel: 1, refId: 1 })

// Virtual for formatted date
StockTransactionSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Add aggregate pagination plugin
StockTransactionSchema.plugin(aggregatePaginate)

export const StockTransaction = model(
    'StockTransaction',
    StockTransactionSchema
)
