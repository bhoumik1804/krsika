import { Schema } from 'mongoose'
import { PAYMENT_STAUS } from '../constants/subscription.payment.status.enum.js'

const PaymentSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            index: true,
        },
        subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' }, // Links payment to specific plan period
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },

        date: { type: Date, default: Date.now },
        referenceId: { type: String }, // Bank Transaction ID / Stripe ID
        paymentMethod: { type: String }, // 'BANK_TRANSFER', 'UPI', 'CARD'

        verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Super Admin who verified
        status: {
            // payment status
            type: String,
            enum: Object.values(PAYMENT_STAUS),
            default: PAYMENT_STAUS.PENDING,
        },

        invoiceUrl: String,
    },
    { timestamps: true }
)
