/**
 * Balance Lifting Purchases FRK Types
 * TypeScript type definitions for Balance Lifting Purchases FRK module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingPurchasesFrkRequest {
    date: string
    partyName?: string
    frkQty?: number
    frkRate?: number
    gst?: number
}

export interface UpdateBalanceLiftingPurchasesFrkRequest {
    id: string
    date?: string
    partyName?: string
    frkQty?: number
    frkRate?: number
    gst?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingPurchasesFrkResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    frkQty?: number
    frkRate?: number
    gst?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BalanceLiftingPurchasesFrkListResponse {
    data: BalanceLiftingPurchasesFrkResponse[]
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

export interface BalanceLiftingPurchasesFrkSummaryResponse {
    totalEntries: number
    totalFrkQty: number
    totalGst: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingPurchasesFrkQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
