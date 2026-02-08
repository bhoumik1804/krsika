import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useRicePurchaseList } from '../data/hooks'
import { type RicePurchaseData } from '../data/schema'

type RiceDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type RiceContextType = {
    open: RiceDialogType | null
    setOpen: (str: RiceDialogType | null) => void
    currentRow: RicePurchaseData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RicePurchaseData | null>>
    data: RicePurchaseData[]
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

const RiceContext = React.createContext<RiceContextType | null>(null)

interface RiceProviderProps {
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

export function RiceProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: RiceProviderProps) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RicePurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const {
        data = [],
        pagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 },
        isLoading,
        isError,
    } = useRicePurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    return (
        <RiceContext
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
        </RiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRice = () => {
    const context = React.useContext(RiceContext)

    if (!context) {
        throw new Error('useRice has to be used within <RiceContext>')
    }

    return context
}
