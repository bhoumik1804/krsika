import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { PAYMENT_MODE } from '../constants/payment-types.js'
import { TRANSACTION_TYPE } from '../constants/transaction-types.js'

const receiptSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        receiptNumber: {
            type: String,
            required: [true, 'Receipt number is required'],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            index: true,
        },
        transactionType: {
            type: String,
            enum: Object.values(TRANSACTION_TYPE),
            required: [true, 'Transaction type is required'],
        },
        partyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Party',
            default: null,
        },
        brokerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Broker',
            default: null,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        paymentMode: {
            type: String,
            enum: Object.values(PAYMENT_MODE),
            default: PAYMENT_MODE.CASH,
        },
        chequeNumber: String,
        chequeDate: Date,
        bankName: String,
        notes: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes
receiptSchema.index({ millId: 1, date: -1 })
receiptSchema.index({ millId: 1, receiptNumber: 1 }, { unique: true })

// Plugin
receiptSchema.plugin(mongooseAggregatePaginate)

const Receipt = mongoose.model('Receipt', receiptSchema)

export default Receipt
