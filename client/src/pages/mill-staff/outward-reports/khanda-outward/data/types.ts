/**
 * Khanda Outward Types
 * TypeScript type definitions for Khanda Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateKhandaOutwardRequest {
    date: string
    khandaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateKhandaOutwardRequest {
    id: string
    date?: string
    khandaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface KhandaOutwardResponse {
    _id: string
    millId: string
    date: string
    khandaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    gunnyPlastic?: number
    plasticWeight?: number
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

export interface KhandaOutwardListResponse {
    data: KhandaOutwardResponse[]
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

export interface KhandaOutwardSummaryResponse {
    totalEntries: number
    totalGunnyPlastic: number
    totalPlasticWeight: number
    totalTruckWeight: number
    totalGunnyWeight: number
    totalNetWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface KhandaOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    khandaSaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface KhandaOutwardFormData {
    date: string
    khandaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface KhandaOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: KhandaOutwardResponse | null
    selectedRows: KhandaOutwardResponse[]
}
