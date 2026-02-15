// API Request Types
export type CreateRiceSalesRequest = {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRatePerQuintal?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
}

export type UpdateRiceSalesRequest = {
    _id: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRatePerQuintal?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
}

// API Response Types
export type RiceSalesResponse = {
    _id: string
    millId: string
    date: string
    riceSalesDealNumber?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    lotOrOther?: string
    fciOrNAN?: string
    riceType?: string
    riceQty?: number
    riceRatePerQuintal?: number
    discountPercent?: number
    brokeragePerQuintal?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    frkType?: string
    frkRatePerQuintal?: number
    lotNumber?: string
    createdAt: string
    updatedAt: string
}

export type RiceSalesListResponse = {
    sales?: RiceSalesResponse[]
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

export type RiceSalesQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type RiceSalesSummaryResponse = {
    totalRecords: number
    totalQuantity: number
    totalAmount: number
}
