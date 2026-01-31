const SubscriptionSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },

        // References the dynamic Plan model
        planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },

        startDate: { type: Date, default: Date.now },
        endDate: { type: Date }, // Null if lifetime/recurring not set

        status: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED', 'CANCELED', 'UPGRADED'],
            default: 'ACTIVE',
        },

        billingCycle: {
            type: String,
            enum: ['MONTHLY', 'YEARLY', 'ONE_TIME'],
        },
        price: { type: Number, default: 0 }, // Snapshot of price at time of subscription
    },
    { timestamps: true }
)
