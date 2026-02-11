/**
 * Paddy Purchase Types
 * TypeScript type definitions for Paddy Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePaddyPurchaseRequest {
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

export interface UpdatePaddyPurchaseRequest {
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

export interface PaddyPurchaseResponse {
    id?: string
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
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface PaddyPurchaseListResponse {
    data: PaddyPurchaseResponse[]
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

export interface PaddyPurchaseSummaryResponse {
    totalEntries: number
    totalDoPaddyQty: number
    totalPaddyQty: number
    totalBrokerage: number
    avgPaddyRatePerQuintal: number
    avgDiscountPercent: number
    totalNewGunnyRate: number
    totalOldGunnyRate: number
    totalPlasticGunnyRate: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface PaddyPurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    purchaseType?: string
    deliveryType?: string
    paddyType?: string
    partyName?: string
    brokerName?: string
    committeeName?: string
    gunnyType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PaddyPurchaseFormData {
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

// ==========================================
// Dialog State Types
// ==========================================

export interface PaddyPurchaseDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PaddyPurchaseResponse | null
    selectedRows: PaddyPurchaseResponse[]
}
