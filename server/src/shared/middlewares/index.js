/**
 * Central export for all middlewares
 */

export {
    authenticate,
    authenticateLocal,
    optionalAuth,
} from './authenticate.js'
export {
    authorize,
    requireSuperAdmin,
    requireMillAdmin,
    requireMillStaff,
    requireSameMill,
    requireOwnership,
} from './authorize.js'
export { enhancedErrorHandler as errorHandler } from './error-handler.js'
export { notFound } from './not-found.js'
export { validateRequest } from './validate-request.js'
export {
    generalLimiter,
    authLimiter,
    apiLimiter,
    createLimiter,
} from './rate-limiter.js'
export { helmetConfig, corsConfig, mongoSanitizeConfig } from './security.js'

export default {
    authenticate,
    authenticateLocal,
    optionalAuth,
    authorize,
    requireSuperAdmin,
    requireMillAdmin,
    requireMillStaff,
    requireSameMill,
    requireOwnership,
    errorHandler: enhancedErrorHandler,
    notFound,
    validateRequest,
    generalLimiter,
    authLimiter,
    apiLimiter,
    createLimiter,
    helmetConfig,
    corsConfig,
    mongoSanitizeConfig,
}

// Note: Import this way in your code:
// import { authenticate, authorize } from './middlewares/index.js';
