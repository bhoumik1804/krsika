import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useBrokerList } from '../data/hooks'
import { type BrokerReportData } from '../data/schema'

type BrokerReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type BrokerReportContextType = {
    open: BrokerReportDialogType | null
    setOpen: (str: BrokerReportDialogType | null) => void
    currentRow: BrokerReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BrokerReportData | null>>
    data: BrokerReportData[]
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

const BrokerReportContext = React.createContext<BrokerReportContextType | null>(
    null
)

interface BrokerReportProviderProps {
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

export function BrokerReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BrokerReportProviderProps) {
    const [open, setOpen] = useDialogState<BrokerReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BrokerReportData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useBrokerList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <BrokerReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.brokers ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </BrokerReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBrokerReport = () => {
    const context = React.useContext(BrokerReportContext)

    if (!context) {
        throw new Error(
            'useBrokerReport has to be used within <BrokerReportProvider>'
        )
    }

    return context
}
