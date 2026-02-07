import { z } from 'zod'

/**
 * Party Validators
 * Zod schemas for request validation
 */

// Common fields schema
const partyBaseSchema = {
    partyName: z
        .string({ required_error: 'Party name is required' })
        .trim()
        .min(1, 'Party name cannot be empty')
        .max(200, 'Party name is too long'),
    gstn: z.string().trim().max(15, 'GSTN is too long').optional(),
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

// Create party schema
export const createPartySchema = z.object({
    body: z.object({
        ...partyBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update party schema
export const updatePartySchema = z.object({
    body: z.object({
        partyName: partyBaseSchema.partyName.optional(),
        gstn: partyBaseSchema.gstn,
        phone: partyBaseSchema.phone,
        email: partyBaseSchema.email,
        address: partyBaseSchema.address,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Party ID is required' }),
    }),
})

// Get party by ID schema
export const getPartyByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Party ID is required' }),
    }),
})

// Delete party schema
export const deletePartySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Party ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeletePartySchema = z.object({
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
export const getPartyListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['partyName', 'gstn', 'createdAt'])
            .default('partyName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getPartySummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
