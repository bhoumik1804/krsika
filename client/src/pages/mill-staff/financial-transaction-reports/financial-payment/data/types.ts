/**
 * Financial Payment Types
 * TypeScript type definitions for Financial Payment module
 */

// ==========================================
// Status Types
// ==========================================

export type PaymentMode = 'Cash' | 'Bank' | 'Cheque' | 'UPI'

export interface PaymentModeOption {
    label: string
    value: PaymentMode
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateFinancialPaymentRequest {
    date: string
    partyName: string
    paymentMode?: PaymentMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
}

export interface UpdateFinancialPaymentRequest {
    id: string
    date?: string
    partyName?: string
    paymentMode?: PaymentMode
    bank?: string
    amount?: number
    narration?: string
    accountHead?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface FinancialPaymentResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    paymentMode?: PaymentMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface FinancialPaymentListResponse {
    data: FinancialPaymentResponse[]
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

export interface FinancialPaymentSummaryResponse {
    totalEntries: number
    totalAmount: number
    paymentModeCounts: {
        Cash: number
        Bank: number
        Cheque: number
        UPI: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface FinancialPaymentQueryParams {
    page?: number
    limit?: number
    search?: string
    paymentMode?: PaymentMode
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface FinancialPaymentFormData {
    date: string
    partyName: string
    paymentMode?: PaymentMode
    bank?: string
    amount: number
    narration?: string
    accountHead?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface FinancialPaymentDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: FinancialPaymentResponse | null
    selectedRows: FinancialPaymentResponse[]
}
