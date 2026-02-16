import React, { useEffect, useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePrivateRiceOutwardList } from '../data/hooks'
import type {
    PrivateRiceOutward,
    PrivateRiceOutwardQueryParams,
} from '../data/types'

type OutwardBalanceLiftingRiceDialogType = 'add' | 'edit' | 'delete'

type OutwardBalanceLiftingRiceContextType = {
    open: OutwardBalanceLiftingRiceDialogType | null
    setOpen: (str: OutwardBalanceLiftingRiceDialogType | null) => void
    currentRow: PrivateRiceOutward | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<PrivateRiceOutward | null>
    >
    data: PrivateRiceOutward[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: PrivateRiceOutwardQueryParams
    setQueryParams: React.Dispatch<
        React.SetStateAction<PrivateRiceOutwardQueryParams>
    >
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
}

const OutwardBalanceLiftingRiceContext =
    React.createContext<OutwardBalanceLiftingRiceContextType | null>(null)

interface OutwardBalanceLiftingRiceProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: PrivateRiceOutwardQueryParams
}

const defaultQueryParams: PrivateRiceOutwardQueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
}

export function OutwardBalanceLiftingRiceProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: OutwardBalanceLiftingRiceProviderProps) {
    const [open, setOpen] =
        useDialogState<OutwardBalanceLiftingRiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PrivateRiceOutward | null>(
        null
    )
    const [queryParams, setQueryParams] =
        useState<PrivateRiceOutwardQueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const {
        data: apiResponse,
        isLoading,
        isError,
    } = usePrivateRiceOutwardList(millId, queryParams)

    const pagination = useMemo(
        () => ({
            page: apiResponse?.pagination.page || 1,
            pageSize: apiResponse?.pagination.limit || 10,
            total: apiResponse?.pagination.total || 0,
            totalPages: apiResponse?.pagination.totalPages || 0,
        }),
        [
            apiResponse?.pagination.page,
            apiResponse?.pagination.limit,
            apiResponse?.pagination.total,
            apiResponse?.pagination.totalPages,
        ]
    )

    const contextValue = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            data: apiResponse?.entries || [],
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
            apiResponse?.entries,
            isLoading,
            isError,
            millId,
            queryParams,
            pagination,
        ]
    )

    return (
        <OutwardBalanceLiftingRiceContext value={contextValue}>
            {children}
        </OutwardBalanceLiftingRiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOutwardBalanceLiftingRice = () => {
    const context = React.useContext(OutwardBalanceLiftingRiceContext)

    if (!context) {
        throw new Error(
            'useOutwardBalanceLiftingRice has to be used within <OutwardBalanceLiftingRiceContext>'
        )
    }

    return context
}
