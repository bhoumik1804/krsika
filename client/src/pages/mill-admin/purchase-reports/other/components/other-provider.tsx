import React, { useEffect, useState, useMemo } from 'react'
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
}: OtherProviderProps) {
    const [open, setOpen] = useDialogState<OtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherPurchase | null>(null)
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
    } = useOtherPurchaseList({
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
            data: apiResponse?.purchases || [],
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
            apiResponse?.purchases,
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

    return <OtherContext value={contextValue}>{children}</OtherContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOther = () => {
    const otherContext = React.useContext(OtherContext)

    if (!otherContext) {
        throw new Error('useOther has to be used within <OtherContext>')
    }

    return otherContext
}
