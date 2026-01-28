import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { PAYMENT_MODE, PAYMENT_STATUS } from '../constants/payment-types.js'
import { SALE_TYPE } from '../constants/sale-types.js'

const saleSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        invoiceNumber: {
            type: String,
            required: [true, 'Invoice number is required'],
            trim: true,
        },
        saleDate: {
            type: Date,
            required: [true, 'Sale date is required'],
            index: true,
        },
        saleType: {
            type: String,
            enum: Object.values(SALE_TYPE),
            required: [true, 'Sale type is required'],
        },
        partyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Party',
            required: [true, 'Party is required'],
            index: true,
        },
        brokerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Broker',
            default: null,
        },

        // Stock details
        stockType: {
            type: String,
            required: [true, 'Stock type is required'],
        },
        variety: {
            type: String,
            trim: true,
        },

        // Quantity
        weight: {
            type: Number,
            required: [true, 'Weight is required'],
            min: [0, 'Weight cannot be negative'],
        },
        bags: {
            type: Number,
            min: [0, 'Bags cannot be negative'],
            default: 0,
        },

        // Pricing
        pricePerQuintal: {
            type: Number,
            required: [true, 'Price per quintal is required'],
            min: [0, 'Price cannot be negative'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total amount cannot be negative'],
        },

        // Commission & charges
        brokerCommission: {
            type: Number,
            default: 0,
            min: [0, 'Commission cannot be negative'],
        },
        hamali: {
            type: Number,
            default: 0,
            min: [0, 'Hamali cannot be negative'],
        },
        cartage: {
            type: Number,
            default: 0,
            min: [0, 'Cartage cannot be negative'],
        },
        otherCharges: {
            type: Number,
            default: 0,
        },

        // GST
        gstRate: {
            type: Number,
            default: 0,
            min: [0, 'GST rate cannot be negative'],
        },
        gstAmount: {
            type: Number,
            default: 0,
        },

        // Net amount after all charges
        netAmount: {
            type: Number,
            required: true,
            min: [0, 'Net amount cannot be negative'],
        },

        // Payment details
        paymentMode: {
            type: String,
            enum: Object.values(PAYMENT_MODE),
            default: PAYMENT_MODE.CASH,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },
        receivedAmount: {
            type: Number,
            default: 0,
            min: [0, 'Received amount cannot be negative'],
        },
        pendingAmount: {
            type: Number,
            default: 0,
        },

        // Delivery details
        deliveryOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryOrder',
            default: null,
        },
        vehicleNumber: String,
        transporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transporter',
            default: null,
        },

        // Remarks
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
saleSchema.index({ millId: 1, saleDate: -1 })
saleSchema.index({ millId: 1, partyId: 1 })
saleSchema.index({ millId: 1, paymentStatus: 1 })
saleSchema.index({ createdAt: -1 })

// Compound unique index for invoice number within mill
saleSchema.index({ millId: 1, invoiceNumber: 1 }, { unique: true })

// Plugin for aggregate pagination
saleSchema.plugin(mongooseAggregatePaginate)

// Pre-save hook to calculate amounts
saleSchema.pre('save', function (next) {
    // Calculate GST
    this.gstAmount = (this.totalAmount * this.gstRate) / 100

    // Calculate net amount
    this.netAmount =
        this.totalAmount +
        this.gstAmount -
        this.brokerCommission -
        this.hamali -
        this.cartage -
        this.otherCharges

    // Calculate pending amount
    this.pendingAmount = this.netAmount - this.receivedAmount

    // Update payment status
    if (this.receivedAmount === 0) {
        this.paymentStatus = PAYMENT_STATUS.PENDING
    } else if (this.receivedAmount >= this.netAmount) {
        this.paymentStatus = PAYMENT_STATUS.PAID
    } else {
        this.paymentStatus = PAYMENT_STATUS.PARTIAL
    }

    next()
})

const Sale = mongoose.model('Sale', saleSchema)

export default Sale
