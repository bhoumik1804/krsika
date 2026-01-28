import { z } from 'zod'

// Schema for StaffReport records
export const staffReportSchema = z.object({
    staffName: z.string().min(1, 'Staff name is required'),
    post: z.string().optional(),
    salary: z.number().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
})

export type StaffReportData = z.infer<typeof staffReportSchema>
