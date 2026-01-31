/**
 * Rice Purchase Types
 * TypeScript type definitions for Rice Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateRicePurchaseRequest {
    date: string
    partyName: string
    riceType?: string
    riceGunny?: number
    netWeight?: number
    rate?: number
    amount?: number
    brokerName?: string
    brokerage?: number
}

export interface UpdateRicePurchaseRequest {
    id: string
    date?: string
    partyName?: string
    riceType?: string
    riceGunny?: number
    netWeight?: number
    rate?: number
    amount?: number
    brokerName?: string
    brokerage?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface RicePurchaseResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    riceType?: string
    riceGunny?: number
    netWeight?: number
    rate?: number
    amount?: number
    brokerName?: string
    brokerage?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface RicePurchaseListResponse {
    data: RicePurchaseResponse[]
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

export interface RicePurchaseSummaryResponse {
    totalEntries: number
    totalNetWeight: number
    totalAmount: number
    totalBrokerage: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface RicePurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
