/**
 * Milling Paddy Types
 * TypeScript type definitions for Milling Paddy module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateMillingPaddyRequest {
    date: string
    paddyType: string
    hopperInGunny?: number
    hopperInQintal?: number
    riceType?: string
    riceQuantity?: number
    ricePercentage?: number
    khandaQuantity?: number
    khandaPercentage?: number
    kodhaQuantity?: number
    kodhaPercentage?: number
    bhusaTon?: number
    bhusaPercentage?: number
    nakkhiQuantity?: number
    nakkhiPercentage?: number
    wastagePercentage?: number
}

export interface UpdateMillingPaddyRequest {
    id: string
    date?: string
    paddyType?: string
    hopperInGunny?: number
    hopperInQintal?: number
    riceType?: string
    riceQuantity?: number
    ricePercentage?: number
    khandaQuantity?: number
    khandaPercentage?: number
    kodhaQuantity?: number
    kodhaPercentage?: number
    bhusaTon?: number
    bhusaPercentage?: number
    nakkhiQuantity?: number
    nakkhiPercentage?: number
    wastagePercentage?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface MillingPaddyResponse {
    _id: string
    millId: string
    date: string
    paddyType: string
    hopperInGunny?: number
    hopperInQintal?: number
    riceType?: string
    riceQuantity?: number
    ricePercentage?: number
    khandaQuantity?: number
    khandaPercentage?: number
    kodhaQuantity?: number
    kodhaPercentage?: number
    bhusaTon?: number
    bhusaPercentage?: number
    nakkhiQuantity?: number
    nakkhiPercentage?: number
    wastagePercentage?: number
    createdBy: {
        _id: string
        fullName: string
        email: string
    }
    updatedBy?: {
        _id: string
        fullName: string
        email: string
    }
    createdAt: string
    updatedAt: string
}

export interface MillingPaddyListResponse {
    data: MillingPaddyResponse[]
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

export interface MillingPaddySummaryResponse {
    totalEntries: number
    totalHopperInGunny: number
    totalHopperInQintal: number
    totalRiceQuantity: number
    totalKhandaQuantity: number
    totalKodhaQuantity: number
    totalBhusaTon: number
    totalNakkhiQuantity: number
    avgRicePercentage: number
    avgKhandaPercentage: number
    avgKodhaPercentage: number
    avgBhusaPercentage: number
    avgNakkhiPercentage: number
    avgWastagePercentage: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface MillingPaddyQueryParams {
    page?: number
    limit?: number
    search?: string
    paddyType?: string
    riceType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
