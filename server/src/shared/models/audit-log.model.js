import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: [true, 'Action is required'],
            enum: [
                'CREATE',
                'UPDATE',
                'DELETE',
                'LOGIN',
                'LOGOUT',
                'VIEW',
                'EXPORT',
                'IMPORT',
                'OTHER',
            ],
        },
        entity: {
            type: String,
            required: [true, 'Entity is required'],
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        changes: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        ipAddress: String,
        userAgent: String,
        timestamp: {
            type: Date,
            default: Date.now,
            // TTL index is defined separately below
        },
    },
    {
        timestamps: false,
    }
)

// Indexes for efficient querying
auditLogSchema.index({ millId: 1, timestamp: -1 })
auditLogSchema.index({ userId: 1, timestamp: -1 })
auditLogSchema.index({ entity: 1, entityId: 1 })

// TTL index - auto delete logs older than 90 days
auditLogSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 }
)

const AuditLog = mongoose.model('AuditLog', auditLogSchema)

export default AuditLog
