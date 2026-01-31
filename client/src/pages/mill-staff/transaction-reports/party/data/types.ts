/**
 * Party Transaction Types
 * TypeScript type definitions for Party Transaction module
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

export interface CreatePartyTransactionRequest {
    date: string
    partyName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

export interface UpdatePartyTransactionRequest {
    id: string
    date?: string
    partyName?: string
    transactionType?: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface PartyTransactionResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface PartyTransactionListResponse {
    data: PartyTransactionResponse[]
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

export interface PartyTransactionSummaryResponse {
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

export interface PartyTransactionQueryParams {
    page?: number
    limit?: number
    search?: string
    transactionType?: string
    partyName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PartyTransactionFormData {
    date: string
    partyName: string
    transactionType: string
    debit?: number
    credit?: number
    balance?: number
    narration?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface PartyTransactionDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PartyTransactionResponse | null
    selectedRows: PartyTransactionResponse[]
}
