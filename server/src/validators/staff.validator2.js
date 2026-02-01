import { z } from 'zod'

/**
 * Staff Validators
 * Zod schemas for request validation
 */

// Common fields schema
const staffBaseSchema = {
    firstName: z
        .string({ required_error: 'First name is required' })
        .trim()
        .min(1, 'First name cannot be empty')
        .max(100, 'First name is too long'),
    lastName: z
        .string({ required_error: 'Last name is required' })
        .trim()
        .min(1, 'Last name cannot be empty')
        .max(100, 'Last name is too long'),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email format')
        .max(255, 'Email is too long'),
    phoneNumber: z
        .string({ required_error: 'Phone number is required' })
        .trim()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number is too long'),
    status: z.enum(['active', 'inactive', 'suspended'], {
        errorMap: () => ({
            message: 'Status must be active, inactive, or suspended',
        }),
    }),
    role: z.enum(['manager', 'supervisor', 'operator', 'accountant'], {
        errorMap: () => ({
            message:
                'Role must be manager, supervisor, operator, or accountant',
        }),
    }),
    isPaymentDone: z.boolean().optional(),
    isMillVerified: z.boolean().optional(),
}

// Attendance status schema
const attendanceStatusSchema = z.enum(['P', 'A', 'H'], {
    errorMap: () => ({
        message:
            'Attendance status must be P (Present), A (Absent), or H (Holiday)',
    }),
})

// Create staff schema
export const createStaffSchema = z.object({
    body: z.object({
        ...staffBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update staff schema (all fields optional except id)
export const updateStaffSchema = z.object({
    body: z.object({
        firstName: staffBaseSchema.firstName.optional(),
        lastName: staffBaseSchema.lastName.optional(),
        email: staffBaseSchema.email.optional(),
        phoneNumber: staffBaseSchema.phoneNumber.optional(),
        status: staffBaseSchema.status.optional(),
        role: staffBaseSchema.role.optional(),
        isPaymentDone: staffBaseSchema.isPaymentDone,
        isMillVerified: staffBaseSchema.isMillVerified,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff ID is required' }),
    }),
})

// Get staff by ID schema
export const getStaffByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff ID is required' }),
    }),
})

// Delete staff schema
export const deleteStaffSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteStaffSchema = z.object({
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
export const listStaffSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive', 'suspended']).optional(),
        role: z
            .enum(['manager', 'supervisor', 'operator', 'accountant'])
            .optional(),
        isPaymentDone: z.coerce.boolean().optional(),
        isMillVerified: z.coerce.boolean().optional(),
        sortBy: z
            .enum([
                'firstName',
                'lastName',
                'email',
                'role',
                'status',
                'createdAt',
            ])
            .default('createdAt')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryStaffSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Mark attendance schema
export const markAttendanceSchema = z.object({
    body: z.object({
        date: z
            .string({ required_error: 'Date is required' })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        status: attendanceStatusSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff ID is required' }),
    }),
})

// Bulk mark attendance schema
export const bulkMarkAttendanceSchema = z.object({
    body: z.object({
        date: z
            .string({ required_error: 'Date is required' })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        attendanceRecords: z
            .array(
                z.object({
                    staffId: z.string({
                        required_error: 'Staff ID is required',
                    }),
                    status: attendanceStatusSchema,
                }),
                { required_error: 'Attendance records array is required' }
            )
            .min(1, 'At least one attendance record is required'),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Attendance summary schema (for single staff)
export const attendanceSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Staff ID is required' }),
    }),
    query: z.object({
        month: z.coerce
            .number({ required_error: 'Month is required' })
            .int()
            .min(1, 'Month must be between 1 and 12')
            .max(12, 'Month must be between 1 and 12'),
        year: z.coerce
            .number({ required_error: 'Year is required' })
            .int()
            .min(2000, 'Year must be 2000 or later')
            .max(2100, 'Year must be 2100 or earlier'),
    }),
})

// Bulk attendance summary schema (for all staff)
export const bulkAttendanceSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        month: z.coerce
            .number({ required_error: 'Month is required' })
            .int()
            .min(1, 'Month must be between 1 and 12')
            .max(12, 'Month must be between 1 and 12'),
        year: z.coerce
            .number({ required_error: 'Year is required' })
            .int()
            .min(2000, 'Year must be 2000 or later')
            .max(2100, 'Year must be 2100 or earlier'),
    }),
})
