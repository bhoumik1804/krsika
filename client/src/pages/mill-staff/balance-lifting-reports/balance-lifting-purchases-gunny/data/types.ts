/**
 * Balance Lifting Purchases Gunny Types
 * TypeScript type definitions for Balance Lifting Purchases Gunny module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingPurchasesGunnyRequest {
    date: string
    partyName?: string
    deliveryType?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
}

export interface UpdateBalanceLiftingPurchasesGunnyRequest {
    id: string
    date?: string
    partyName?: string
    deliveryType?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingPurchasesGunnyResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    deliveryType?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BalanceLiftingPurchasesGunnyListResponse {
    data: BalanceLiftingPurchasesGunnyResponse[]
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

export interface BalanceLiftingPurchasesGunnySummaryResponse {
    totalEntries: number
    totalNewGunnyQty: number
    totalOldGunnyQty: number
    totalPlasticGunnyQty: number
    totalAmount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingPurchasesGunnyQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
