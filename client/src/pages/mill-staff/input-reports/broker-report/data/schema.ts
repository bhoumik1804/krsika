import { z } from 'zod'

// Schema for BrokerReport records
export const brokerReportSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    brokerName: z.string().min(1, 'Broker name is required'),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
})

export type BrokerReportData = z.infer<typeof brokerReportSchema>
