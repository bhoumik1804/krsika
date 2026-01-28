import { z } from 'zod'

// Schema for StockGunnyOther records
export const stockGunnyOtherSchema = z.object({
    id: z.string(),
    date: z.string(),
    partyName: z.string(),
    vehicleNumber: z.string(),
    bags: z.number(),
    weight: z.number(),
    rate: z.number(),
    amount: z.number(),
    status: z.enum(['pending', 'completed', 'cancelled']),
    remarks: z.string().optional(),
})

export type StockGunnyOther = z.infer<typeof stockGunnyOtherSchema>
