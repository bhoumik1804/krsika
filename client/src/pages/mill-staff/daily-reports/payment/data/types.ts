/**
 * Daily Payment Types
 * TypeScript type definitions for Daily Payment module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyPaymentStatus =
    | 'pending'
    | 'completed'
    | 'cancelled'
    | 'failed'

export type PaymentMode = 'Cash' | 'Bank' | 'Cheque' | 'UPI'

export interface DailyPaymentStatusOption {
    label: string
    value: DailyPaymentStatus
}

export interface PaymentModeOption {
    label: string
    value: PaymentMode
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyPaymentRequest {
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: PaymentMode
    purpose: string
    referenceNumber?: string
    status: DailyPaymentStatus
    remarks?: string
}

export interface UpdateDailyPaymentRequest {
    id: string
    date?: string
    voucherNumber?: string
    partyName?: string
    amount?: number
    paymentMode?: PaymentMode
    purpose?: string
    referenceNumber?: string
    status?: DailyPaymentStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyPaymentResponse {
    _id: string
    millId: string
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: PaymentMode
    purpose: string
    referenceNumber?: string
    status: DailyPaymentStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyPaymentListResponse {
    data: DailyPaymentResponse[]
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

export interface DailyPaymentSummaryResponse {
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
        completed: number
        cancelled: number
        failed: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyPaymentQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyPaymentStatus
    paymentMode?: PaymentMode
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyPaymentFormData {
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: PaymentMode
    purpose: string
    referenceNumber?: string
    status: DailyPaymentStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyPaymentDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyPaymentResponse | null
    selectedRows: DailyPaymentResponse[]
}
