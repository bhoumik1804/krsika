import { z } from 'zod'

// Schema for Daily Milling Entries
export const millingSchema = z.object({
    id: z.string(),
    date: z.string(),
    shift: z.enum(['Day', 'Night']),
    paddyType: z.string(),
    paddyQuantity: z.number(), // Qtl
    riceYield: z.number(), // Kg
    brokenYield: z.number(), // Kg
    branYield: z.number(), // Kg
    huskYield: z.number(), // Kg
    status: z.enum(['scheduled', 'in-progress', 'completed', 'halted']),
    remarks: z.string().optional(),
})

export type MillingEntry = z.infer<typeof millingSchema>
