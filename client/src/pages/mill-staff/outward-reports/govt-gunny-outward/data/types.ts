/**
 * Govt Gunny Outward Types
 * TypeScript type definitions for Govt Gunny Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGovtGunnyOutwardRequest {
    date: string
    gunnyDm?: string
    samitiSangrahan?: string
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}

export interface UpdateGovtGunnyOutwardRequest {
    id: string
    date?: string
    gunnyDm?: string
    samitiSangrahan?: string
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface GovtGunnyOutwardResponse {
    _id: string
    millId: string
    date: string
    gunnyDm?: string
    samitiSangrahan?: string
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface GovtGunnyOutwardListResponse {
    data: GovtGunnyOutwardResponse[]
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

export interface GovtGunnyOutwardSummaryResponse {
    totalEntries: number
    totalOldGunnyQty: number
    totalPlasticGunnyQty: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface GovtGunnyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    gunnyDm?: string
    samitiSangrahan?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface GovtGunnyOutwardFormData {
    date: string
    gunnyDm?: string
    samitiSangrahan?: string
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}
