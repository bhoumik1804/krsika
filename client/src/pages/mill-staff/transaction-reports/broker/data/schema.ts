import { z } from 'zod'

// Schema for BrokerTransaction records
export const brokerTransactionSchema = z.object({
    brokerName: z.string(),
    partyName: z.string(),
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

export type BrokerTransaction = z.infer<typeof brokerTransactionSchema>
