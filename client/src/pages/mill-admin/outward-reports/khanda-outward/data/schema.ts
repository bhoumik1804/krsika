import { z } from 'zod'

// Schema for KhandaOutward records
export const khandaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    khandaSaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type KhandaOutward = z.infer<typeof khandaOutwardSchema>
