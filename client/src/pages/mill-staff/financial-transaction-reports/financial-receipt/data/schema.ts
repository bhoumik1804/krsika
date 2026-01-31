import { z } from 'zod'

export const FinancialReceiptSchema = z.object({
    date: z.string(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    salesDealType: z.string().optional(),
    salesDealNumber: z.string().optional(),
    receivedAmount: z.number().optional(),
    remarks: z.string().optional(),
})

export type FinancialReceipt = z.infer<typeof FinancialReceiptSchema>
