import { z } from 'zod'

// Schema for LabourGroupReport records
export const labourGroupReportSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    labourTeamName: z.string().min(1, 'Labour team name is required'),
})

export type LabourGroupReportData = z.infer<typeof labourGroupReportSchema>
