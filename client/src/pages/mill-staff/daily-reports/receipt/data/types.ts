/**
 * Daily Receipt Types
 * TypeScript type definitions for Daily Receipt module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyReceiptStatus = 'pending' | 'cleared' | 'cancelled' | 'bounced'

export type DailyReceiptPaymentMode = 'Cash' | 'Bank' | 'Cheque' | 'UPI'

export interface DailyReceiptStatusOption {
    label: string
    value: DailyReceiptStatus
}

export interface DailyReceiptPaymentModeOption {
    label: string
    value: DailyReceiptPaymentMode
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyReceiptRequest {
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: DailyReceiptPaymentMode
    purpose: string
    status: DailyReceiptStatus
    remarks?: string
}

export interface UpdateDailyReceiptRequest {
    id: string
    date?: string
    voucherNumber?: string
    partyName?: string
    amount?: number
    paymentMode?: DailyReceiptPaymentMode
    purpose?: string
    status?: DailyReceiptStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyReceiptResponse {
    _id: string
    millId: string
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: DailyReceiptPaymentMode
    purpose: string
    status: DailyReceiptStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyReceiptListResponse {
    data: DailyReceiptResponse[]
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

export interface DailyReceiptSummaryResponse {
    totalEntries: number
    totalAmount: number
    paymentModeCounts: {
        Cash: number
        Bank: number
        Cheque: number
        UPI: number
    }
    statusCounts: {
        pending: number
        cleared: number
        cancelled: number
        bounced: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyReceiptQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyReceiptStatus
    paymentMode?: DailyReceiptPaymentMode
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyReceiptFormData {
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: DailyReceiptPaymentMode
    purpose: string
    status: DailyReceiptStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyReceiptDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyReceiptResponse | null
    selectedRows: DailyReceiptResponse[]
}
