import { z } from 'zod'

/**
 * Broker Validators
 * Zod schemas for request validation
 */

// Common fields schema
const brokerBaseSchema = {
    brokerName: z
        .string({ required_error: 'Broker name is required' })
        .trim()
        .min(1, 'Broker name cannot be empty')
        .max(200, 'Broker name is too long'),
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

// Create broker schema
export const createBrokerSchema = z.object({
    body: z.object({
        ...brokerBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update broker schema
export const updateBrokerSchema = z.object({
    body: z.object({
        brokerName: brokerBaseSchema.brokerName.optional(),
        phone: brokerBaseSchema.phone,
        email: brokerBaseSchema.email,
        address: brokerBaseSchema.address,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker ID is required' }),
    }),
})

// Get broker by ID schema
export const getBrokerByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker ID is required' }),
    }),
})

// Delete broker schema
export const deleteBrokerSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteBrokerSchema = z.object({
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
export const getBrokerListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['brokerName', 'createdAt'])
            .default('brokerName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getBrokerSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
