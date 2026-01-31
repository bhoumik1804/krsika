/**
 * Balance Lifting Party Types
 * TypeScript type definitions for Balance Lifting Party module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingPartyRequest {
    partyName: string
    paddy?: number
    rice?: number
    gunny?: number
    frk?: number
    other?: number
    totalBalance?: number
}

export interface UpdateBalanceLiftingPartyRequest {
    id: string
    partyName?: string
    paddy?: number
    rice?: number
    gunny?: number
    frk?: number
    other?: number
    totalBalance?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingPartyResponse {
    _id: string
    millId: string
    partyName: string
    paddy?: number
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

export interface BalanceLiftingPartyListResponse {
    data: BalanceLiftingPartyResponse[]
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

export interface BalanceLiftingPartySummaryResponse {
    totalEntries: number
    totalPaddy: number
    totalRice: number
    totalGunny: number
    totalFrk: number
    totalOther: number
    grandTotalBalance: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingPartyQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
