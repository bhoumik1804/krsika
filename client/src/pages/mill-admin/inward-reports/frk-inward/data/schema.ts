import { z } from 'zod'

export const frkInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    purchaseDealId: z.string().optional(),
    partyName: z.string().optional(),
    gunnyPlastic: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().optional(),
    rstNumber: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type FrkInward = z.infer<typeof frkInwardSchema>
