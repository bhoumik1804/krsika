import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePartyList } from '../data/hooks'
import { type PartyReportData } from '../data/schema'

type PartyReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type PartyReportContextType = {
    open: PartyReportDialogType | null
    setOpen: (str: PartyReportDialogType | null) => void
    currentRow: PartyReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PartyReportData | null>>
    data: PartyReportData[]
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

const PartyReportContext = React.createContext<PartyReportContextType | null>(
    null
)

interface PartyReportProviderProps {
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

export function PartyReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: PartyReportProviderProps) {
    const [open, setOpen] = useDialogState<PartyReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PartyReportData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = usePartyList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <PartyReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.parties ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </PartyReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePartyReport = () => {
    const context = React.useContext(PartyReportContext)

    if (!context) {
        throw new Error(
            'usePartyReport has to be used within <PartyReportProvider>'
        )
    }

    return context
}
