import React, { useEffect, useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useBalanceLiftingPaddyPurchaseList } from '../data/hooks'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete' | 'view'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type BalanceLiftingPurchasesPaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: BalanceLiftingPurchasesPaddy | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<BalanceLiftingPurchasesPaddy | null>
    >
    data: BalanceLiftingPurchasesPaddy[]
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

const BalanceLiftingPurchasesPaddyContext =
    React.createContext<BalanceLiftingPurchasesPaddyContextType | null>(null)

interface BalanceLiftingPurchasesPaddyProviderProps {
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

export function BalanceLiftingPurchasesPaddyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BalanceLiftingPurchasesPaddyProviderProps) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] =
        useState<BalanceLiftingPurchasesPaddy | null>(null)
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
    } = useBalanceLiftingPaddyPurchaseList({
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
            queryParams,
            pagination,
        ]
    )

    return (
        <BalanceLiftingPurchasesPaddyContext value={contextValue}>
            {children}
        </BalanceLiftingPurchasesPaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceLiftingPurchasesPaddy = () => {
    const paddyContext = React.useContext(BalanceLiftingPurchasesPaddyContext)

    if (!paddyContext) {
        throw new Error(
            'useBalanceLiftingPurchasesPaddy has to be used within <BalanceLiftingPurchasesPaddyContext>'
        )
    }

    return paddyContext
}
