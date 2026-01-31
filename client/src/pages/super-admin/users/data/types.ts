/**
 * Users Types
 * TypeScript type definitions for Users module (Super Admin)
 * Aligned with User model: server/src/models/user.model.js
 */

// ==========================================
// Status Types
// ==========================================

export type UserStatus = 'active' | 'inactive' | 'suspended'

export type UserRole =
    | 'super-admin'
    | 'mill-admin'
    | 'mill-staff'
    | 'guest-user'

export interface UserStatusOption {
    label: string
    value: UserStatus
}

export interface UserRoleOption {
    label: string
    value: UserRole
}

// ==========================================
// Permission Types
// ==========================================

export type ModuleSlug =
    | 'dashboard'
    | 'inventory'
    | 'sales'
    | 'purchases'
    | 'production'
    | 'reports'
    | 'settings'
    | 'staff'
    | 'finance'

export type PermissionAction = 'create' | 'read' | 'update' | 'delete'

export interface Permission {
    moduleSlug: ModuleSlug
    actions: PermissionAction[]
}

// ==========================================
// Mill Reference
// ==========================================

export interface MillReference {
    _id: string
    millName: string
    status: string
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateUserRequest {
    fullName: string
    email: string
    password?: string
    role: UserRole
    millId?: string
    permissions?: Permission[]
    isActive?: boolean
}

export interface UpdateUserRequest {
    id: string
    fullName?: string
    email?: string
    password?: string
    role?: UserRole
    millId?: string
    permissions?: Permission[]
    isActive?: boolean
}

export interface InviteUserRequest {
    email: string
    role: UserRole
    millId?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface UserResponse {
    _id: string
    millId: MillReference | null
    fullName: string
    email: string
    googleId: string | null
    avatar: string | null
    role: UserRole
    permissions: Permission[]
    isActive: boolean
    lastLogin: string | null
    createdAt: string
    updatedAt: string
}

export interface UserListResponse {
    data: UserResponse[]
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

export interface UserSummaryResponse {
    totalUsers: number
    roleCounts: {
        'super-admin': number
        'mill-admin': number
        'mill-staff': number
        'guest-user': number
    }
    statusCounts: {
        active: number
        inactive: number
        suspended: number
    }
    recentUsers: UserResponse[]
}

// ==========================================
// Query Parameters
// ==========================================

export interface UserQueryParams {
    page?: number
    limit?: number
    search?: string
    role?: UserRole
    isActive?: boolean
    millId?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface UserFormData {
    fullName: string
    email: string
    password?: string
    role: UserRole
    millId?: string
    permissions: Permission[]
    isActive: boolean
}

// ==========================================
// Dialog State Types
// ==========================================

export interface UserDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | 'invite' | null
    currentRow: UserResponse | null
    selectedRows: UserResponse[]
}

// ==========================================
// Table Types (for frontend display)
// Matches User model fields
// ==========================================

export interface UserTableRow {
    id: string
    fullName: string
    email: string
    avatar: string | null
    status: UserStatus
    role: UserRole
    millId: MillReference | null
    lastLogin: Date | null
    createdAt: Date
    updatedAt: Date
}
