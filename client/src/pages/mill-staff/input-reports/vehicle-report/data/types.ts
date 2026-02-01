/**
 * Vehicle Report Types
 * TypeScript type definitions for Vehicle Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateVehicleRequest {
    vehicleNumber: string
    vehicleType?: string
    transporterName?: string
    driverName?: string
    driverPhone?: string
    capacity?: number
}

export interface UpdateVehicleRequest {
    id?: string
    _id?: string
    vehicleNumber?: string
    vehicleType?: string
    transporterName?: string
    driverName?: string
    driverPhone?: string
    capacity?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface VehicleResponse {
    _id: string
    millId: string
    vehicleNumber: string
    vehicleType?: string
    transporterName?: string
    driverName?: string
    driverPhone?: string
    capacity?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface VehicleListResponse {
    data: VehicleResponse[]
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

export interface VehicleSummaryResponse {
    totalVehicles: number
    totalCapacity: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface VehicleQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
