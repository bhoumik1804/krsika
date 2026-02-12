import { z } from 'zod'

// Schema for GovtRiceOutward records
export const GovtRiceOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    lotNo: z.string().optional(),
    fciNan: z.string().optional(),
    riceType: z.string().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    juteWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type GovtRiceOutward = z.infer<typeof GovtRiceOutwardSchema>
