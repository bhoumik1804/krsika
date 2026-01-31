/**
 * FRK Sales Types
 * TypeScript type definitions for FRK Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateFrkSaleRequest {
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
}

export interface UpdateFrkSaleRequest {
    id: string
    date?: string
    partyName?: string
    totalWeight?: number
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface FrkSaleResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    totalWeight?: number
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

export interface FrkSaleListResponse {
    data: FrkSaleResponse[]
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

export interface FrkSaleSummaryResponse {
    totalEntries: number
    totalWeight: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface FrkSaleQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
