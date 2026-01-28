/**
 * Staff Validators
 * ================
 * Zod validation schemas for staff operations
 */
import { z } from 'zod'
import { USER_ROLES } from '../../../shared/constants/roles.js'

const staffRoles = [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF]

/**
 * Create staff schema
 */
export const createStaffSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters'),
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
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
            .optional(),
        role: z
            .enum(staffRoles, {
                errorMap: () => ({
                    message: `Role must be one of: ${staffRoles.join(', ')}`,
                }),
            })
            .optional()
            .default(USER_ROLES.MILL_STAFF),
        permissions: z.array(z.string()).optional().default([]),
    }),
})

/**
 * Update staff schema
 */
export const updateStaffSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/)
            .optional()
            .nullable(),
        role: z.enum(staffRoles).optional(),
        permissions: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    }),
})

/**
 * Staff ID param schema
 */
export const staffIdParamSchema = z.object({
    params: z.object({
        staffId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid staff ID'),
    }),
})

/**
 * List staff query schema
 */
export const listStaffQuerySchema = z.object({
    query: z
        .object({
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
            search: z.string().optional(),
            role: z.enum(staffRoles).optional(),
            isActive: z
                .enum(['true', 'false'])
                .transform((v) => v === 'true')
                .optional(),
            sortBy: z
                .enum(['name', 'email', 'role', 'createdAt', 'updatedAt'])
                .optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .optional(),
})

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
    body: z.object({
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
    params: z.object({
        staffId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid staff ID'),
    }),
})

/**
 * Update permissions schema
 */
export const updatePermissionsSchema = z.object({
    body: z.object({
        permissions: z.array(z.string()).min(0),
    }),
    params: z.object({
        staffId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid staff ID'),
    }),
})
