import { z } from 'zod'

export const privatePaddyInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    paddyPurchaseDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    balanceDo: z.number().optional(),
    purchaseType: z.string().nullable().optional(),
    doNumber: z.string().nullable().optional(),
    committeeName: z.string().nullable().optional(),
    gunnyOption: z.string().nullable().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    rstNumber: z.string().nullable().optional(),
    truckLoadWeight: z.number().optional(),
    paddyType: z.string().nullable().optional(),
    paddyMota: z.number().optional(),
    paddyPatla: z.number().optional(),
    paddySarna: z.number().optional(),
    paddyMahamaya: z.number().optional(),
    paddyRbGold: z.number().optional(),
})

export type PrivatePaddyInward = z.infer<typeof privatePaddyInwardSchema>
