import React, { useEffect, useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePaddySalesList } from '../data/hooks'
import { type PaddySalesResponse } from '../data/types'

type PaddySalesDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type BalanceLiftingSalesPaddyContextType = {
    open: PaddySalesDialogType | null
    setOpen: (str: PaddySalesDialogType | null) => void
    currentRow: PaddySalesResponse | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<PaddySalesResponse | null>
    >
    data: PaddySalesResponse[]
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

const BalanceLiftingSalesPaddyContext =
    React.createContext<BalanceLiftingSalesPaddyContextType | null>(null)

interface BalanceLiftingSalesPaddyProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
}

export function BalanceLiftingSalesPaddyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BalanceLiftingSalesPaddyProviderProps) {
    const [open, setOpen] = useDialogState<PaddySalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddySalesResponse | null>(
        null
    )
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    // Sync URL params with internal state
    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const {
        data: apiResponse,
        isLoading,
        isError,
    } = usePaddySalesList(
        {
            page: queryParams.page,
            limit: queryParams.limit,
            search: queryParams.search,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder,
        },
        { enabled: !!millId }
    )

    // Memoized pagination to prevent flickering
    const pagination = useMemo(
        () => ({
            page: apiResponse?.currentPage || 1,
            pageSize: apiResponse?.pageSize || 10,
            total: apiResponse?.total || 0,
            totalPages: apiResponse?.totalPages || 0,
        }),
        [
            apiResponse?.currentPage,
            apiResponse?.pageSize,
            apiResponse?.total,
            apiResponse?.totalPages,
        ]
    )

    // Memoized context value to prevent flickering
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
            queryParams,
            pagination,
        ]
    )

    return (
        <BalanceLiftingSalesPaddyContext.Provider value={contextValue}>
            {children}
        </BalanceLiftingSalesPaddyContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceLiftingSalesPaddy = () => {
    const context = React.useContext(BalanceLiftingSalesPaddyContext)

    if (!context) {
        throw new Error(
            'useBalanceLiftingSalesPaddy has to be used within <BalanceLiftingSalesPaddyContext>'
        )
    }

    return context
}
