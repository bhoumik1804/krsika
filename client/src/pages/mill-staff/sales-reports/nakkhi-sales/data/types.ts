/**
 * Nakkhi Sales Types
 * TypeScript type definitions for Nakkhi Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateNakkhiSaleRequest {
    date: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

export interface UpdateNakkhiSaleRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface NakkhiSaleResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    createdBy: string
    createdByUser?: {
        fullName: string
        email: string
    }
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface NakkhiSaleListResponse {
    data: NakkhiSaleResponse[]
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

export interface NakkhiSaleSummaryResponse {
    totalEntries: number
    totalNakkhiQty: number
    totalBrokerage: number
    avgNakkhiRate: number
    avgDiscountPercent: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface NakkhiSaleQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface NakkhiSaleSummaryQueryParams {
    startDate?: string
    endDate?: string
}

// ==========================================
// Form Types
// ==========================================

export interface NakkhiSaleFormData {
    date: string
    partyName: string
    brokerName: string
    nakkhiQty: number | null
    nakkhiRate: number | null
    discountPercent: number | null
    brokeragePerQuintal: number | null
}

// ==========================================
// Dialog State Types
// ==========================================

export interface NakkhiSaleDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: NakkhiSaleResponse | null
    selectedRows: NakkhiSaleResponse[]
}
