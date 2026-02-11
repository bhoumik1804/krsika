import { z } from 'zod'

export const gunnySalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    newGunnyQty: z.number().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type GunnySales = z.infer<typeof gunnySalesSchema>
