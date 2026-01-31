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
            type: String,
            enum: ['PENDING', 'VERIFIED', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },

        invoiceUrl: String,
    },
    { timestamps: true }
)
