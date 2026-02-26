import { z } from 'zod'

// Schema for FrkOutward records
export const frkOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    partyName: z.string().nullable().optional(),
    gunnyPlastic: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNo: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type FrkOutward = z.infer<typeof frkOutwardSchema>
