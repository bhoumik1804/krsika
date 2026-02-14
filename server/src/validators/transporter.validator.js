import { z } from 'zod'

/**
 * Transporter Validators
 * Zod schemas for request validation
 */

// Common fields schema
const transporterBaseSchema = {
    transporterName: z
        .string({ required_error: 'Transporter name is required' })
        .trim()
        .min(1, 'Transporter name cannot be empty')
        .max(200, 'Transporter name is too long'),
    gstn: z
        .string()
        .trim()
        .max(15, 'GSTN must be 15 characters')
        .optional()
        .or(z.literal('')),
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

// Create transporter schema
export const createTransporterSchema = z.object({
    body: z.object({
        ...transporterBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update transporter schema
export const updateTransporterSchema = z.object({
    body: z.object({
        transporterName: transporterBaseSchema.transporterName.optional(),
        gstn: transporterBaseSchema.gstn,
        phone: transporterBaseSchema.phone,
        email: transporterBaseSchema.email,
        address: transporterBaseSchema.address,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Transporter ID is required' }),
    }),
})

// Get transporter by ID schema
export const getTransporterByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Transporter ID is required' }),
    }),
})

// Delete transporter schema
export const deleteTransporterSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Transporter ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteTransporterSchema = z.object({
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
export const getTransporterListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['transporterName', 'createdAt'])
            .default('transporterName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getTransporterSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
