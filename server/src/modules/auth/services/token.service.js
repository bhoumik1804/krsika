import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../../../config/index.js'
import { RefreshToken } from '../../../shared/models/index.js'
import logger from '../../../shared/utils/logger.js'

/**
 * Token Service
 * Handles generation, verification, and management of access and refresh tokens
 */
class TokenService {
    /**
     * Generate short-lived access token (15 minutes)
     * Used for API authentication
     * @param {Object} user - User object
     * @returns {String} Access token
     */
    generateAccessToken(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            millId: user.millId ? user.millId.toString() : null,
            iat: Math.floor(Date.now() / 1000),
        }

        return jwt.sign(payload, config.jwt.accessToken.secret, {
            expiresIn: config.jwt.accessToken.expiresIn,
            algorithm: config.jwt.accessToken.algorithm,
            issuer: config.jwt.accessToken.issuer,
            audience: config.jwt.accessToken.audience,
        })
    }

    /**
     * Generate long-lived refresh token (7 days)
     * Stored in database, used for token renewal
     * @param {Object} user - User object
     * @param {String} deviceInfo - Device information
     * @param {String} ipAddress - IP address
     * @param {String} userAgent - User agent string
     * @returns {Promise<String>} Refresh token
     */
    async generateRefreshToken(
        user,
        deviceInfo = null,
        ipAddress = null,
        userAgent = null
    ) {
        try {
            // Generate cryptographically secure random token
            const token = crypto.randomBytes(64).toString('hex')

            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

            // Store in database
            await RefreshToken.create({
                token,
                userId: user._id,
                deviceInfo,
                ipAddress,
                userAgent,
                expiresAt,
                isRevoked: false,
            })

            logger.debug(`Refresh token generated for user: ${user.email}`)
            return token
        } catch (error) {
            logger.error('Error generating refresh token:', error)
            throw error
        }
    }

    /**
     * Verify and decode access token
     * @param {String} token - Access token
     * @returns {Object|null} Decoded payload or null
     */
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, config.jwt.accessToken.secret, {
                algorithms: [config.jwt.accessToken.algorithm],
                issuer: config.jwt.accessToken.issuer,
                audience: config.jwt.accessToken.audience,
            })
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.debug('Access token expired')
            } else {
                logger.warn('Invalid access token:', error.message)
            }
            return null
        }
    }

    /**
     * Verify refresh token from database
     * @param {String} token - Refresh token
     * @returns {Promise<Object|null>} Token document or null
     */
    async verifyRefreshToken(token) {
        try {
            const storedToken = await RefreshToken.findOne({
                token,
                isRevoked: false,
            }).populate('userId')

            if (!storedToken) {
                logger.warn('Refresh token not found or revoked')
                return null
            }

            if (new Date() > storedToken.expiresAt) {
                logger.warn('Refresh token expired')
                return null
            }

            return storedToken
        } catch (error) {
            logger.error('Error verifying refresh token:', error)
            return null
        }
    }

    /**
     * Revoke a single refresh token (logout from one device)
     * @param {String} token - Refresh token
     * @returns {Promise<void>}
     */
    async revokeRefreshToken(token) {
        try {
            const result = await RefreshToken.updateOne(
                { token },
                { $set: { isRevoked: true, revokedAt: new Date() } }
            )
            logger.info(`Refresh token revoked: ${result.modifiedCount > 0}`)
        } catch (error) {
            logger.error('Error revoking refresh token:', error)
            throw error
        }
    }

    /**
     * Revoke all user's refresh tokens (logout from all devices)
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of tokens revoked
     */
    async revokeAllUserTokens(userId) {
        try {
            const result = await RefreshToken.updateMany(
                { userId, isRevoked: false },
                { $set: { isRevoked: true, revokedAt: new Date() } }
            )
            logger.info(
                `Revoked ${result.modifiedCount} tokens for user: ${userId}`
            )
            return result.modifiedCount
        } catch (error) {
            logger.error('Error revoking all user tokens:', error)
            throw error
        }
    }

    /**
     * Clean up expired and revoked tokens (run via cron job)
     * @returns {Promise<Number>} Number of tokens deleted
     */
    async cleanupExpiredTokens() {
        try {
            const result = await RefreshToken.deleteMany({
                $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
            })
            logger.info(
                `Cleaned up ${result.deletedCount} expired/revoked tokens`
            )
            return result.deletedCount
        } catch (error) {
            logger.error('Error cleaning up tokens:', error)
            throw error
        }
    }

    /**
     * Get user's active sessions
     * @param {String} userId - User ID
     * @returns {Promise<Array>} Array of active sessions
     */
    async getUserSessions(userId) {
        try {
            return await RefreshToken.find({
                userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() },
            })
                .select('deviceInfo ipAddress userAgent createdAt expiresAt')
                .sort({ createdAt: -1 })
                .lean()
        } catch (error) {
            logger.error('Error fetching user sessions:', error)
            throw error
        }
    }

    /**
     * Rotate refresh token (invalidate old, generate new)
     * @param {String} oldToken - Old refresh token
     * @param {Object} user - User object
     * @param {String} deviceInfo - Device information
     * @param {String} ipAddress - IP address
     * @param {String} userAgent - User agent
     * @returns {Promise<String>} New refresh token
     */
    async rotateRefreshToken(oldToken, user, deviceInfo, ipAddress, userAgent) {
        try {
            // Revoke old token
            await this.revokeRefreshToken(oldToken)

            // Generate new token
            const newToken = await this.generateRefreshToken(
                user,
                deviceInfo,
                ipAddress,
                userAgent
            )

            logger.debug(`Refresh token rotated for user: ${user.email}`)
            return newToken
        } catch (error) {
            logger.error('Error rotating refresh token:', error)
            throw error
        }
    }
}

export default new TokenService()
