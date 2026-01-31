/**
 * Balance Lifting Purchases Rice Types
 * TypeScript type definitions for Balance Lifting Purchases Rice module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingPurchasesRiceRequest {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
}

export interface UpdateBalanceLiftingPurchasesRiceRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingPurchasesRiceResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BalanceLiftingPurchasesRiceListResponse {
    data: BalanceLiftingPurchasesRiceResponse[]
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

export interface BalanceLiftingPurchasesRiceSummaryResponse {
    totalEntries: number
    totalRiceQty: number
    totalBrokerage: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingPurchasesRiceQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
