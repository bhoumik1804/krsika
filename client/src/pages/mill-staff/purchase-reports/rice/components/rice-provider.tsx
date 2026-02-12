import React, { useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
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
        pageSize: number
        total: number
        totalPages: number
    }
}

const RiceContext = React.createContext<RiceContextType | null>(null)

interface RiceProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
    apiData?: RicePurchaseData[]
    apiPagination?: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
    isLoading?: boolean
    isError?: boolean
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
    apiData = [],
    apiPagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    isLoading = false,
    isError = false,
}: RiceProviderProps) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RicePurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const pagination = useMemo(
        () => ({
            page: apiPagination.page || 1,
            pageSize: apiPagination.pageSize || 10,
            total: apiPagination.total || 0,
            totalPages: apiPagination.totalPages || 0,
        }),
        [
            apiPagination.page,
            apiPagination.pageSize,
            apiPagination.total,
            apiPagination.totalPages,
        ]
    )

    const contextValue = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            data: apiData,
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
            apiData,
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
