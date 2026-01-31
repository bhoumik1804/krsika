/**
 * Broker Transaction Types
 * TypeScript type definitions for Broker Transaction module
 */

// ==========================================
// Status Types
// ==========================================

export type TransactionType = 'debit' | 'credit'

export interface TransactionTypeOption {
    label: string
    value: TransactionType
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateBrokerTransactionRequest {
    date: string
    brokerName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

export interface UpdateBrokerTransactionRequest {
    id: string
    date?: string
    brokerName?: string
    transactionType?: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface BrokerTransactionResponse {
    _id: string
    millId: string
    date: string
    brokerName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BrokerTransactionListResponse {
    data: BrokerTransactionResponse[]
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

export interface BrokerTransactionSummaryResponse {
    totalEntries: number
    totalDebit: number
    totalCredit: number
    netBalance: number
    transactionTypeCounts: {
        debit: number
        credit: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface BrokerTransactionQueryParams {
    page?: number
    limit?: number
    search?: string
    transactionType?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface BrokerTransactionFormData {
    date: string
    brokerName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface BrokerTransactionDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: BrokerTransactionResponse | null
    selectedRows: BrokerTransactionResponse[]
}
