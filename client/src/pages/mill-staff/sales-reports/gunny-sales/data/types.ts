// API Request Types
export type CreateGunnySalesRequest = {
    date: string
    partyName?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
}

export type UpdateGunnySalesRequest = {
    _id: string
    date?: string
    partyName?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
}

// API Response Types
export type GunnySalesResponse = {
    _id: string
    millId: string
    date: string
    partyName?: string
    newGunnyQty?: number
    newGunnyRate?: number
    oldGunnyQty?: number
    oldGunnyRate?: number
    plasticGunnyQty?: number
    plasticGunnyRate?: number
    createdAt: string
    updatedAt: string
}

export type GunnySalesListResponse = {
    sales?: GunnySalesResponse[]
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

export type GunnySalesQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type GunnySalesSummaryResponse = {
    totalRecords: number
    totalNewGunnyQty: number
    totalOldGunnyQty: number
    totalPlasticGunnyQty: number
    totalAmount: number
}
