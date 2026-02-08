import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useFrkPurchaseList } from '../data/hooks'
import { type FrkPurchaseData } from '../data/schema'

type FrkDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type FrkContextType = {
    open: FrkDialogType | null
    setOpen: (str: FrkDialogType | null) => void
    currentRow: FrkPurchaseData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FrkPurchaseData | null>>
    data: FrkPurchaseData[]
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

const FrkContext = React.createContext<FrkContextType | null>(null)

interface FrkProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
    onQueryParamsChange?: (params: QueryParams) => void
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function FrkProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    onQueryParamsChange,
}: FrkProviderProps) {
    const [open, setOpen] = useDialogState<FrkDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FrkPurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    // Sync URL params with internal state
    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams.page, initialQueryParams.limit, initialQueryParams.search])

    // Notify parent when queryParams change
    useEffect(() => {
        onQueryParamsChange?.(queryParams)
    }, [queryParams, onQueryParamsChange])

    const {
        data = [],
        pagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 },
        isLoading,
        isError,
    } = useFrkPurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    return (
        <FrkContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
                pagination: {
                    page: pagination.page || 1,
                    pageSize: pagination.pageSize || 10,
                    total: pagination.total || 0,
                    totalPages: pagination.totalPages || 0,
                },
            }}
        >
            {children}
        </FrkContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFrk = () => {
    const frkContext = React.useContext(FrkContext)

    if (!frkContext) {
        throw new Error('useFrk has to be used within <FrkContext>')
    }

    return frkContext
}
