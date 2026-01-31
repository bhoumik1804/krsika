import { z } from 'zod'

// Schema for Daily Inward Entries
export const inwardSchema = z.object({
    id: z.string(),
    date: z.string(),
    gatePassNumber: z.string(),
    partyName: z.string(),
    item: z.string(),
    vehicleNumber: z.string(),
    bags: z.number(),
    weight: z.number(),
    driverName: z.string().optional(),
    status: z.enum(['pending', 'completed', 'verified', 'rejected']),
    remarks: z.string().optional(),
})

export type InwardEntry = z.infer<typeof inwardSchema>
