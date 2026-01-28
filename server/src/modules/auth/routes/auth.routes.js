import express from 'express'
import {
    authenticate,
    authenticateLocal,
} from '../../../shared/middlewares/authenticate.js'
import { authLimiter } from '../../../shared/middlewares/rate-limiter.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import * as authController from '../controllers/auth.controller.js'
import * as authValidator from '../validators/auth.validator.js'

const router = express.Router()

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    authLimiter,
    validateRequest(authValidator.registerSchema),
    authController.register
)

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    authLimiter,
    validateRequest(authValidator.loginSchema),
    authenticateLocal,
    authController.login
)

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
    '/refresh',
    validateRequest(authValidator.refreshTokenSchema),
    authController.refreshAccessToken
)

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout)

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', authenticate, authController.logoutAll)

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile)

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile)

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
    '/change-password',
    authenticate,
    validateRequest(authValidator.changePasswordSchema),
    authController.changePassword
)

/**
 * @route   GET /api/v1/auth/sessions
 * @desc    Get active sessions
 * @access  Private
 */
router.get('/sessions', authenticate, authController.getSessions)

export default router
