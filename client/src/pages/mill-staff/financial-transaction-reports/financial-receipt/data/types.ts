import { type FinancialReceipt } from './schema'

export type FinancialReceiptResponse = FinancialReceipt

export type FinancialReceiptListResponse = {
    entries: FinancialReceipt[]
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

export type FinancialReceiptSummaryResponse = {
    totalEntries: number
    totalAmount: number
}

export type CreateFinancialReceiptRequest = Omit<FinancialReceipt, '_id'>

export type UpdateFinancialReceiptRequest = Partial<FinancialReceipt> & {
    id: string
}

export type FinancialReceiptQueryParams = {
    page?: number
    limit?: number
    search?: string
    receiptType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
