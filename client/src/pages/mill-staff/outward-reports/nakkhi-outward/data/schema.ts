import { z } from 'zod'

// Schema for NakkhiOutward records
export const nakkhiOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    nakkhiSaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    rate: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type NakkhiOutward = z.infer<typeof nakkhiOutwardSchema>
