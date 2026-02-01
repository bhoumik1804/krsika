/**
 * Staff Report Types
 * TypeScript type definitions for Staff Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateStaffReportRequest {
    fullName: string
    salary?: number
    phoneNumber?: string
    email?: string
    address?: string
}

export interface UpdateStaffReportRequest {
    id: string
    fullName?: string
    salary?: number
    phoneNumber?: string
    email?: string
    address?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface StaffReportResponse {
    _id: string
    millId: string
    staffName: string
    designation?: string
    department?: string
    phone?: string
    email?: string
    joiningDate?: string
    salary?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface StaffReportListResponse {
    data: StaffReportResponse[]
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

export interface StaffReportSummaryResponse {
    totalStaff: number
    totalSalary: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface StaffReportQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
