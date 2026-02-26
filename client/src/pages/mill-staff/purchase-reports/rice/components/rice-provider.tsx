import React, { useMemo, useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useRicePurchaseList } from '../data/hooks'
import { type RicePurchaseData } from '../data/schema'

type RiceDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type RiceContextType = {
    open: RiceDialogType | null
    setOpen: (str: RiceDialogType | null) => void
    currentRow: RicePurchaseData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RicePurchaseData | null>>
    data: RicePurchaseData[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
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

const RiceContext = React.createContext<RiceContextType | null>(null)

interface RiceProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function RiceProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: RiceProviderProps) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RicePurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const {
        data: apiResponse,
        isLoading,
        isError,
    } = useRicePurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    const pagination = useMemo(
        () =>
            apiResponse?.pagination || {
                page: queryParams.page || 1,
                limit: queryParams.limit || 10,
                total: 0,
                totalPages: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            },
        [apiResponse?.pagination, queryParams.page, queryParams.limit]
    )

    const contextValue = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            data: apiResponse?.data || [],
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
            apiResponse?.data,
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

    return <RiceContext value={contextValue}>{children}</RiceContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRice = () => {
    const context = React.useContext(RiceContext)

    if (!context) {
        throw new Error('useRice has to be used within <RiceContext>')
    }

    return context
}
