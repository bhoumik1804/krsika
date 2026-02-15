import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useStaffList } from '../data/hooks'
import { type StaffReportData } from '../data/schema'

type StaffReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type StaffReportContextType = {
    open: StaffReportDialogType | null
    setOpen: (str: StaffReportDialogType | null) => void
    currentRow: StaffReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StaffReportData | null>>
    data: StaffReportData[]
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

const StaffReportContext = React.createContext<StaffReportContextType | null>(
    null
)

interface StaffReportProviderProps {
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

export function StaffReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: StaffReportProviderProps) {
    const [open, setOpen] = useDialogState<StaffReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StaffReportData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useStaffList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
    })

    return (
        <StaffReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.staff ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </StaffReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStaffReport = () => {
    const context = React.useContext(StaffReportContext)

    if (!context) {
        throw new Error(
            'useStaffReport has to be used within <StaffReportProvider>'
        )
    }

    return context
}
