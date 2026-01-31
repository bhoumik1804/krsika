import { model, Schema } from 'mongoose'

const PlanSchema = new Schema(
    {
        name: { type: String, required: true, unique: true }, // e.g., 'Basic', 'Pro', 'Enterprise'
        code: { type: String, required: true, unique: true, uppercase: true }, // 'FREE', 'PREMIUM', 'ENTERPRISE'
        price: {
            monthly: { type: Number, default: 0 },
            yearly: { type: Number, default: 0 },
        },
        // Feature list for display and logic
        features: [{ type: String }], // e.g. ["Unlimited Users", "Advanced Reporting"]
        // Specific limits enforcement
        limits: [{ type: String }], // e.g. ["max_users:10", "max_storage:100GB"]
        appearanceOrder: { type: Number, default: 0 }, // For sorting plans in UI
        isPopular: { type: Boolean, default: false }, // Highlighted plan in UI
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const Plan = model('Plan', PlanSchema)
