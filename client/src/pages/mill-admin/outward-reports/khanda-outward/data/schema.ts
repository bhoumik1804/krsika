import { z } from 'zod'

// Schema for KhandaOutward records
export const khandaOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    khandaSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type KhandaOutward = z.infer<typeof khandaOutwardSchema>
