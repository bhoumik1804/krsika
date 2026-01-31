/**
 * Private Paddy Inward Types
 * TypeScript type definitions for Private Paddy Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePrivatePaddyInwardRequest {
    date: string
    paddyPurchaseDealNumber?: string
    partyName?: string
    brokerName?: string
    balanceDo?: number
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    gunnyOption?: string
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

export interface UpdatePrivatePaddyInwardRequest {
    id: string
    date?: string
    paddyPurchaseDealNumber?: string
    partyName?: string
    brokerName?: string
    balanceDo?: number
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    gunnyOption?: string
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

export interface PrivatePaddyInwardResponse {
    _id: string
    millId: string
    date: string
    paddyPurchaseDealNumber?: string
    partyName?: string
    brokerName?: string
    balanceDo?: number
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    gunnyOption?: string
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
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface PrivatePaddyInwardListResponse {
    data: PrivatePaddyInwardResponse[]
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

export interface PrivatePaddyInwardSummaryResponse {
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

export interface PrivatePaddyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    purchaseType?: string
    paddyType?: string
    partyName?: string
    brokerName?: string
    committeeName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PrivatePaddyInwardFormData {
    date: string
    paddyPurchaseDealNumber?: string
    partyName?: string
    brokerName?: string
    balanceDo?: number
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    gunnyOption?: string
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
// Dialog State Types
// ==========================================

export interface PrivatePaddyInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PrivatePaddyInwardResponse | null
    selectedRows: PrivatePaddyInwardResponse[]
}
