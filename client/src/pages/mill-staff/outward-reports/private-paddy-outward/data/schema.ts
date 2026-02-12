import { z } from 'zod'

export const privatePaddyOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    paddySaleDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    paddyType: z.string().optional(),
    doQty: z.number().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    truckNumber: z.string().optional(),
    rstNumber: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type PrivatePaddyOutward = z.infer<typeof privatePaddyOutwardSchema>
