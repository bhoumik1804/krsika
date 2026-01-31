import { model, Schema } from 'mongoose'

const AuditLogSchema = new Schema(
    {
        millId: { type: Schema.Types.ObjectId, ref: 'Mill' }, // The mill being accessed

        // The actual person performing the action (e.g., The Super Admin)
        actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        // The user being impersonated (e.g., The Mill Admin/Staff)
        impersonatedUserId: { type: Schema.Types.ObjectId, ref: 'User' },

        action: { type: String }, // 'IMPERSONATION_LOGIN', 'DELETE_INVENTORY', etc.

        ipAddress: String,
        userAgent: String,
    },
    { timestamps: true }
)

export const AuditLog = model('AuditLog', AuditLogSchema)
