import { z } from 'zod'

// Schema for CommitteeReport records
export const committeeReportSchema = z.object({
    _id: z.string().optional(),
    committeeType: z.string().optional(),
    committeeName: z.string().optional(),
})

export type CommitteeReportData = z.infer<typeof committeeReportSchema>
