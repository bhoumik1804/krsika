/**
 * Daily Sales Deals Types
 * TypeScript type definitions for Daily Sales Deals module
 */

// ==========================================
// Status Types
// ==========================================

export type PaymentStatus = 'pending' | 'partial' | 'received' | 'cancelled'

export type DealStatus =
    | 'open'
    | 'dispatched'
    | 'delivered'
    | 'closed'
    | 'cancelled'

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

export interface CreateDailySalesDealRequest {
    date: string
    buyerName: string
    brokerName?: string
    brokerCommission?: number
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    transporterName?: string
    freightAmount?: number
    advanceReceived?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    paymentTerms?: string
    deliveryAddress?: string
    remarks?: string
}

export interface UpdateDailySalesDealRequest {
    id: string
    date?: string
    buyerName?: string
    brokerName?: string
    brokerCommission?: number
    commodity?: string
    commodityType?: string
    quantity?: number
    unit?: string
    rate?: number
    totalAmount?: number
    vehicleNumber?: string
    transporterName?: string
    freightAmount?: number
    advanceReceived?: number
    balanceAmount?: number
    paymentStatus?: PaymentStatus
    status?: DealStatus
    paymentTerms?: string
    deliveryAddress?: string
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailySalesDealResponse {
    _id: string
    millId: string
    date: string
    buyerName: string
    brokerName?: string
    brokerCommission?: number
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    transporterName?: string
    freightAmount?: number
    advanceReceived?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    paymentTerms?: string
    deliveryAddress?: string
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailySalesDealListResponse {
    data: DailySalesDealResponse[]
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

export interface DailySalesDealSummaryResponse {
    totalDeals: number
    totalQuantity: number
    totalAmount: number
    totalFreight: number
    totalAdvanceReceived: number
    totalBalance: number
    totalBrokerCommission: number
    paymentStatusCounts: {
        pending: number
        partial: number
        received: number
        cancelled: number
    }
    statusCounts: {
        open: number
        dispatched: number
        delivered: number
        closed: number
        cancelled: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailySalesDealQueryParams {
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

export interface DailySalesDealFormData {
    date: string
    buyerName: string
    brokerName?: string
    brokerCommission?: number
    commodity: string
    commodityType?: string
    quantity: number
    unit: string
    rate: number
    totalAmount: number
    vehicleNumber?: string
    transporterName?: string
    freightAmount?: number
    advanceReceived?: number
    balanceAmount?: number
    paymentStatus: PaymentStatus
    status: DealStatus
    paymentTerms?: string
    deliveryAddress?: string
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailySalesDealDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailySalesDealResponse | null
    selectedRows: DailySalesDealResponse[]
}
