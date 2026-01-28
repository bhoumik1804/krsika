import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        deviceInfo: {
            type: String,
            default: null,
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
            // TTL index is defined separately below
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// TTL index - MongoDB will automatically delete expired tokens after expiration
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Compound index for faster lookups
refreshTokenSchema.index({ userId: 1, isRevoked: 1 })

// Instance method to revoke token
refreshTokenSchema.methods.revoke = async function () {
    this.isRevoked = true
    this.revokedAt = new Date()
    return await this.save()
}

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = async function (userId) {
    return await this.updateMany(
        { userId, isRevoked: false },
        { $set: { isRevoked: true, revokedAt: new Date() } }
    )
}

// Static method to cleanup expired tokens manually (if TTL index is disabled)
refreshTokenSchema.statics.cleanupExpired = async function () {
    return await this.deleteMany({ expiresAt: { $lt: new Date() } })
}

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken
