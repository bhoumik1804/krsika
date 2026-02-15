import { z } from 'zod'

const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional()

export const partyReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
        partyName: z.string().trim().optional(),
        startDate: dateSchema,
        endDate: dateSchema,
    }),
})

export const brokerReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
        brokerName: z.string().trim().optional(),
        startDate: dateSchema,
        endDate: dateSchema,
    }),
})
