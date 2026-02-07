import React, { useState, useMemo, ReactNode } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useTransporterList, type TransporterQueryParams } from '../data/hooks'
import { type TransporterReportData } from '../data/schema'

type TransporterReportDialogType = 'add' | 'edit' | 'delete'

export interface TransporterReportContextType {
    open: TransporterReportDialogType | null
    setOpen: (str: TransporterReportDialogType | null) => void
    currentRow: TransporterReportData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<TransporterReportData | null>
    >
    // Data fetching
    data: TransporterReportData[]
    isLoading: boolean
    isError: boolean
    pagination?: {
        page: number
        limit: number
        total: number
        pages: number
    }
    // Query params
    queryParams?: TransporterQueryParams
    setQueryParams: (params: TransporterQueryParams) => void
    // Mill ID
    millId: string
}

const TransporterReportContext =
    React.createContext<TransporterReportContextType | null>(null)

interface TransporterReportProviderProps {
    children: ReactNode
    millId: string
    initialQueryParams?: TransporterQueryParams
}

export function TransporterReportProvider({
    children,
    millId,
    initialQueryParams,
}: TransporterReportProviderProps) {
    const [open, setOpen] = useDialogState<TransporterReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<TransporterReportData | null>(
        null
    )
    const [queryParams, setQueryParams] = useState<TransporterQueryParams>(
        initialQueryParams || { page: 1, limit: 10 }
    )

    // Fetch transporters data
    const {
        data: transporterResponse,
        isLoading,
        isError,
    } = useTransporterList(millId, queryParams)

    // Extract transporters data and pagination
    const transportersData = useMemo(
        () => transporterResponse?.transporters || [],
        [transporterResponse?.transporters]
    )

    const pagination = useMemo(
        () => transporterResponse?.pagination,
        [transporterResponse?.pagination]
    )

    const contextValue: TransporterReportContextType = {
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        data: transportersData,
        isLoading,
        isError,
        pagination,
        queryParams,
        setQueryParams,
        millId,
    }

    return (
        <TransporterReportContext value={contextValue}>
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
