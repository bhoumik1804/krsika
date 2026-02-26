// API Request Types
export type CreateNakkhiSalesRequest = {
    date: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

export type UpdateNakkhiSalesRequest = {
    _id: string
    date?: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
}

// API Response Types
export type NakkhiSalesResponse = {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    nakkhiQty?: number
    nakkhiRate?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    nakkhiSalesDealNumber?: string
    createdAt: string
    updatedAt: string
}

export type NakkhiSalesListResponse = {
    sales?: NakkhiSalesResponse[]
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

export type NakkhiSalesQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type NakkhiSalesSummaryResponse = {
    totalRecords: number
    totalQuantity: number
    totalAmount: number
}
