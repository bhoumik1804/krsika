import { z } from 'zod'

/**
 * Committee Validators
 * Zod schemas for request validation
 */

// Common fields schema
const committeeBaseSchema = {
    committeeName: z
        .string({ required_error: 'Committee name is required' })
        .trim()
        .min(1, 'Committee name cannot be empty')
        .max(200, 'Committee name is too long'),
    contactPerson: z
        .string()
        .trim()
        .max(200, 'Contact person name is too long')
        .optional(),
    phone: z.string().trim().max(20, 'Phone number is too long').optional(),
    email: z
        .string()
        .trim()
        .email('Invalid email format')
        .max(100, 'Email is too long')
        .optional()
        .or(z.literal('')),
    address: z.string().trim().max(500, 'Address is too long').optional(),
}

// Create committee schema
export const createCommitteeSchema = z.object({
    body: z.object({
        ...committeeBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update committee schema
export const updateCommitteeSchema = z.object({
    body: z.object({
        committeeName: committeeBaseSchema.committeeName.optional(),
        contactPerson: committeeBaseSchema.contactPerson,
        phone: committeeBaseSchema.phone,
        email: committeeBaseSchema.email,
        address: committeeBaseSchema.address,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Committee ID is required' }),
    }),
})

// Get committee by ID schema
export const getCommitteeByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Committee ID is required' }),
    }),
})

// Delete committee schema
export const deleteCommitteeSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Committee ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteCommitteeSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string(), { required_error: 'IDs array is required' })
            .min(1, 'At least one ID is required'),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// List query params schema
export const getCommitteeListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['committeeName', 'contactPerson', 'createdAt'])
            .default('committeeName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getCommitteeSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
