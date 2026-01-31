/**
 * Silky Kodha Outward Types
 * TypeScript type definitions for Silky Kodha Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateSilkyKodhaOutwardRequest {
    date: string
    silkyKodhaSaleDealNumber?: string
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

export interface UpdateSilkyKodhaOutwardRequest {
    id: string
    date?: string
    silkyKodhaSaleDealNumber?: string
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

export interface SilkyKodhaOutwardResponse {
    _id: string
    millId: string
    date: string
    silkyKodhaSaleDealNumber?: string
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

export interface SilkyKodhaOutwardListResponse {
    data: SilkyKodhaOutwardResponse[]
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

export interface SilkyKodhaOutwardSummaryResponse {
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

export interface SilkyKodhaOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    silkyKodhaSaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface SilkyKodhaOutwardFormData {
    date: string
    silkyKodhaSaleDealNumber?: string
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

export interface SilkyKodhaOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: SilkyKodhaOutwardResponse | null
    selectedRows: SilkyKodhaOutwardResponse[]
}
