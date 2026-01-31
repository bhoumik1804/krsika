/**
 * FRK Outward Types
 * TypeScript type definitions for FRK Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateFrkOutwardRequest {
    date: string
    partyName?: string
    gunnyPlastic?: number
    plasticWeight?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    gunnyWeight?: number
    netWeight?: number
}

export interface UpdateFrkOutwardRequest {
    id: string
    date?: string
    partyName?: string
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

export interface FrkOutwardResponse {
    _id: string
    millId: string
    date: string
    partyName?: string
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

export interface FrkOutwardListResponse {
    data: FrkOutwardResponse[]
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

export interface FrkOutwardSummaryResponse {
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

export interface FrkOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
