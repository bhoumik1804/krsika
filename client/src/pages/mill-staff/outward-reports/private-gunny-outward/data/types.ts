/**
 * Private Gunny Outward Types
 * TypeScript type definitions for Private Gunny Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePrivateGunnyOutwardRequest {
    date: string
    gunnyPurchaseNumber?: string
    partyName?: string
    newGunnyQty?: number
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}

export interface UpdatePrivateGunnyOutwardRequest {
    id: string
    date?: string
    gunnyPurchaseNumber?: string
    partyName?: string
    newGunnyQty?: number
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface PrivateGunnyOutwardResponse {
    _id: string
    millId: string
    date: string
    gunnyPurchaseNumber?: string
    partyName?: string
    newGunnyQty?: number
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface PrivateGunnyOutwardListResponse {
    data: PrivateGunnyOutwardResponse[]
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

export interface PrivateGunnyOutwardSummaryResponse {
    totalEntries: number
    totalNewGunnyQty: number
    totalOldGunnyQty: number
    totalPlasticGunnyQty: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface PrivateGunnyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    gunnyPurchaseNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PrivateGunnyOutwardFormData {
    date: string
    gunnyPurchaseNumber?: string
    partyName?: string
    newGunnyQty?: number
    oldGunnyQty?: number
    plasticGunnyQty?: number
    truckNo?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface PrivateGunnyOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PrivateGunnyOutwardResponse | null
    selectedRows: PrivateGunnyOutwardResponse[]
}
