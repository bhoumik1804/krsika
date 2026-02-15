// API Request Types
export type CreateKhandaSalesRequest = {
    date: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

export type UpdateKhandaSalesRequest = {
    _id: string
    date?: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

// API Response Types
export type KhandaSalesResponse = {
    _id: string
    millId: string
    date: string
    khandaSalesDealNumber?: string
    partyName?: string
    brokerName?: string
    khandaQty?: number
    khandaRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    createdAt: string
    updatedAt: string
}

export type KhandaSalesListResponse = {
    sales?: KhandaSalesResponse[]
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

export type KhandaSalesQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type KhandaSalesSummaryResponse = {
    totalRecords: number
    totalQuantity: number
    totalAmount: number
}
