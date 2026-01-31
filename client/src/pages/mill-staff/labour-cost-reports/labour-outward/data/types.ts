/**
 * Labour Outward Types
 * TypeScript type definitions for Labour Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateLabourOutwardRequest {
    date: string
    outwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    loadingRate?: number
    dhulaiRate?: number
    labourGroupName?: string
}

export interface UpdateLabourOutwardRequest {
    id: string
    date?: string
    outwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    loadingRate?: number
    dhulaiRate?: number
    labourGroupName?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface LabourOutwardResponse {
    _id: string
    millId: string
    date: string
    outwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    loadingRate?: number
    dhulaiRate?: number
    labourGroupName?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface LabourOutwardListResponse {
    data: LabourOutwardResponse[]
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

export interface LabourOutwardSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalLoadingCost: number
    totalDhulaiCost: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface LabourOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
