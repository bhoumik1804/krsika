/**
 * Other Outward Types
 * TypeScript type definitions for Other Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOtherOutwardRequest {
    date: string
    itemSaleDealNumber?: string
    itemName?: string
    quantity?: number
    quantityType?: string
    partyName?: string
    brokerName?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateOtherOutwardRequest {
    id: string
    date?: string
    itemSaleDealNumber?: string
    itemName?: string
    quantity?: number
    quantityType?: string
    partyName?: string
    brokerName?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
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

export interface OtherOutwardResponse {
    _id: string
    millId: string
    date: string
    itemSaleDealNumber?: string
    itemName?: string
    quantity?: number
    quantityType?: string
    partyName?: string
    brokerName?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
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

export interface OtherOutwardListResponse {
    data: OtherOutwardResponse[]
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

export interface OtherOutwardSummaryResponse {
    totalEntries: number
    totalQuantity: number
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

export interface OtherOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    itemName?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface OtherOutwardFormData {
    date: string
    itemSaleDealNumber?: string
    itemName?: string
    quantity?: number
    quantityType?: string
    partyName?: string
    brokerName?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
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

export interface OtherOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: OtherOutwardResponse | null
    selectedRows: OtherOutwardResponse[]
}
