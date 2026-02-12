import { z } from 'zod'

export const privatePaddyInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    paddyPurchaseDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    balanceDo: z.number().optional(),
    purchaseType: z.string().optional(),
    doNumber: z.string().optional(),
    committeeName: z.string().optional(),
    gunnyOption: z.string().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    truckNumber: z.string().optional(),
    rstNumber: z.string().optional(),
    truckLoadWeight: z.number().optional(),
    paddyType: z.string().optional(),
    paddyMota: z.number().optional(),
    paddyPatla: z.number().optional(),
    paddySarna: z.number().optional(),
    paddyMahamaya: z.number().optional(),
    paddyRbGold: z.number().optional(),
})

export type PrivatePaddyInward = z.infer<typeof privatePaddyInwardSchema>
