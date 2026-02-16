import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useLabourGroupList } from '../data/hooks'
import { type LabourGroupReportData } from '../data/schema'

type LabourGroupReportDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type LabourGroupReportContextType = {
    open: LabourGroupReportDialogType | null
    setOpen: (str: LabourGroupReportDialogType | null) => void
    currentRow: LabourGroupReportData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<LabourGroupReportData | null>
    >
    data: LabourGroupReportData[]
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

const LabourGroupReportContext =
    React.createContext<LabourGroupReportContextType | null>(null)

interface LabourGroupReportProviderProps {
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

export function LabourGroupReportProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: LabourGroupReportProviderProps) {
    const [open, setOpen] = useDialogState<LabourGroupReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourGroupReportData | null>(
        null
    )
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data, isLoading, isError } = useLabourGroupList(millId, queryParams)

    return (
        <LabourGroupReportContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: data?.labourGroups ?? [],
                pagination: data?.pagination,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
            }}
        >
            {children}
        </LabourGroupReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLabourGroupReport = () => {
    const context = React.useContext(LabourGroupReportContext)

    if (!context) {
        throw new Error(
            'useLabourGroupReport has to be used within <LabourGroupReportProvider>'
        )
    }

    return context
}
