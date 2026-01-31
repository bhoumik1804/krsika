/**
 * Balance Lifting Sales Paddy Types
 * TypeScript type definitions for Balance Lifting Sales Paddy module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBalanceLiftingSalesPaddyRequest {
    date: string
    partyName?: string
    brokerName?: string
    saleType?: string
    // DO specific fields
    doNumber?: string
    dhanMotaQty?: number
    dhanPatlaQty?: number
    dhanSarnaQty?: number
    // Paddy details
    dhanType?: string
    dhanQty?: number
    paddyRatePerQuintal?: number
    deliveryType?: string
    discountPercent?: number
    brokerage?: number
    // Gunny fields
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

export interface UpdateBalanceLiftingSalesPaddyRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    saleType?: string
    // DO specific fields
    doNumber?: string
    dhanMotaQty?: number
    dhanPatlaQty?: number
    dhanSarnaQty?: number
    // Paddy details
    dhanType?: string
    dhanQty?: number
    paddyRatePerQuintal?: number
    deliveryType?: string
    discountPercent?: number
    brokerage?: number
    // Gunny fields
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BalanceLiftingSalesPaddyResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    saleType?: string
    // DO specific fields
    doNumber?: string
    dhanMotaQty?: number
    dhanPatlaQty?: number
    dhanSarnaQty?: number
    // Paddy details
    dhanType?: string
    dhanQty?: number
    paddyRatePerQuintal?: number
    deliveryType?: string
    discountPercent?: number
    brokerage?: number
    // Gunny fields
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BalanceLiftingSalesPaddyListResponse {
    data: BalanceLiftingSalesPaddyResponse[]
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

export interface BalanceLiftingSalesPaddySummaryResponse {
    totalEntries: number
    totalDhanQty: number
    totalDhanMotaQty: number
    totalDhanPatlaQty: number
    totalDhanSarnaQty: number
    totalBrokerage: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BalanceLiftingSalesPaddyQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
