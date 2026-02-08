import React, { useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePaddyPurchaseList } from '../data/hooks'
import { type PaddyPurchaseData } from '../data/schema'
import type {
    PaddyPurchaseQueryParams,
    PaddyPurchaseResponse,
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
}: PaddyProviderProps) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddyPurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const queryParamsForAPI = useMemo(
        () => ({
            page: queryParams.page,
            limit: queryParams.limit,
            search: queryParams.search,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder,
        }),
        [queryParams]
    )

    const {
        data: apiResponse,
        isLoading,
        isError,
    } = usePaddyPurchaseList(millId, queryParamsForAPI, { enabled: !!millId })

    const data = useMemo(() => {
        const list = apiResponse?.purchases || []
        return Array.isArray(list) ? list : []
    }, [apiResponse])

    const pagination = useMemo(
        () => ({
            page: apiResponse?.pagination?.page || 1,
            limit: apiResponse?.pagination?.limit || 10,
            total: apiResponse?.pagination?.total || 0,
            totalPages: apiResponse?.pagination?.totalPages || 1,
        }),
        [apiResponse?.pagination]
    )

    return (
        <PaddyContext
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
                pagination,
            }}
        >
            {children}
        </PaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaddy = () => {
    const paddyContext = React.useContext(PaddyContext)

    if (!paddyContext) {
        throw new Error('usePaddy has to be used within <PaddyContext>')
    }

    return paddyContext
}
