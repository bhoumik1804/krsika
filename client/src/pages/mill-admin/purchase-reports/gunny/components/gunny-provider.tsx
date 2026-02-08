import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useGunnyPurchaseList } from '../data/hooks'
import { type GunnyPurchaseData } from '../data/schema'

type GunnyDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

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
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
}

const GunnyContext = React.createContext<GunnyContextType | null>(null)

interface GunnyProviderProps {
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

export function GunnyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    onQueryParamsChange,
}: GunnyProviderProps) {
    const [open, setOpen] = useDialogState<GunnyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnyPurchaseData | null>(null)
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
    } = useGunnyPurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    return (
        <GunnyContext
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
        </GunnyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGunny = () => {
    const context = React.useContext(GunnyContext)

    if (!context) {
        throw new Error('useGunny has to be used within <GunnyContext>')
    }

    return context
}
