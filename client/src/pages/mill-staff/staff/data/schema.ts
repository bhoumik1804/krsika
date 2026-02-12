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
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Staff = z.infer<typeof staffSchema>

// Staff status for display
export type StaffStatus = 'active' | 'inactive'

// Attendance status
export type AttendanceStatus = 'P' | 'A' | 'H'

export const staffListSchema = z.array(staffSchema)
