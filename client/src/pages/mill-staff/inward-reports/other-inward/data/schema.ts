import { z } from 'zod'

export const otherInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    otherPurchaseDealNumber: z.string().optional(),
    itemName: z.string().optional(),
    quantity: z.number().optional(),
    quantityType: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteGunnyWeight: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNumber: z.string().optional(),
    rstNumber: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type OtherInward = z.infer<typeof otherInwardSchema>
