// API Request Types
export type CreateLabourGroupRequest = {
    groupName: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
}

export type UpdateLabourGroupRequest = {
    id: string
    groupName?: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
}

// API Response Types
export type LabourGroupResponse = {
    _id: string
    millId: string
    groupName: string
    leaderName?: string
    phone?: string
    memberCount?: number
    workType?: string
    createdAt: string
    updatedAt: string
}

export type LabourGroupListResponse = {
    labourGroups?: LabourGroupResponse[]
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

export type LabourGroupQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type LabourGroupSummaryResponse = {
    totalLabourGroups: number
}
