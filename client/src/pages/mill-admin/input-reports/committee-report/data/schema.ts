import { z } from 'zod'

// Schema for CommitteeReport records
export const committeeReportSchema = z.object({
    committeeType: z.string().optional(),
    committeeName: z.string().optional(),
})

export type CommitteeReportData = z.infer<typeof committeeReportSchema>
