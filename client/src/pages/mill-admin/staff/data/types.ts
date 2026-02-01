/**
 * Staff Types
 * TypeScript type definitions for Staff module (based on User model)
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateStaffRequest {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    isActive?: boolean
}

export interface UpdateStaffRequest {
    id: string
    fullName?: string
    email?: string
    phoneNumber?: string
    isActive?: boolean
}

// ==========================================
// API Response Types
// ==========================================

export interface AttendanceRecord {
    date: string
    status: 'P' | 'A' | 'H' // Present, Absent, Half Day
}

export interface Permission {
    moduleSlug: string
    actions: string[]
}

export interface StaffResponse {
    _id: string
    millId: string
    fullName: string
    email: string
    phoneNumber: string
    avatar?: string
    attendanceHistory: AttendanceRecord[]
    isActive: boolean
    permissions?: Permission[]
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export interface StaffListResponse {
    data: StaffResponse[]
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

export interface StaffSummaryResponse {
    totalStaff: number
    activeStaff: number
    inactiveStaff: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface StaffQueryParams {
    page?: number
    limit?: number
    search?: string
    isActive?: boolean
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
