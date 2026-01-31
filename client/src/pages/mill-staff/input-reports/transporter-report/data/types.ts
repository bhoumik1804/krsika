/**
 * Transporter Report Types
 * TypeScript type definitions for Transporter Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateTransporterRequest {
    transporterName: string
    phone?: string
    email?: string
    address?: string
    vehicleCount?: number
}

export interface UpdateTransporterRequest {
    id: string
    transporterName?: string
    phone?: string
    email?: string
    address?: string
    vehicleCount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface TransporterResponse {
    _id: string
    millId: string
    transporterName: string
    phone?: string
    email?: string
    address?: string
    vehicleCount?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface TransporterListResponse {
    data: TransporterResponse[]
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

export interface TransporterSummaryResponse {
    totalTransporters: number
    totalVehicles: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface TransporterQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
