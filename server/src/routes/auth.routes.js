import express from 'express'
import {
    login,
    googleAuth,
    googleCallback,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
} from '../validators/auth.validator.js'

const router = express.Router()

// Public routes
router.post('/login', validate(loginSchema), login)
router.get('/google', googleAuth)
router.get('/google/callback', googleCallback)
router.post('/refresh', refreshToken)

// Protected routes
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)
router.put(
    '/profile',
    authenticate,
    validate(updateProfileSchema),
    updateProfile
)
router.put(
    '/password',
    authenticate,
    validate(changePasswordSchema),
    changePassword
)

export default router
