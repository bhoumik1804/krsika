/**
 * Govt Paddy Inward Types
 * TypeScript type definitions for Govt Paddy Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGovtPaddyInwardRequest {
    date: string
    doNumber: string
    committeeName: string
    balanceDo?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    gunnyWeight?: number
    truckNumber: string
    rstNumber?: string
    truckLoadWeight?: number
    paddyType?: string
    paddyMota?: number
    paddyPatla?: number
    paddySarna?: number
    paddyMahamaya?: number
    paddyRbGold?: number
}

export interface UpdateGovtPaddyInwardRequest {
    id: string
    date?: string
    doNumber?: string
    committeeName?: string
    balanceDo?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    gunnyWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckLoadWeight?: number
    paddyType?: string
    paddyMota?: number
    paddyPatla?: number
    paddySarna?: number
    paddyMahamaya?: number
    paddyRbGold?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface GovtPaddyInwardResponse {
    _id: string
    millId: string
    date: string
    doNumber: string
    committeeName: string
    balanceDo?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    gunnyWeight?: number
    truckNumber: string
    rstNumber?: string
    truckLoadWeight?: number
    paddyType?: string
    paddyMota?: number
    paddyPatla?: number
    paddySarna?: number
    paddyMahamaya?: number
    paddyRbGold?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface GovtPaddyInwardListResponse {
    data: GovtPaddyInwardResponse[]
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

export interface GovtPaddyInwardSummaryResponse {
    totalEntries: number
    totalBalanceDo: number
    totalGunnyNew: number
    totalGunnyOld: number
    totalGunnyPlastic: number
    totalJuteWeight: number
    totalPlasticWeight: number
    totalGunnyWeight: number
    totalTruckLoadWeight: number
    totalPaddyMota: number
    totalPaddyPatla: number
    totalPaddySarna: number
    totalPaddyMahamaya: number
    totalPaddyRbGold: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface GovtPaddyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    paddyType?: string
    committeeName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface GovtPaddyInwardFormData {
    date: string
    doNumber: string
    committeeName: string
    balanceDo?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    gunnyWeight?: number
    truckNumber: string
    rstNumber?: string
    truckLoadWeight?: number
    paddyType?: string
    paddyMota?: number
    paddyPatla?: number
    paddySarna?: number
    paddyMahamaya?: number
    paddyRbGold?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface GovtPaddyInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    selectedEntry?: GovtPaddyInwardResponse
    selectedIds?: string[]
}
