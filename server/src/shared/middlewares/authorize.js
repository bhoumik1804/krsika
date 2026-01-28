import { USER_ROLES } from '../constants/roles.js'
import ApiError from '../utils/api-error.js'

/**
 * Check if user has required role(s)
 * @param  {...String} allowedRoles - Roles that are allowed
 * @returns {Function} Middleware function
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required')
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw ApiError.forbidden('Access denied. Insufficient permissions.')
        }

        next()
    }
}

/**
 * Check if user is super admin
 */
export const requireSuperAdmin = authorize(USER_ROLES.SUPER_ADMIN)

/**
 * Check if user is mill admin
 */
export const requireMillAdmin = authorize(
    USER_ROLES.MILL_ADMIN,
    USER_ROLES.SUPER_ADMIN
)

/**
 * Check if user is mill staff or admin
 */
export const requireMillStaff = authorize(
    USER_ROLES.MILL_STAFF,
    USER_ROLES.MILL_ADMIN,
    USER_ROLES.SUPER_ADMIN
)

/**
 * Check if user belongs to the same mill
 * @param {Function} getMillId - Function to extract millId from request
 */
export const requireSameMill = (getMillId) => {
    return (req, res, next) => {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required')
        }

        // Super admin can access all mills
        if (req.user.role === USER_ROLES.SUPER_ADMIN) {
            return next()
        }

        const millId = getMillId(req)
        const userMillId = req.user.millId?._id || req.user.millId

        if (!millId || millId.toString() !== userMillId.toString()) {
            throw ApiError.forbidden(
                'Access denied. You can only access your own mill data.'
            )
        }

        next()
    }
}

/**
 * Check if user is owner of resource
 * @param {Function} getOwnerId - Function to extract owner ID from request
 */
export const requireOwnership = (getOwnerId) => {
    return (req, res, next) => {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required')
        }

        // Super admin can access all resources
        if (req.user.role === USER_ROLES.SUPER_ADMIN) {
            return next()
        }

        const ownerId = getOwnerId(req)
        const userId = req.user._id || req.user.id

        if (!ownerId || ownerId.toString() !== userId.toString()) {
            throw ApiError.forbidden(
                'Access denied. You can only access your own resources.'
            )
        }

        next()
    }
}

export default {
    authorize,
    requireSuperAdmin,
    requireMillAdmin,
    requireMillStaff,
    requireSameMill,
    requireOwnership,
}
