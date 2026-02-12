import { z } from 'zod'

// Schema for SilkyKodhaOutward records
export const silkyKodhaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    silkyKodhaSaleDealNumber: z.string().optional(),
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

export type SilkyKodhaOutward = z.infer<typeof silkyKodhaOutwardSchema>
