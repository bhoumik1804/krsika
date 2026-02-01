/**
 * Labour Group Report Types
 * TypeScript type definitions for Labour Group Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateLabourGroupRequest {
    groupName: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
}

export interface UpdateLabourGroupRequest {
    id?: string
    _id?: string
    groupName?: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface LabourGroupResponse {
    _id: string
    millId: string
    groupName: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface LabourGroupListResponse {
    data: LabourGroupResponse[]
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

export interface LabourGroupSummaryResponse {
    totalGroups: number
    totalMembers: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface LabourGroupQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
