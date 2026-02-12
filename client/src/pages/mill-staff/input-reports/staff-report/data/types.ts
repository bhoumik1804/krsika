// API Request Types
export type CreateStaffRequest = {
    fullName: string
    post?: string
    salary?: number
    phoneNumber?: string
    email?: string
    address?: string
}

export type UpdateStaffRequest = {
    id: string
    fullName: string
    post?: string
    salary?: number
    phoneNumber?: string
    email?: string
    address?: string
}

// API Response Types
export type StaffResponse = {
    _id: string
    millId: string
    fullName: string
    post?: string
    salary?: number
    phoneNumber?: string
    email?: string
    address?: string
    createdAt: string
    updatedAt: string
}

export type StaffListResponse = {
    staff?: StaffResponse[]
    staffs?: StaffResponse[]
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

export type StaffQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
