// API Request Types
export type CreatePaddyPurchaseRequest = {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

export type UpdatePaddyPurchaseRequest = {
    _id: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

// API Response Types
export type PaddyPurchaseResponse = {
    _id: string
    millId: string
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
    paddyPurchaseDealNumber?: string
    createdAt: string
    updatedAt: string
}

export type PaddyPurchaseListResponse = {
    data?: PaddyPurchaseResponse[]
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

export type PaddyPurchaseQueryParams = {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type PaddyPurchaseSummaryResponse = {
    totalRecords: number
    totalQuantity: number
    totalAmount: number
}
