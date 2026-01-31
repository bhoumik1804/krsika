import { z } from 'zod'

// Schema for Daily Purchase Deals
export const purchaseDealSchema = z.object({
    id: z.string(),
    date: z.string(),
    farmerName: z.string(),
    commodity: z.string(),
    quantity: z.number(),
    rate: z.number(),
    totalAmount: z.number(),
    status: z.enum(['pending', 'completed', 'cancelled']),
    vehicleNumber: z.string().optional(),
    remarks: z.string().optional(),
})

export type PurchaseDeal = z.infer<typeof purchaseDealSchema>
