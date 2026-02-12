import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useCommitteeList } from '../data/hooks'
import { type CommitteeReportData } from '../data/schema'

type CommitteeReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type CommitteeReportContextType = {
    open: CommitteeReportDialogType | null
    setOpen: (str: CommitteeReportDialogType | null) => void
    currentRow: CommitteeReportData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<CommitteeReportData | null>
    >
    data: CommitteeReportData[]
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

const CommitteeReportContext =
    React.createContext<CommitteeReportContextType | null>(null)

interface CommitteeReportProviderProps {
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

export function CommitteeReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: CommitteeReportProviderProps) {
    const [open, setOpen] = useDialogState<CommitteeReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<CommitteeReportData | null>(
        null
    )
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useCommitteeList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <CommitteeReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.committees ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </CommitteeReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCommitteeReport = () => {
    const context = React.useContext(CommitteeReportContext)

    if (!context) {
        throw new Error(
            'useCommitteeReport has to be used within <CommitteeReportProvider>'
        )
    }

    return context
}
