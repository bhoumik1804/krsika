/**
 * Kodha Outward Types
 * TypeScript type definitions for Kodha Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateKodhaOutwardRequest {
    date: string
    kodhaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    oil?: number
    brokerage?: number
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateKodhaOutwardRequest {
    id: string
    date?: string
    kodhaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    oil?: number
    brokerage?: number
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

export interface KodhaOutwardResponse {
    _id: string
    millId: string
    date: string
    kodhaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    oil?: number
    brokerage?: number
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

export interface KodhaOutwardListResponse {
    data: KodhaOutwardResponse[]
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

export interface KodhaOutwardSummaryResponse {
    totalEntries: number
    totalRate: number
    totalOil: number
    totalBrokerage: number
    totalGunnyPlastic: number
    totalPlasticWeight: number
    totalTruckWeight: number
    totalGunnyWeight: number
    totalNetWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface KodhaOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    kodhaSaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface KodhaOutwardFormData {
    date: string
    kodhaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    oil?: number
    brokerage?: number
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

export interface KodhaOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: KodhaOutwardResponse | null
    selectedRows: KodhaOutwardResponse[]
}
