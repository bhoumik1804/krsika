import { z } from 'zod'

// Schema for StockOverview records
export const stockOverviewSchema = z.object({
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

export type StockOverview = z.infer<typeof stockOverviewSchema>
