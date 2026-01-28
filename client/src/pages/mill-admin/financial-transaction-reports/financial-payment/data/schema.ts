import { z } from 'zod'

export const FinancialPaymentSchema = z.object({
    date: z.string(),
    paymentType: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    purchaseDealType: z.string().optional(),
    purchaseDealNumber: z.string().optional(),
    transporterName: z.string().optional(),
    truckNumber: z.string().optional(),
    diesel: z.number().optional(),
    bhatta: z.number().optional(),
    repairOrMaintenance: z.number().optional(),
    labourType: z.string().optional(),
    labourGroupName: z.string().optional(),
    staffName: z.string().optional(),
    salary: z.number().optional(),
    month: z.string().optional(),
    attendance: z.number().optional(),
    allowedLeave: z.number().optional(),
    payableSalary: z.number().optional(),
    salaryPayment: z.number().optional(),
    advancePayment: z.number().optional(),
    remarks: z.string().optional(),
    paymentAmount: z.number().optional(),
})

export type FinancialPayment = z.infer<typeof FinancialPaymentSchema>
