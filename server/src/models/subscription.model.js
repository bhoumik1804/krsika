import { Schema } from 'mongoose'
import { SUBSCRIPTION_BILLING_CYCLE } from '../constants/subscription.billing.cycle.enum.js'
import { SUBSCRIPTION_STATUS } from '../constants/subscription.status.enum.js'

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
            // subscription status
            type: String,
            enum: Object.values(SUBSCRIPTION_STATUS),
            default: SUBSCRIPTION_STATUS.ACTIVE,
        },

        billingCycle: {
            type: String,
            enum: Object.values(SUBSCRIPTION_BILLING_CYCLE),
        },
        price: { type: Number, default: 0 }, // Snapshot of price at time of subscription
    },
    { timestamps: true }
)
