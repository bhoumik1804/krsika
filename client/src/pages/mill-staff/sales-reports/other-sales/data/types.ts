/**
 * Other Sales Types
 * TypeScript type definitions for Other Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOtherSaleRequest {
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

export interface UpdateOtherSaleRequest {
    id: string
    date?: string
    partyName?: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface OtherSaleResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
    createdBy: string
    createdByUser?: {
        fullName: string
        email: string
    }
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface OtherSaleListResponse {
    data: OtherSaleResponse[]
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

export interface OtherSaleSummaryResponse {
    totalEntries: number
    totalQuantity: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface OtherSaleQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
