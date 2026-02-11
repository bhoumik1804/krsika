import React, { useEffect, useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { GunnyPurchaseData } from '../data/schema'
import type {
    GunnyPurchaseQueryParams,
    GunnyPurchaseListResponse,
} from '../data/types'

type GunnyDialogType = 'add' | 'edit' | 'delete'

type GunnyContextType = {
    open: GunnyDialogType | null
    setOpen: (str: GunnyDialogType | null) => void
    currentRow: GunnyPurchaseData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<GunnyPurchaseData | null>
    >
    data: GunnyPurchaseData[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: GunnyPurchaseQueryParams
    setQueryParams: React.Dispatch<
        React.SetStateAction<GunnyPurchaseQueryParams>
    >
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

const GunnyContext = React.createContext<GunnyContextType | null>(null)

interface GunnyProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: GunnyPurchaseQueryParams
    apiData?: GunnyPurchaseListResponse
    isLoading?: boolean
    isError?: boolean
    onQueryParamsChange?: (params: GunnyPurchaseQueryParams) => void
}

const defaultQueryParams: GunnyPurchaseQueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function GunnyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    apiData,
    isLoading = false,
    isError = false,
    onQueryParamsChange,
}: GunnyProviderProps) {
    const [open, setOpen] = useDialogState<GunnyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnyPurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<GunnyPurchaseQueryParams>(initialQueryParams)

    // Sync URL params with internal state
    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [
        initialQueryParams.page,
        initialQueryParams.limit,
        initialQueryParams.search,
    ])

    // Notify parent when queryParams change
    useEffect(() => {
        onQueryParamsChange?.(queryParams)
    }, [queryParams, onQueryParamsChange])

    // Transform API response to table format (memoized to prevent flickering)
    const transformedData = useMemo(
        () =>
            (apiData?.purchases || []).map((item) => ({
                _id: item._id,
                date: item.date,
                partyName: item.partyName,
                deliveryType: item.deliveryType,
                newGunnyQty: item.newGunnyQty,
                newGunnyRate: item.newGunnyRate,
                oldGunnyQty: item.oldGunnyQty,
                oldGunnyRate: item.oldGunnyRate,
                plasticGunnyQty: item.plasticGunnyQty,
                plasticGunnyRate: item.plasticGunnyRate,
            })),
        [apiData?.purchases]
    )

    const pagination = useMemo(
        () =>
            apiData?.pagination || {
                page: queryParams.page || 1,
                limit: queryParams.limit || 10,
                total: 0,
                totalPages: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            },
        [apiData?.pagination, queryParams.page, queryParams.limit]
    )

    const contextValue = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            data: transformedData,
            isLoading,
            isError,
            millId,
            queryParams,
            setQueryParams,
            pagination,
        }),
        [
            open,
            currentRow,
            transformedData,
            isLoading,
            isError,
            millId,
            queryParams.page,
            queryParams.limit,
            queryParams.search,
            queryParams.sortBy,
            queryParams.sortOrder,
            pagination,
        ]
    )

    return <GunnyContext value={contextValue}>{children}</GunnyContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGunny = () => {
    const gunnyContext = React.useContext(GunnyContext)

    if (!gunnyContext) {
        throw new Error('useGunny has to be used within <GunnyContext>')
    }

    return gunnyContext
}
