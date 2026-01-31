/**
 * Private Paddy Outward Types
 * TypeScript type definitions for Private Paddy Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePrivatePaddyOutwardRequest {
    date: string
    paddySaleDealNumber?: string
    partyName?: string
    brokerName?: string
    paddyType?: string
    doQty?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdatePrivatePaddyOutwardRequest {
    id: string
    date?: string
    paddySaleDealNumber?: string
    partyName?: string
    brokerName?: string
    paddyType?: string
    doQty?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface PrivatePaddyOutwardResponse {
    _id: string
    millId: string
    date: string
    paddySaleDealNumber?: string
    partyName?: string
    brokerName?: string
    paddyType?: string
    doQty?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface PrivatePaddyOutwardListResponse {
    data: PrivatePaddyOutwardResponse[]
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

export interface PrivatePaddyOutwardSummaryResponse {
    totalEntries: number
    totalDoQty: number
    totalGunnyNew: number
    totalGunnyOld: number
    totalGunnyPlastic: number
    totalJuteWeight: number
    totalPlasticWeight: number
    totalTruckWeight: number
    totalGunnyWeight: number
    totalNetWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface PrivatePaddyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    paddyType?: string
    paddySaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PrivatePaddyOutwardFormData {
    date: string
    paddySaleDealNumber?: string
    partyName?: string
    brokerName?: string
    paddyType?: string
    doQty?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface PrivatePaddyOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PrivatePaddyOutwardResponse | null
    selectedRows: PrivatePaddyOutwardResponse[]
}
