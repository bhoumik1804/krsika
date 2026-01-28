import { z } from 'zod'

/**
 * Zod schemas for authentication validators
 */

// Register schema
export const registerSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(
                /[a-z]/,
                'Password must contain at least one lowercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        phone: z.string().optional(),
        millId: z.string().optional(),
    }),
}

// Login schema
export const loginSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
}

// Refresh token schema
export const refreshTokenSchema = {
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
}

// Change password schema
export const changePasswordSchema = {
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(
                /[a-z]/,
                'Password must contain at least one lowercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
}

// Forgot password schema
export const forgotPasswordSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
    }),
}

// Reset password schema
export const resetPasswordSchema = {
    body: z.object({
        token: z.string().min(1, 'Reset token is required'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(
                /[a-z]/,
                'Password must contain at least one lowercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
}

export default {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
}
