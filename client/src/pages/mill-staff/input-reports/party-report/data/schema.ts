import { z } from 'zod'

// Schema for Party Report records
export const partyReportSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    partyName: z.string().min(1, 'Party name is required'),
    gstn: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
})

export type PartyReportData = z.infer<typeof partyReportSchema>
