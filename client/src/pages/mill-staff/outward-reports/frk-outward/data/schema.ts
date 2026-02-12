import { z } from 'zod'

// Schema for FrkOutward records
export const frkOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    partyName: z.string().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type FrkOutward = z.infer<typeof frkOutwardSchema>
