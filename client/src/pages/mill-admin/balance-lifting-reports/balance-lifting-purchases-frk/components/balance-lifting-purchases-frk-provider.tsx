import React, { useEffect, useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useBalanceLiftingFrkPurchaseList } from '../data/hooks'
import { type BalanceLiftingPurchasesFrk } from '../data/schema'

type FrkDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type BalanceLiftingPurchasesFrkContextType = {
    open: FrkDialogType | null
    setOpen: (str: FrkDialogType | null) => void
    currentRow: BalanceLiftingPurchasesFrk | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<BalanceLiftingPurchasesFrk | null>
    >
    data: BalanceLiftingPurchasesFrk[]
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

const BalanceLiftingPurchasesFrkContext =
    React.createContext<BalanceLiftingPurchasesFrkContextType | null>(null)

interface BalanceLiftingPurchasesFrkProviderProps {
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

export function BalanceLiftingPurchasesFrkProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BalanceLiftingPurchasesFrkProviderProps) {
    const [open, setOpen] = useDialogState<FrkDialogType>(null)
    const [currentRow, setCurrentRow] =
        useState<BalanceLiftingPurchasesFrk | null>(null)
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
    } = useBalanceLiftingFrkPurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    // Memoized pagination to prevent flickering
    const pagination = useMemo(
        () => ({
            page: apiResponse?.pagination?.page || 1,
            pageSize: apiResponse?.pagination?.limit || 10,
            total: apiResponse?.pagination?.total || 0,
            totalPages: apiResponse?.pagination?.totalPages || 0,
        }),
        [
            apiResponse?.pagination?.page,
            apiResponse?.pagination?.limit,
            apiResponse?.pagination?.total,
            apiResponse?.pagination?.totalPages,
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
            queryParams.page,
            queryParams.limit,
            queryParams.search,
            queryParams.sortBy,
            queryParams.sortOrder,
            pagination,
        ]
    )

    return (
        <BalanceLiftingPurchasesFrkContext value={contextValue}>
            {children}
        </BalanceLiftingPurchasesFrkContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceLiftingPurchasesFrk = () => {
    const frkContext = React.useContext(BalanceLiftingPurchasesFrkContext)

    if (!frkContext) {
        throw new Error(
            'useBalanceLiftingPurchasesFrk has to be used within <BalanceLiftingPurchasesFrkContext>'
        )
    }

    return frkContext
}
