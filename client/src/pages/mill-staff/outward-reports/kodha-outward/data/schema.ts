import { z } from 'zod'

// Schema for KodhaOutward records
export const kodhaOutwardSchema = z.object({
    date: z.string(),
    kodhaSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    rate: z.number().optional(),
    oil: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type KodhaOutward = z.infer<typeof kodhaOutwardSchema>
