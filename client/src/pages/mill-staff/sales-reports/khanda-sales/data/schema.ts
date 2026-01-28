import { z } from 'zod'

// Schema for Khanda Sales records
export const khandaSalesSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    khandaQty: z.number().optional(),
    khandaRate: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
})

export type KhandaSales = z.infer<typeof khandaSalesSchema>
