import { z } from 'zod'

// Schema for BhusaOutward records
export const bhusaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    bhusaSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    rate: z.number().optional(),
    brokerage: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
})

export type BhusaOutward = z.infer<typeof bhusaOutwardSchema>
