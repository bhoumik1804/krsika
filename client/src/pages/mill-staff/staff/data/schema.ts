import { z } from 'zod'

// Staff status
const staffStatusSchema = z.union([
    z.literal('active'),
    z.literal('inactive'),
    z.literal('suspended'),
])
export type StaffStatus = z.infer<typeof staffStatusSchema>

// Staff roles
const staffRoleSchema = z.union([
    z.literal('manager'),
    z.literal('supervisor'),
    z.literal('operator'),
    z.literal('accountant'),
])

// Attendance enum
const attendanceStatusSchema = z.union([
    z.literal('P'), // Present
    z.literal('A'), // Absent
    z.literal('H'), // Holiday
])
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>

// Attendance record per day
const attendanceRecordSchema = z.object({
    date: z.string(), // YYYY-MM-DD format
    status: attendanceStatusSchema,
})
export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>

// Staff schema
const staffSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    status: staffStatusSchema,
    role: staffRoleSchema,
    attendanceHistory: z.array(attendanceRecordSchema).optional(), // history for calendar
    isPaymentDone: z.boolean(),
    isMillVerified: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Staff = z.infer<typeof staffSchema>

export const staffListSchema = z.array(staffSchema)
