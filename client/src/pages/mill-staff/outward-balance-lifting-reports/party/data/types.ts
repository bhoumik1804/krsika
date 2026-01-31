/**
 * Outward Balance Lifting Party Types
 * TypeScript type definitions for Outward Balance Lifting Party module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOutwardBalancePartyRequest {
    partyName: string
    rice?: number
    gunny?: number
    frk?: number
    other?: number
    totalBalance?: number
}

export interface UpdateOutwardBalancePartyRequest {
    id: string
    partyName?: string
    rice?: number
    gunny?: number
    frk?: number
    other?: number
    totalBalance?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface OutwardBalancePartyResponse {
    _id: string
    millId: string
    partyName: string
    rice?: number
    gunny?: number
    frk?: number
    other?: number
    totalBalance?: number
    createdBy: string
    createdByUser?: {
        fullName: string
        email: string
    }
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface OutwardBalancePartyListResponse {
    data: OutwardBalancePartyResponse[]
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

export interface OutwardBalancePartySummaryResponse {
    totalEntries: number
    totalRice: number
    totalGunny: number
    totalFrk: number
    totalOther: number
    grandTotalBalance: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface OutwardBalancePartyQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
