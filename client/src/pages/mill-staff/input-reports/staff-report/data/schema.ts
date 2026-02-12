import { z } from 'zod'

// Schema for StaffReport records
export const staffReportSchema = z.object({
    _id: z.string().optional(),
    fullName: z.string().min(1, 'Name is required'),
    post: z.string().optional(),
    salary: z.number().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
})

export type StaffReportData = z.infer<typeof staffReportSchema>
