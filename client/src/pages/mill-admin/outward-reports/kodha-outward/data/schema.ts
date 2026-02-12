import { z } from 'zod'

// Schema for KodhaOutward records
export const kodhaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    kodhaSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    rate: z.number().optional(),
    oil: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type KodhaOutward = z.infer<typeof kodhaOutwardSchema>
