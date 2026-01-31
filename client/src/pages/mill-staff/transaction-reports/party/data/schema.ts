import { z } from 'zod'

// Schema for PartyTransaction records
export const partyTransactionSchema = z.object({
    partyName: z.string(),
    brokerName: z.string(),
    date: z.string(),
    purchaseDeal: z.number(),
    salesDeal: z.number(),
    inward: z.number(),
    outward: z.number(),
    accountReceipt: z.number(),
    accountPayment: z.number(),
    accountBrokerage: z.number(),
    receipt: z.number(),
    payment: z.number(),
    brokerage: z.number(),
})

export type PartyTransaction = z.infer<typeof partyTransactionSchema>
