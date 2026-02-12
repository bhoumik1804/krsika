import React, { useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PaddyPurchaseData } from '../data/schema'
import type {
    PaddyPurchaseQueryParams,
    PaddyPurchaseResponse,
    PaddyPurchaseListResponse,
} from '../data/types'

type PaddyDialogType = 'add' | 'edit' | 'delete'

interface QueryParams extends PaddyPurchaseQueryParams {
    page: number
    limit: number
    sortOrder?: 'asc' | 'desc'
}

type PaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: PaddyPurchaseData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<PaddyPurchaseData | null>
    >
    data: PaddyPurchaseResponse[]
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

const PaddyContext = React.createContext<PaddyContextType | null>(null)

interface PaddyProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
    apiResponse?: PaddyPurchaseListResponse
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

export function PaddyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    apiResponse,
    isLoading = false,
    isError = false,
}: PaddyProviderProps) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddyPurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const data = useMemo(() => {
        const list = apiResponse?.data || []
        return Array.isArray(list) ? list : []
    }, [apiResponse?.data])

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

    return <PaddyContext value={contextValue}>{children}</PaddyContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaddy = () => {
    const paddyContext = React.useContext(PaddyContext)

    if (!paddyContext) {
        throw new Error('usePaddy has to be used within <PaddyContext>')
    }

    return paddyContext
}
