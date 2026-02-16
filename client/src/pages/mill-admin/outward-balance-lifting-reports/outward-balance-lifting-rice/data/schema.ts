import { z } from 'zod'

// Schema for private rice outward records
export const PrivateRiceOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    riceSaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    lotNo: z.string().nullable().optional(),
    fciNan: z.string().nullable().optional(),
    riceType: z.string().nullable().optional(),
    riceQty: z.number().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type PrivateRiceOutward = z.infer<typeof PrivateRiceOutwardSchema>
