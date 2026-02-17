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
            trim: true,
        },
        paymentType: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        purchaseDealType: {
            type: String,
            trim: true,
        },
        purchaseDealNumber: {
            type: String,
            trim: true,
        },
        transporterName: {
            type: String,
            trim: true,
        },
        truckNumber: {
            type: String,
            trim: true,
        },
        diesel: {
            type: Number,
            default: 0,
        },
        bhatta: {
            type: Number,
            default: 0,
        },
        repairOrMaintenance: {
            type: Number,
            default: 0,
        },
        labourType: {
            type: String,
            trim: true,
        },
        labourGroupName: {
            type: String,
            trim: true,
        },
        staffName: {
            type: String,
            trim: true,
        },
        salary: {
            type: Number,
            default: 0,
        },
        month: {
            type: String,
            trim: true,
        },
        attendance: {
            type: Number,
            default: 0,
        },
        allowedLeave: {
            type: Number,
            default: 0,
        },
        payableSalary: {
            type: Number,
            default: 0,
        },
        salaryPayment: {
            type: Number,
            default: 0,
        },
        advancePayment: {
            type: Number,
            default: 0,
        },
        remarks: {
            type: String,
            trim: true,
        },
        paymentAmount: {
            type: Number,
            default: 0,
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
