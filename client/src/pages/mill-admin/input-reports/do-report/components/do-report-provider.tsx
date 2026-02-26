import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useDoReportList } from '../data/hooks'
import { type DoReportData } from '../data/schema'
import type { DoReportQueryParams } from '../data/types'

type DoReportDialogType = 'add' | 'edit' | 'delete'

interface DoReportContextType {
    open: DoReportDialogType | null
    setOpen: (str: DoReportDialogType | null) => void
    currentRow: DoReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<DoReportData | null>>
    data: DoReportData[]
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
    queryParams: DoReportQueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<DoReportQueryParams>>
}

const DoReportContext = React.createContext<DoReportContextType | null>(null)

interface DoReportProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: DoReportQueryParams
}

const defaultQueryParams: DoReportQueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function DoReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: DoReportProviderProps) {
    const [open, setOpen] = useDialogState<DoReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<DoReportData | null>(null)
    const [queryParams, setQueryParams] =
        useState<DoReportQueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useDoReportList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <DoReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.reports ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </DoReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDoReport = () => {
    const context = React.useContext(DoReportContext)

    if (!context) {
        throw new Error('useDoReport has to be used within <DoReportProvider>')
    }

    return context
}
