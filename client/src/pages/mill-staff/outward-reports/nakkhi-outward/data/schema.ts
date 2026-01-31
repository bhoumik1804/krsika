import { z } from 'zod'

// Schema for NakkhiOutward records
export const nakkhiOutwardSchema = z.object({
    date: z.string(),
    nakkhiSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    rate: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type NakkhiOutward = z.infer<typeof nakkhiOutwardSchema>
