/**
 * Staff Types
 * TypeScript type definitions for Staff module
 */

// ==========================================
// Status Types
// ==========================================

export type StaffStatus = 'active' | 'inactive' | 'suspended'

export type StaffRole = 'manager' | 'supervisor' | 'operator' | 'accountant'

export type AttendanceStatus = 'P' | 'A' | 'H'

export interface StaffStatusOption {
    label: string
    value: StaffStatus
}

export interface StaffRoleOption {
    label: string
    value: StaffRole
}

export interface AttendanceStatusOption {
    label: string
    value: AttendanceStatus
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
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    status: StaffStatus
    role: StaffRole
    isPaymentDone?: boolean
    isMillVerified?: boolean
}

export interface UpdateStaffRequest {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    status?: StaffStatus
    role?: StaffRole
    isPaymentDone?: boolean
    isMillVerified?: boolean
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
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    status: StaffStatus
    role: StaffRole
    attendanceHistory: AttendanceRecord[]
    isPaymentDone: boolean
    isMillVerified: boolean
    createdBy: string
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
    statusCounts: {
        active: number
        inactive: number
        suspended: number
    }
    roleCounts: {
        manager: number
        supervisor: number
        operator: number
        accountant: number
    }
    paymentPendingCount: number
    verifiedCount: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface StaffQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: StaffStatus
    role?: StaffRole
    isPaymentDone?: boolean
    isMillVerified?: boolean
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
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    status: StaffStatus
    role: StaffRole
    isPaymentDone: boolean
    isMillVerified: boolean
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
