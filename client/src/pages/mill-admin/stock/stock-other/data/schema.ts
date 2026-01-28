import { z } from 'zod'

// Schema for StockOther records
export const stockOtherSchema = z.object({
    id: z.string(),
    frk: z.number(),
})

export type StockOther = z.infer<typeof stockOtherSchema>
