import { z } from 'zod'

/**
 * Staff Report Validators
 * Zod schemas for request validation (uses User model with MILL_STAFF role)
 */

// Common fields schema
const staffReportBaseSchema = {
    fullName: z
        .string({ required_error: 'Full name is required' })
        .trim()
        .min(1, 'Full name cannot be empty')
        .max(200, 'Full name is too long'),
    email: z
        .email('Invalid email format')
        .max(100, 'Email is too long')
        .optional()
        .or(z.literal('')),
    phoneNumber: z
        .string()
        .trim()
        .max(20, 'Phone number is too long')
        .optional(),
    post: z.string().trim().max(100, 'Post is too long').optional(),
    salary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
    address: z.string().trim().max(500, 'Address is too long').optional(),
}

// Create staff report schema
export const createStaffReportSchema = z.object({
    body: z.object({
        ...staffReportBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update staff report schema
export const updateStaffReportSchema = z.object({
    body: z.object({
        fullName: staffReportBaseSchema.fullName.optional(),
        email: staffReportBaseSchema.email,
        phoneNumber: staffReportBaseSchema.phoneNumber,
        post: staffReportBaseSchema.post,
        salary: staffReportBaseSchema.salary,
        address: staffReportBaseSchema.address,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Get staff report by ID schema
export const getStaffReportByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Delete staff report schema
export const deleteStaffReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteStaffReportSchema = z.object({
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
export const getStaffReportListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['fullName', 'post', 'salary', 'createdAt'])
            .default('fullName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getStaffReportSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
