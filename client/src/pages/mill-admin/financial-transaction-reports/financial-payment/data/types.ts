import { type FinancialPayment } from './schema'

export type FinancialPaymentResponse = FinancialPayment

export type FinancialPaymentListResponse = {
    entries: FinancialPayment[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

export type FinancialPaymentSummaryResponse = {
    totalEntries: number
    totalAmount: number
}

export type CreateFinancialPaymentRequest = Omit<FinancialPayment, '_id'>

export type UpdateFinancialPaymentRequest = Partial<FinancialPayment> & {
    id: string
}

export type FinancialPaymentQueryParams = {
    page?: number
    limit?: number
    search?: string
    paymentType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
