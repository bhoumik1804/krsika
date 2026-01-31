/**
 * FRK Purchase Types
 * TypeScript type definitions for FRK Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateFrkPurchaseRequest {
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
}

export interface UpdateFrkPurchaseRequest {
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

export interface FrkPurchaseResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface FrkPurchaseListResponse {
    data: FrkPurchaseResponse[]
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

export interface FrkPurchaseSummaryResponse {
    totalEntries: number
    totalWeight: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface FrkPurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
