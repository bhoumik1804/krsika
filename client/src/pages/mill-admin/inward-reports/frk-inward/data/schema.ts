import { z } from 'zod'

export const frkInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    frkPurchaseDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    gunnyPlastic: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    rstNumber: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type FrkInward = z.infer<typeof frkInwardSchema>
