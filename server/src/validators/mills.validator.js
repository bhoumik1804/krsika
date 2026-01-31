import { z } from 'zod'
import { MILL_STATUS } from '../constants/mill.status.enum.js'

/**
 * Mills Validators (Super Admin)
 * Zod schemas for request validation
 */

// Mill info schema
const millInfoSchema = z.object({
    gstNumber: z
        .string({ required_error: 'GST number is required' })
        .trim()
        .min(15, 'GST number must be 15 characters')
        .max(15, 'GST number must be 15 characters'),
    panNumber: z
        .string({ required_error: 'PAN number is required' })
        .trim()
        .min(10, 'PAN number must be 10 characters')
        .max(10, 'PAN number must be 10 characters'),
})

// Mill contact schema
const millContactSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email format')
        .max(255, 'Email is too long'),
    phone: z
        .string({ required_error: 'Phone number is required' })
        .trim()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number is too long'),
    address: z.string().trim().max(500, 'Address is too long').optional(),
})

// Mill settings schema
const millSettingsSchema = z.object({
    currency: z.string().trim().default('INR').optional(),
    taxPercentage: z.number().min(0).max(100).default(0).optional(),
})

// Create mill schema
export const createMillSchema = z.object({
    body: z.object({
        millName: z
            .string({ required_error: 'Mill name is required' })
            .trim()
            .min(1, 'Mill name cannot be empty')
            .max(200, 'Mill name is too long'),
        millInfo: millInfoSchema,
        contact: millContactSchema,
        status: z
            .enum(Object.values(MILL_STATUS), {
                errorMap: () => ({
                    message: 'Invalid mill status',
                }),
            })
            .optional(),
        currentPlan: z.string().optional(),
        planValidUntil: z.string().datetime().optional(),
        settings: millSettingsSchema.optional(),
    }),
})

// Update mill schema
export const updateMillSchema = z.object({
    body: z.object({
        millName: z.string().trim().min(1).max(200).optional(),
        millInfo: millInfoSchema.partial().optional(),
        contact: millContactSchema.partial().optional(),
        status: z.enum(Object.values(MILL_STATUS)).optional(),
        currentPlan: z.string().nullable().optional(),
        planValidUntil: z.string().datetime().nullable().optional(),
        settings: millSettingsSchema.optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Get mill by ID schema
export const getMillByIdSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Delete mill schema
export const deleteMillSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteMillsSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string(), { required_error: 'IDs array is required' })
            .min(1, 'At least one ID is required'),
    }),
})

// List query params schema
export const listMillsSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z.enum(Object.values(MILL_STATUS)).optional(),
        sortBy: z
            .enum(['millName', 'status', 'createdAt', 'updatedAt'])
            .default('createdAt')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryMillsSchema = z.object({})

// Verify mill schema
export const verifyMillSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'REJECTED'], {
            required_error: 'Status is required',
            errorMap: () => ({
                message: 'Status must be ACTIVE or REJECTED',
            }),
        }),
        rejectionReason: z.string().trim().max(500).optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Suspend/Reactivate mill schema
export const millActionSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Mill ID is required' }),
    }),
})
