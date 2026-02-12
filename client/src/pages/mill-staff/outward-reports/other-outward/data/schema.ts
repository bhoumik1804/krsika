import { z } from 'zod'

// Schema for OtherOutward records
export const otherOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    otherSaleDealNumber: z.string().optional(),
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
    truckNo: z.string().optional(),
    truckRst: z.string().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type OtherOutward = z.infer<typeof otherOutwardSchema>
