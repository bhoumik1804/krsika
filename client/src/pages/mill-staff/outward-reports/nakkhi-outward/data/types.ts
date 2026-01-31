/**
 * Nakkhi Outward Types
 * TypeScript type definitions for Nakkhi Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateNakkhiOutwardRequest {
    date: string
    nakkhiSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    brokerage?: number
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateNakkhiOutwardRequest {
    id: string
    date?: string
    nakkhiSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
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

export interface NakkhiOutwardResponse {
    _id: string
    millId: string
    date: string
    nakkhiSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
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

export interface NakkhiOutwardListResponse {
    data: NakkhiOutwardResponse[]
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

export interface NakkhiOutwardSummaryResponse {
    totalEntries: number
    totalRate: number
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

export interface NakkhiOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    nakkhiSaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
