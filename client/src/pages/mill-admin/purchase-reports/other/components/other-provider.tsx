import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useOtherPurchaseList } from '../data/hooks'
import { type OtherPurchase } from '../data/schema'

type OtherDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type OtherContextType = {
    open: OtherDialogType | null
    setOpen: (str: OtherDialogType | null) => void
    currentRow: OtherPurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherPurchase | null>>
    data: OtherPurchase[]
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

const OtherContext = React.createContext<OtherContextType | null>(null)

interface OtherProviderProps {
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

export function OtherProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    onQueryParamsChange,
}: OtherProviderProps) {
    const [open, setOpen] = useDialogState<OtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherPurchase | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

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

    const {
        data = [],
        pagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 },
        isLoading,
        isError,
    } = useOtherPurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    return (
        <OtherContext
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
        </OtherContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOther = () => {
    const otherContext = React.useContext(OtherContext)

    if (!otherContext) {
        throw new Error('useOther has to be used within <OtherContext>')
    }

    return otherContext
}
