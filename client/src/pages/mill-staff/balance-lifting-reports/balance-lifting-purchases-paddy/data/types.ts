/**
 * Balance Lifting Purchases Paddy Types
 * TypeScript type definitions for Balance Lifting Purchases Paddy module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingPurchasesPaddyRequest {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

export interface UpdateBalanceLiftingPurchasesPaddyRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingPurchasesPaddyResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BalanceLiftingPurchasesPaddyListResponse {
    data: BalanceLiftingPurchasesPaddyResponse[]
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

export interface BalanceLiftingPurchasesPaddySummaryResponse {
    totalEntries: number
    totalPaddyQty: number
    totalBrokerage: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingPurchasesPaddyQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
