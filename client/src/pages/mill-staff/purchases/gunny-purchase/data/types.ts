/**
 * Gunny Purchase Types
 * TypeScript type definitions for Gunny Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGunnyPurchaseRequest {
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

export interface UpdateGunnyPurchaseRequest {
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

export interface GunnyPurchaseResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface GunnyPurchaseListResponse {
    data: GunnyPurchaseResponse[]
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

export interface GunnyPurchaseSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface GunnyPurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
