/**
 * Khanda Sales Types
 * TypeScript type definitions for Khanda Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateKhandaSaleRequest {
    date: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

export interface UpdateKhandaSaleRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface KhandaSaleResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
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

export interface KhandaSaleListResponse {
    data: KhandaSaleResponse[]
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

export interface KhandaSaleSummaryResponse {
    totalEntries: number
    totalKhandaQty: number
    totalBrokerage: number
    avgKhandaRate: number
    avgDiscountPercent: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface KhandaSaleQueryParams {
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

export interface KhandaSaleSummaryQueryParams {
    startDate?: string
    endDate?: string
}

// ==========================================
// Form Types
// ==========================================

export interface KhandaSaleFormData {
    date: string
    partyName: string
    brokerName: string
    khandaQty: number | null
    khandaRate: number | null
    discountPercent: number | null
    brokeragePerQuintal: number | null
}

// ==========================================
// Dialog State Types
// ==========================================

export interface KhandaSaleDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: KhandaSaleResponse | null
    selectedRows: KhandaSaleResponse[]
}
