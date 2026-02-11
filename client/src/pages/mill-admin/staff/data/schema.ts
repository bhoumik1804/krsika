import { z } from 'zod'

// ==========================================
// Staff Schema (aligned with User model)
// ==========================================

export const staffSchema = z.object({
    _id: z.string(),
    millId: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    post: z.string().optional(),
    salary: z.number().optional(),
    address: z.string().optional(),
    isActive: z.boolean().default(true),
    permissions: z
        .array(
            z.object({
                moduleSlug: z.string(),
                actions: z.array(z.string()),
            })
        )
        .optional(),
    attendanceHistory: z
        .array(
            z.object({
                date: z.string(),
                status: z.enum(['P', 'A', 'H']),
            })
        )
        .optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
})
export type Staff = z.infer<typeof staffSchema>

export const staffListSchema = z.array(staffSchema)

// ==========================================
// Form Schemas
// ==========================================

export const createStaffFormSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be at most 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .optional(),
})
export type CreateStaffForm = z.infer<typeof createStaffFormSchema>

export const updateStaffFormSchema = createStaffFormSchema.partial().extend({
    id: z.string(),
})
export type UpdateStaffForm = z.infer<typeof updateStaffFormSchema>
