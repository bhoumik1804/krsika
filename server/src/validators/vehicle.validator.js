import { z } from 'zod'

/**
 * Vehicle Validators
 * Zod schemas for request validation
 */

// Common fields schema
const vehicleBaseSchema = {
    truckNo: z
        .string({ required_error: 'Truck number is required' })
        .trim()
        .min(1, 'Truck number cannot be empty')
        .max(50, 'Truck number is too long'),
}

// Create vehicle schema
export const createVehicleSchema = z.object({
    body: z.object({
        ...vehicleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update vehicle schema
export const updateVehicleSchema = z.object({
    body: z.object({
        truckNo: vehicleBaseSchema.truckNo.optional(),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Vehicle ID is required' }),
    }),
})

// Get vehicle by ID schema
export const getVehicleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Vehicle ID is required' }),
    }),
})

// Delete vehicle schema
export const deleteVehicleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Vehicle ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteVehicleSchema = z.object({
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
export const getVehicleListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z.enum(['truckNo', 'createdAt']).default('truckNo').optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getVehicleSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
