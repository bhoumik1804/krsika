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
    role?: string
    post?: string
    salary?: number
    address?: string
    isActive?: boolean
    permissions?: Permission[]
}

export interface UpdateStaffRequest {
    id: string
    fullName?: string
    email?: string
    phoneNumber?: string
    role?: string
    post?: string
    salary?: number
    address?: string
    isActive?: boolean
    permissions?: Permission[]
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
    fullName?: string
    email: string
    phoneNumber?: string
    role?: string
    avatar?: string
    post?: string
    salary?: number
    address?: string
    attendanceHistory?: AttendanceRecord[]
    isActive: boolean
    permissions?: Permission[]
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
