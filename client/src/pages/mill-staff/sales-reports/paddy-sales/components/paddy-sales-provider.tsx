import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePaddySalesList } from '../data/hooks'
import { type PaddySales } from '../data/schema'
import type { PaddySalesResponse } from '../data/types'

type PaddySalesDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type PaddySalesContextType = {
    open: PaddySalesDialogType | null
    setOpen: (str: PaddySalesDialogType | null) => void
    currentRow: PaddySales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaddySales | null>>
    data: PaddySalesResponse[]
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
}

const PaddySalesContext = React.createContext<PaddySalesContextType | null>(
    null
)

interface PaddySalesProviderProps {
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

export function PaddySalesProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: PaddySalesProviderProps) {
    const [open, setOpen] = useDialogState<PaddySalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddySales | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = usePaddySalesList(
        {
            page: queryParams.page,
            limit: queryParams.limit,
            search: queryParams.search,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder,
        },
        { enabled: !!millId }
    )

    return (
        <PaddySalesContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                millId,
                queryParams,
                setQueryParams,
                data: data?.data ?? [],
                pagination: {
                    page: data?.currentPage ?? 1,
                    limit: data?.pageSize ?? 10,
                    total: data?.total ?? 0,
                    totalPages: data?.totalPages ?? 0,
                    hasPrevPage: data?.hasPrevPage ?? false,
                    hasNextPage: data?.hasNextPage ?? false,
                    prevPage: data?.prevPage ?? null,
                    nextPage: data?.nextPage ?? null,
                },
                isLoading,
                isError,
            }}
        >
            {children}
        </PaddySalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaddySales = () => {
    const context = React.useContext(PaddySalesContext)

    if (!context) {
        throw new Error(
            'usePaddySales has to be used within <PaddySalesProvider>'
        )
    }

    return context
}
