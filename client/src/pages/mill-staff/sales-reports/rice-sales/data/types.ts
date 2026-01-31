/**
 * Rice Sales Types
 * TypeScript type definitions for Rice Sales module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateRiceSaleRequest {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRatePerQuintal?: number
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

export interface UpdateRiceSaleRequest {
    id: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRatePerQuintal?: number
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

export interface RiceSaleResponse {
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
    riceRatePerQuintal?: number
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
    createdByUser?: {
        fullName: string
        email: string
    }
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface RiceSaleListResponse {
    data: RiceSaleResponse[]
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

export interface RiceSaleSummaryResponse {
    totalEntries: number
    totalRiceQty: number
    totalBrokerage: number
    avgRiceRatePerQuintal: number
    avgDiscountPercent: number
    totalNewGunnyRate: number
    totalOldGunnyRate: number
    totalPlasticGunnyRate: number
    totalFrkRatePerQuintal: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface RiceSaleQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    gunnyType?: string
    frkType?: string
    lotNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface RiceSaleSummaryQueryParams {
    startDate?: string
    endDate?: string
}

// ==========================================
// Form Types
// ==========================================

export interface RiceSaleFormData {
    date: string
    partyName: string
    brokerName: string
    deliveryType: string
    lotOrOther: string
    fciOrNAN: string
    riceType: string
    riceQty: number | null
    riceRatePerQuintal: number | null
    discountPercent: number | null
    brokeragePerQuintal: number | null
    gunnyType: string
    newGunnyRate: number | null
    oldGunnyRate: number | null
    plasticGunnyRate: number | null
    frkType: string
    frkRatePerQuintal: number | null
    lotNumber: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface RiceSaleDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: RiceSaleResponse | null
    selectedRows: RiceSaleResponse[]
}
