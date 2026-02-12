/**
 * Staff Types
 * TypeScript type definitions for Staff module
 */

// ==========================================
// Status Types
// ==========================================

export type StaffStatus = 'active' | 'inactive'

export type StaffPost = 'manager' | 'supervisor' | 'operator' | 'accountant'

export type AttendanceStatus = 'P' | 'A' | 'H'

export interface StaffStatusOption {
    label: string
    value: StaffStatus
}

export interface StaffPostOption {
    label: string
    value: StaffPost
}

export interface AttendanceStatusOption {
    label: string
    value: AttendanceStatus
}

// ==========================================
// Permission Types
// ==========================================

export interface Permission {
    moduleSlug: string
    actions: string[]
}

// ==========================================
// Attendance Types
// ==========================================

export interface AttendanceRecord {
    date: string
    status: AttendanceStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateStaffRequest {
    fullName: string
    email: string
    phoneNumber?: string
    password?: string
    post?: string
    salary?: number
    address?: string
    permissions?: Permission[]
    isActive?: boolean
}

export interface UpdateStaffRequest {
    id: string
    fullName?: string
    email?: string
    phoneNumber?: string
    post?: string
    salary?: number
    address?: string
    permissions?: Permission[]
    isActive?: boolean
}

export interface MarkAttendanceRequest {
    staffId: string
    date: string
    status: AttendanceStatus
}

export interface BulkMarkAttendanceRequest {
    date: string
    attendanceRecords: Array<{
        staffId: string
        status: AttendanceStatus
    }>
}

// ==========================================
// API Response Types
// ==========================================

export interface StaffResponse {
    _id: string
    millId: string
    fullName: string
    email: string
    phoneNumber?: string
    role: string // "mill-staff"
    isActive: boolean
    post?: string
    salary?: number
    address?: string
    permissions: Permission[]
    attendanceHistory: AttendanceRecord[]
    createdAt: string
    updatedAt: string
}

export interface StaffListResponse {
    staffList: StaffResponse[]
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

export interface AttendanceSummaryResponse {
    staffId: string
    staffName: string
    month: number
    year: number
    totalDays: number
    presentDays: number
    absentDays: number
    holidayDays: number
    attendancePercentage: number
    attendanceRecords: AttendanceRecord[]
}

export interface BulkAttendanceSummaryResponse {
    month: number
    year: number
    staffSummaries: AttendanceSummaryResponse[]
}

export interface StaffSummaryResponse {
    totalStaff: number
    activeCount: number
    inactiveCount: number
    postCounts?: {
        manager: number
        supervisor: number
        operator: number
        accountant: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface StaffQueryParams {
    page?: number
    limit?: number
    search?: string
    isActive?: string
    post?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface AttendanceSummaryQueryParams {
    month: number
    year: number
}

// ==========================================
// Form Types
// ==========================================

export interface StaffFormData {
    fullName: string
    email: string
    phoneNumber?: string
    password?: string
    post?: string
    salary?: number
    address?: string
    permissions?: Permission[]
    isActive: boolean
}

export interface AttendanceFormData {
    staffId: string
    date: string
    status: AttendanceStatus
}

// ==========================================
// Dialog State Types
// ==========================================

export interface StaffDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | 'attendance' | null
    currentRow: StaffResponse | null
    selectedRows: StaffResponse[]
}
