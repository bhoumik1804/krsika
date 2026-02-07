import { z } from 'zod'

/**
 * Staff Report Validators
 * Zod schemas for request validation
 */

// Common fields schema
const staffReportBaseSchema = {
    staffName: z
        .string({ required_error: 'Staff name is required' })
        .trim()
        .min(1, 'Staff name cannot be empty')
        .max(200, 'Staff name is too long'),
    designation: z
        .string()
        .trim()
        .max(100, 'Designation is too long')
        .optional(),
    department: z.string().trim().max(100, 'Department is too long').optional(),
    phone: z.string().trim().max(20, 'Phone number is too long').optional(),
    email: z
        .string()
        .trim()
        .email('Invalid email format')
        .max(100, 'Email is too long')
        .optional()
        .or(z.literal('')),
    joiningDate: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    salary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
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
        staffName: staffReportBaseSchema.staffName.optional(),
        designation: staffReportBaseSchema.designation,
        department: staffReportBaseSchema.department,
        phone: staffReportBaseSchema.phone,
        email: staffReportBaseSchema.email,
        joiningDate: staffReportBaseSchema.joiningDate,
        salary: staffReportBaseSchema.salary,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff Report ID is required' }),
    }),
})

// Get staff report by ID schema
export const getStaffReportByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff Report ID is required' }),
    }),
})

// Delete staff report schema
export const deleteStaffReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff Report ID is required' }),
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
            .enum([
                'staffName',
                'designation',
                'department',
                'createdAt',
                'joiningDate',
            ])
            .default('staffName')
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
