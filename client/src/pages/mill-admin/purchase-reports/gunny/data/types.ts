/**
 * Gunny Purchase Types
 * TypeScript type definitions for Gunny Purchase module
 * Aligned with backend API response structure
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGunnyPurchaseRequest {
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

export interface UpdateGunnyPurchaseRequest {
    _id: string
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

export interface GunnyPurchaseResponse {
    _id: string
    millId: string
    date: string
    gunnyPurchaseDealNumber?: string
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
    __v?: number
}

export interface GunnyPurchaseListResponse {
    purchases: GunnyPurchaseResponse[]
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

// ==========================================
// Query Parameter Types
// ==========================================

export interface GunnyPurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
