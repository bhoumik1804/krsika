import { z } from 'zod'

/**
 * Vehicle Validators
 * Zod schemas for request validation
 */

// Common fields schema
const vehicleBaseSchema = {
    vehicleNumber: z
        .string({ required_error: 'Vehicle number is required' })
        .trim()
        .min(1, 'Vehicle number cannot be empty')
        .max(50, 'Vehicle number is too long'),
    vehicleType: z
        .string()
        .trim()
        .max(100, 'Vehicle type is too long')
        .optional(),
    transporterName: z
        .string()
        .trim()
        .max(200, 'Transporter name is too long')
        .optional(),
    driverName: z
        .string()
        .trim()
        .max(200, 'Driver name is too long')
        .optional(),
    driverPhone: z
        .string()
        .trim()
        .max(20, 'Driver phone is too long')
        .optional(),
    capacity: z.coerce
        .number()
        .min(0, 'Capacity cannot be negative')
        .optional(),
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
        vehicleNumber: vehicleBaseSchema.vehicleNumber.optional(),
        vehicleType: vehicleBaseSchema.vehicleType,
        transporterName: vehicleBaseSchema.transporterName,
        driverName: vehicleBaseSchema.driverName,
        driverPhone: vehicleBaseSchema.driverPhone,
        capacity: vehicleBaseSchema.capacity,
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
        sortBy: z
            .enum(['vehicleNumber', 'vehicleType', 'createdAt'])
            .default('vehicleNumber')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getVehicleSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
