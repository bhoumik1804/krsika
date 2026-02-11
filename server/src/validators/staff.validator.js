import { z } from 'zod'

/**
 * Staff Validators
 * Zod schemas for staff request validation (Mill Admin operations)
 */

// Create staff schema - minimal fields, rest handled by User model
export const createStaffSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
    }),
    body: z.object({
        fullName: z
            .string({ required_error: 'Full name is required' })
            .trim()
            .min(2, 'Full name must be at least 2 characters')
            .max(100, 'Full name must be at most 100 characters'),
        email: z
            .string({ required_error: 'Email is required' })
            .trim()
            .email('Invalid email format')
            .max(255, 'Email is too long'),
        phoneNumber: z
            .string()
            .trim()
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .optional(),
        role: z.string().optional(),
        post: z.string().optional(),
        salary: z.union([z.number(), z.string()]).optional(),
        address: z.string().optional(),
        permissions: z.array(z.object({
            moduleSlug: z.string(),
            actions: z.array(z.string())
        })).optional(),
        isActive: z.boolean().default(true).optional(),
    }),
    query: z.record(z.any()).optional().default({}),
})

// Update staff schema
export const updateStaffSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
        id: z.string().min(1, 'Staff ID is required'),
    }),
    body: z.object({
        fullName: z
            .string()
            .trim()
            .min(2, 'Full name must be at least 2 characters')
            .max(100, 'Full name must be at most 100 characters')
            .optional(),
        email: z
            .string()
            .trim()
            .email('Invalid email format')
            .max(255, 'Email is too long')
            .optional(),
        phoneNumber: z
            .string()
            .trim()
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits')
            .optional()
            .or(z.literal('')),
        role: z.string().optional(),
        post: z.string().optional(),
        salary: z.union([z.number(), z.string()]).optional(),
        address: z.string().optional(),
        permissions: z.array(z.object({
            moduleSlug: z.string(),
            actions: z.array(z.string())
        })).optional(),
        isActive: z.boolean().optional(),
    }),
    query: z.record(z.any()).optional(),
})

// Get staff by ID schema
export const getStaffByIdSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
        id: z.string().min(1, 'Staff ID is required'),
    }),
    query: z.record(z.any()).optional(),
})

// Delete staff schema
export const deleteStaffSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
        id: z.string().min(1, 'Staff ID is required'),
    }),
    query: z.record(z.any()).optional(),
})

// List staff schema
export const listStaffSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
    }),
    query: z.record(z.any()).optional(),
    body: z.record(z.any()).optional(),
})

// Staff summary schema
export const staffSummarySchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
    }),
    query: z.record(z.any()).optional(),
})

// Bulk delete staff schema
export const bulkDeleteStaffSchema = z.object({
    params: z.object({
        millId: z.string().min(1, 'Mill ID is required'),
    }),
    body: z.object({
        ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
    }),
})
