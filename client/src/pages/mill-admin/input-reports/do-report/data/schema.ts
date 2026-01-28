import { z } from 'zod'

// Schema for DoReport records
export const doReportSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    samitiSangrahan: z.string().optional(),
    doNo: z.string().optional(),
    dhanMota: z.number().optional(),
    dhanPatla: z.number().optional(),
    dhanSarna: z.number().optional(),
})

export type DoReportData = z.infer<typeof doReportSchema>
