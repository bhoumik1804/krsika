import { z } from 'zod'

// Schema for private rice outward records
export const PrivateRiceOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    riceSaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    lotNo: z.string().optional(),
    fciNan: z.string().optional(),
    riceType: z.string().optional(),
    riceQty: z.number().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type PrivateRiceOutward = z.infer<typeof PrivateRiceOutwardSchema>
