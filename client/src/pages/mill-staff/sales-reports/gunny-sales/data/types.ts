/**
 * Gunny Sales Types
 * TypeScript type definitions for Gunny Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGunnySaleRequest {
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

export interface UpdateGunnySaleRequest {
    id: string
    date?: string
    partyName?: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface GunnySaleResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
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

export interface GunnySaleListResponse {
    data: GunnySaleResponse[]
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

export interface GunnySaleSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface GunnySaleQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
