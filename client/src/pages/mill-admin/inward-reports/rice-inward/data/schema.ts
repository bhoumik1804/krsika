import { z } from 'zod'

export const riceInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    ricePurchaseNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    riceType: z.string().optional(),
    balanceInward: z.number().optional(),
    inwardType: z.string().optional(), // 'LOT खरीदी' | 'चावल खरीदी'
    lotNumber: z.string().optional(),
    frkOrNAN: z.string().optional(),
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
    riceMotaNetWeight: z.number().optional(),
    ricePatlaNetWeight: z.number().optional(),
})

export type RiceInward = z.infer<typeof riceInwardSchema>
