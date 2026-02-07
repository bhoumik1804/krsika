import { z } from 'zod'

/**
 * Labour Group Validators
 * Zod schemas for request validation
 */

// Common fields schema
const labourGroupBaseSchema = {
    groupName: z
        .string({ required_error: 'Group name is required' })
        .trim()
        .min(1, 'Group name cannot be empty')
        .max(200, 'Group name is too long'),
    leaderName: z
        .string()
        .trim()
        .max(200, 'Leader name is too long')
        .optional(),
    phone: z.string().trim().max(20, 'Phone number is too long').optional(),
    memberCount: z.coerce
        .number()
        .int()
        .min(0, 'Member count cannot be negative')
        .optional(),
    workType: z.string().trim().max(100, 'Work type is too long').optional(),
}

// Create labour group schema
export const createLabourGroupSchema = z.object({
    body: z.object({
        ...labourGroupBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update labour group schema
export const updateLabourGroupSchema = z.object({
    body: z.object({
        groupName: labourGroupBaseSchema.groupName.optional(),
        leaderName: labourGroupBaseSchema.leaderName,
        phone: labourGroupBaseSchema.phone,
        memberCount: labourGroupBaseSchema.memberCount,
        workType: labourGroupBaseSchema.workType,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour Group ID is required' }),
    }),
})

// Get labour group by ID schema
export const getLabourGroupByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour Group ID is required' }),
    }),
})

// Delete labour group schema
export const deleteLabourGroupSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour Group ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteLabourGroupSchema = z.object({
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
export const getLabourGroupListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['groupName', 'leaderName', 'createdAt', 'memberCount'])
            .default('groupName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getLabourGroupSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
