import { z } from 'zod'

// Schema for private rice outward records
export const PrivateRiceOutwardSchema = z.object({
    date: z.string(),
    chawalAutoNumber: z.string().optional(),
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
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    trkWt: z.number().optional(),
    gunnyWt: z.number().optional(),
    finalWt: z.number().optional(),
})

export type PrivateRiceOutward = z.infer<typeof PrivateRiceOutwardSchema>
