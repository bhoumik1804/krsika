import { z } from 'zod'

// Schema for StockPaddy records
export const stockPaddySchema = z.object({
    id: z.string(),
    mota: z.number(),
    patla: z.number(),
    sarna: z.number(),
    mahamaya: z.number(),
    rbGold: z.number(),
})

export type StockPaddy = z.infer<typeof stockPaddySchema>
