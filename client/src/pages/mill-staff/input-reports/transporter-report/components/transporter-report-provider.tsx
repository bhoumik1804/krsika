import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useTransporterList } from '../data/hooks'
import { type TransporterReportData } from '../data/schema'

type TransporterReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type TransporterReportContextType = {
    open: TransporterReportDialogType | null
    setOpen: (str: TransporterReportDialogType | null) => void
    currentRow: TransporterReportData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<TransporterReportData | null>
    >
    data: TransporterReportData[]
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

const TransporterReportContext =
    React.createContext<TransporterReportContextType | null>(null)

interface TransporterReportProviderProps {
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

export function TransporterReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: TransporterReportProviderProps) {
    const [open, setOpen] = useDialogState<TransporterReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<TransporterReportData | null>(
        null
    )
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useTransporterList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <TransporterReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.transporters ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </TransporterReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTransporterReport = () => {
    const context = React.useContext(TransporterReportContext)

    if (!context) {
        throw new Error(
            'useTransporterReport has to be used within <TransporterReportProvider>'
        )
    }

    return context
}
