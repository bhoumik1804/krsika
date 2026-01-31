/**
 * Financial Receipt Types
 * TypeScript type definitions for Financial Receipt module
 */

// ==========================================
// Status Types
// ==========================================

export type ReceiptMode = 'Cash' | 'Bank' | 'Cheque' | 'UPI'

export interface ReceiptModeOption {
    label: string
    value: ReceiptMode
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateFinancialReceiptRequest {
    date: string
    partyName: string
    receiptMode?: ReceiptMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
}

export interface UpdateFinancialReceiptRequest {
    id: string
    date?: string
    partyName?: string
    receiptMode?: ReceiptMode
    bank?: string
    amount?: number
    narration?: string
    accountHead?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface FinancialReceiptResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    receiptMode?: ReceiptMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface FinancialReceiptListResponse {
    data: FinancialReceiptResponse[]
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

export interface FinancialReceiptSummaryResponse {
    totalEntries: number
    totalAmount: number
    receiptModeCounts: {
        Cash: number
        Bank: number
        Cheque: number
        UPI: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface FinancialReceiptQueryParams {
    page?: number
    limit?: number
    search?: string
    receiptMode?: ReceiptMode
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface FinancialReceiptFormData {
    date: string
    partyName: string
    receiptMode?: ReceiptMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface FinancialReceiptDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: FinancialReceiptResponse | null
    selectedRows: FinancialReceiptResponse[]
}
