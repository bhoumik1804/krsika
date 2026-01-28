import { z } from 'zod'

// Schema for Daily Outward Entries
export const outwardSchema = z.object({
    id: z.string(),
    date: z.string(),
    gatePassNumber: z.string(),
    partyName: z.string(),
    item: z.string(),
    vehicleNumber: z.string(),
    bags: z.number(),
    weight: z.number(),
    driverName: z.string().optional(),
    status: z.enum(['pending', 'completed', 'dispatched', 'cancelled']),
    remarks: z.string().optional(),
})

export type OutwardEntry = z.infer<typeof outwardSchema>
