import { z } from 'zod'

// Schema for StockGunny records
export const stockGunnySchema = z.object({
    id: z.string(),
    filledNew: z.number(),
    filledOld: z.number(),
    filledPlastic: z.number(),
    emptyNew: z.number(),
    emptyOld: z.number(),
    emptyPlastic: z.number(),
})

export type StockGunny = z.infer<typeof stockGunnySchema>
