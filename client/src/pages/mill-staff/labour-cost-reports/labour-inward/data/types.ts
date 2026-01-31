/**
 * Labour Inward Types
 * TypeScript type definitions for Labour Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateLabourInwardRequest {
    date: string
    inwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    unloadingRate?: number
    stackingRate?: number
    labourGroupName?: string
}

export interface UpdateLabourInwardRequest {
    id: string
    date?: string
    inwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    unloadingRate?: number
    stackingRate?: number
    labourGroupName?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface LabourInwardResponse {
    _id: string
    millId: string
    date: string
    inwardType?: string
    truckNumber?: string
    totalGunny?: number
    numberOfGunnyBundle?: number
    unloadingRate?: number
    stackingRate?: number
    labourGroupName?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface LabourInwardListResponse {
    data: LabourInwardResponse[]
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

export interface LabourInwardSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalUnloadingCost: number
    totalStackingCost: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface LabourInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
