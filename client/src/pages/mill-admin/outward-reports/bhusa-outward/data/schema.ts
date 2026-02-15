import { z } from 'zod'

// Schema for BhusaOutward records
export const bhusaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    bhusaSaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    rate: z.number().optional(),
    brokerage: z.number().optional(),
    truckNo: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
})

export type BhusaOutward = z.infer<typeof bhusaOutwardSchema>
