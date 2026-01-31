/**
 * Other Purchase Types
 * TypeScript type definitions for Other Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOtherPurchaseRequest {
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

export interface UpdateOtherPurchaseRequest {
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

export interface OtherPurchaseResponse {
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
    createdAt: string
    updatedAt: string
}

export interface OtherPurchaseListResponse {
    data: OtherPurchaseResponse[]
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

export interface OtherPurchaseSummaryResponse {
    totalEntries: number
    totalQuantity: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface OtherPurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
