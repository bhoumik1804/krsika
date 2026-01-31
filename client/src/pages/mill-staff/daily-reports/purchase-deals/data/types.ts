/**
 * Daily Purchase Deals Types
 * TypeScript type definitions for Daily Purchase Deals module
 */

// ==========================================
// Status Types
// ==========================================

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'cancelled'

export type DealStatus = 'open' | 'closed' | 'cancelled'

export interface PaymentStatusOption {
    label: string
    value: PaymentStatus
}

export interface DealStatusOption {
    label: string
    value: DealStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyPurchaseDealRequest {
    date: string
    farmerName: string
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    brokerName?: string
    brokerCommission?: number
    advanceAmount?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    remarks?: string
}

export interface UpdateDailyPurchaseDealRequest {
    id: string
    date?: string
    farmerName?: string
    commodity?: string
    commodityType?: string
    quantity?: number
    unit?: string
    rate?: number
    totalAmount?: number
    vehicleNumber?: string
    brokerName?: string
    brokerCommission?: number
    advanceAmount?: number
    balanceAmount?: number
    paymentStatus?: PaymentStatus
    status?: DealStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyPurchaseDealResponse {
    _id: string
    millId: string
    date: string
    farmerName: string
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    brokerName?: string
    brokerCommission?: number
    advanceAmount?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyPurchaseDealListResponse {
    data: DailyPurchaseDealResponse[]
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

export interface DailyPurchaseDealSummaryResponse {
    totalDeals: number
    totalQuantity: number
    totalAmount: number
    totalAdvance: number
    totalBalance: number
    totalBrokerCommission: number
    paymentStatusCounts: {
        pending: number
        partial: number
        paid: number
        cancelled: number
    }
    statusCounts: {
        open: number
        closed: number
        cancelled: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyPurchaseDealQueryParams {
    page?: number
    limit?: number
    search?: string
    paymentStatus?: PaymentStatus
    status?: DealStatus
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyPurchaseDealFormData {
    date: string
    farmerName: string
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    brokerName?: string
    brokerCommission?: number
    advanceAmount?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyPurchaseDealDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyPurchaseDealResponse | null
    selectedRows: DailyPurchaseDealResponse[]
}
