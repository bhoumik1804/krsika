import { z } from 'zod'
import { MODULE_SLUGS } from '../constants/module.slugs.enum.js'
import { PERMISSION_ACTIONS } from '../constants/permission.actions.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'

/**
 * Users Validators (Super Admin)
 * Zod schemas for request validation
 */

// Permission schema
const permissionSchema = z.object({
    moduleSlug: z.enum(Object.values(MODULE_SLUGS), {
        errorMap: () => ({
            message: 'Invalid module slug',
        }),
    }),
    actions: z.array(
        z.enum(Object.values(PERMISSION_ACTIONS), {
            errorMap: () => ({
                message: 'Invalid permission action',
            }),
        })
    ),
})

// Create user schema
export const createUserSchema = z.object({
    body: z.object({
        fullName: z
            .string({ required_error: 'Full name is required' })
            .trim()
            .min(1, 'Full name cannot be empty')
            .max(200, 'Full name is too long'),
        email: z
            .string({ required_error: 'Email is required' })
            .trim()
            .email('Invalid email format')
            .max(255, 'Email is too long'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password is too long')
            .optional(),
        role: z.enum(Object.values(ROLES), {
            required_error: 'Role is required',
            errorMap: () => ({
                message: 'Invalid user role',
            }),
        }),
        millId: z.string().optional(),
        permissions: z.array(permissionSchema).optional(),
        isActive: z.boolean().optional(),
    }),
})

// Update user schema
export const updateUserSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(1).max(200).optional(),
        email: z.string().trim().email().max(255).optional(),
        password: z.string().min(8).max(128).optional(),
        role: z.enum(Object.values(ROLES)).optional(),
        millId: z.string().nullable().optional(),
        permissions: z.array(permissionSchema).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'User ID is required' }),
    }),
})

// Get user by ID schema
export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'User ID is required' }),
    }),
})

// Delete user schema
export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'User ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteUsersSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string(), { required_error: 'IDs array is required' })
            .min(1, 'At least one ID is required'),
    }),
})

// List query params schema
export const listUsersSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        role: z.enum(Object.values(ROLES)).optional(),
        isActive: z.coerce.boolean().optional(),
        millId: z.string().optional(),
        sortBy: z
            .enum(['fullName', 'email', 'role', 'createdAt', 'lastLogin'])
            .default('createdAt')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryUsersSchema = z.object({})

// Invite user schema
export const inviteUserSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .trim()
            .email('Invalid email format')
            .max(255, 'Email is too long'),
        role: z.enum(Object.values(ROLES), {
            required_error: 'Role is required',
            errorMap: () => ({
                message: 'Invalid user role',
            }),
        }),
        millId: z.string().optional(),
    }),
})

// Suspend/Reactivate user schema
export const userActionSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'User ID is required' }),
    }),
})
