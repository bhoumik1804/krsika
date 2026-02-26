import { z } from 'zod'

export const privatePaddyOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    paddySaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    paddyType: z.string().nullable().optional(),
    doQty: z.number().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    rstNumber: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type PrivatePaddyOutward = z.infer<typeof privatePaddyOutwardSchema>
