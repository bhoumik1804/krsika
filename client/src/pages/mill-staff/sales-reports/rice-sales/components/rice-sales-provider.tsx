import React, { useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RiceSales } from '../data/schema'
import type {
    RiceSalesQueryParams,
    RiceSalesResponse,
    RiceSalesListResponse,
} from '../data/types'

type RiceSalesDialogType = 'add' | 'edit' | 'delete'

interface QueryParams extends RiceSalesQueryParams {
    page: number
    limit: number
    sortOrder?: 'asc' | 'desc'
}

type RiceSalesContextType = {
    open: RiceSalesDialogType | null
    setOpen: (str: RiceSalesDialogType | null) => void
    currentRow: RiceSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RiceSales | null>>
    data: RiceSalesResponse[]
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
    }
}

const RiceSalesContext = React.createContext<RiceSalesContextType | null>(null)

interface RiceSalesProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
    apiResponse?: RiceSalesListResponse
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

export function RiceSalesProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    apiResponse,
    isLoading = false,
    isError = false,
}: RiceSalesProviderProps) {
    const [open, setOpen] = useDialogState<RiceSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RiceSales | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const data = useMemo(() => {
        const list = apiResponse?.sales || []
        return Array.isArray(list) ? list : []
    }, [apiResponse?.sales])

    const pagination = useMemo(
        () => ({
            page: apiResponse?.pagination?.page || 1,
            limit: apiResponse?.pagination?.limit || 10,
            total: apiResponse?.pagination?.total || 0,
            totalPages: apiResponse?.pagination?.totalPages || 1,
        }),
        [
            apiResponse?.pagination?.page,
            apiResponse?.pagination?.limit,
            apiResponse?.pagination?.total,
            apiResponse?.pagination?.totalPages,
        ]
    )

    const contextValue = useMemo(
        () => ({
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
            pagination,
        }),
        [
            open,
            currentRow,
            data,
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

    return <RiceSalesContext value={contextValue}>{children}</RiceSalesContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRiceSales = () => {
    const context = React.useContext(RiceSalesContext)

    if (!context) {
        throw new Error('useRiceSales has to be used within <RiceSalesContext>')
    }

    return context
}
