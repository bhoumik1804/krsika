/**
 * Govt Rice Outward Types
 * TypeScript type definitions for Govt Rice Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGovtRiceOutwardRequest {
    date: string
    lotNo?: string
    fciNan?: string
    riceType?: string
    gunnyNew?: number
    gunnyOld?: number
    juteWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateGovtRiceOutwardRequest {
    id: string
    date?: string
    lotNo?: string
    fciNan?: string
    riceType?: string
    gunnyNew?: number
    gunnyOld?: number
    juteWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface GovtRiceOutwardResponse {
    _id: string
    millId: string
    date: string
    lotNo?: string
    fciNan?: string
    riceType?: string
    gunnyNew?: number
    gunnyOld?: number
    juteWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface GovtRiceOutwardListResponse {
    data: GovtRiceOutwardResponse[]
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

export interface GovtRiceOutwardSummaryResponse {
    totalEntries: number
    totalGunnyNew: number
    totalGunnyOld: number
    totalJuteWeight: number
    totalTruckWeight: number
    totalGunnyWeight: number
    totalNetWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface GovtRiceOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    lotNo?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface GovtRiceOutwardFormData {
    date: string
    lotNo?: string
    fciNan?: string
    riceType?: string
    gunnyNew?: number
    gunnyOld?: number
    juteWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface GovtRiceOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: GovtRiceOutwardResponse | null
    selectedRows: GovtRiceOutwardResponse[]
}
