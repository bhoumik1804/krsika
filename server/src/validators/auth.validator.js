import { z } from 'zod'
import { createMillSchema } from './mills.validator.js'

export const signupSchema = z.object({
    body: z.object({
        fullName: z
            .string({ required_error: 'Full name is required' })
            .trim()
            .min(1, 'Full name cannot be empty')
            .max(100, 'Full name is too long'),
        email: z.email('Invalid email address'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters long')
            .max(100, 'Password is too long'),
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email address'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(1, 'Password cannot be empty'),
    }),
})

export const updateProfileSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(1, 'Name cannot be empty').optional(),
        email: z.string().email('Invalid email address').optional(),
        avatar: z.string().url('Avatar must be a valid URL').optional(),
    }),
})

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z
            .string({ required_error: 'Current password is required' })
            .min(1, 'Current password cannot be empty'),
        newPassword: z
            .string({ required_error: 'New password is required' })
            .min(6, 'New password must be at least 6 characters long'),
    }),
})

export const registerMillSchema = createMillSchema
