import { z } from 'zod'

/**
 * DO Report Validators
 * Zod schemas for request validation
 */

// Common fields schema
const doReportBaseSchema = {
    date: z
        .string({ required_error: 'Date is required' })
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    samitiSangrahan: z
        .string()
        .trim()
        .max(200, 'Samiti sangrahan is too long')
        .optional(),
    doNo: z.string().trim().max(100, 'DO number is too long').optional(),
    dhanMota: z.coerce
        .number()
        .min(0, 'Dhan mota cannot be negative')
        .optional(),
    dhanPatla: z.coerce
        .number()
        .min(0, 'Dhan patla cannot be negative')
        .optional(),
    dhanSarna: z.coerce
        .number()
        .min(0, 'Dhan sarna cannot be negative')
        .optional(),
    total: z.coerce.number().min(0, 'Total cannot be negative').optional(),
}

// Create DO report schema
export const createDoReportSchema = z.object({
    body: z.object({
        ...doReportBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Bulk create DO reports schema
// Date is shared for all reports in the batch
export const bulkCreateDoReportSchema = z.object({
    body: z
        .array(
            z.object({
                date: doReportBaseSchema.date,
                samitiSangrahan: doReportBaseSchema.samitiSangrahan,
                doNo: doReportBaseSchema.doNo,
                dhanMota: doReportBaseSchema.dhanMota,
                dhanPatla: doReportBaseSchema.dhanPatla,
                dhanSarna: doReportBaseSchema.dhanSarna,
                total: doReportBaseSchema.total,
            }),
            { required_error: 'Reports array is required' }
        )
        .min(1, 'At least one DO report is required'),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update DO report schema
export const updateDoReportSchema = z.object({
    body: z.object({
        date: z
            .string()
            .refine(
                (val) => !val || !isNaN(Date.parse(val)),
                'Invalid date format'
            )
            .optional(),
        samitiSangrahan: doReportBaseSchema.samitiSangrahan,
        doNo: doReportBaseSchema.doNo,
        dhanMota: doReportBaseSchema.dhanMota,
        dhanPatla: doReportBaseSchema.dhanPatla,
        dhanSarna: doReportBaseSchema.dhanSarna,
        total: doReportBaseSchema.total,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Get DO report by ID schema
export const getDoReportByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Delete DO report schema
export const deleteDoReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDoReportSchema = z.object({
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
export const getDoReportListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['date', 'samitiSangrahan', 'doNo', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getDoReportSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
