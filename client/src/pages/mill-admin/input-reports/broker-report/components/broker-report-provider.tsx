import React, { useState, useMemo, ReactNode } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useBrokerList, type BrokerQueryParams } from '../data/hooks'
import { type BrokerReportData } from '../data/schema'

type BrokerReportDialogType = 'add' | 'edit' | 'delete'

export interface BrokerReportContextType {
    open: BrokerReportDialogType | null
    setOpen: (str: BrokerReportDialogType | null) => void
    currentRow: BrokerReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BrokerReportData | null>>
    // Data fetching
    data: BrokerReportData[]
    isLoading: boolean
    isError: boolean
    pagination?: {
        page: number
        limit: number
        total: number
        pages: number
    }
    // Query params
    queryParams?: BrokerQueryParams
    setQueryParams: (params: BrokerQueryParams) => void
    // Mill ID
    millId: string
}

const BrokerReportContext = React.createContext<BrokerReportContextType | null>(
    null
)

interface BrokerReportProviderProps {
    children: ReactNode
    millId: string
    initialQueryParams?: BrokerQueryParams
}

export function BrokerReportProvider({
    children,
    millId,
    initialQueryParams,
}: BrokerReportProviderProps) {
    const [open, setOpen] = useDialogState<BrokerReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BrokerReportData | null>(null)
    const [queryParams, setQueryParams] = useState<BrokerQueryParams>(
        initialQueryParams || { page: 1, limit: 10 }
    )

    // Fetch brokers data
    const {
        data: brokerResponse,
        isLoading,
        isError,
    } = useBrokerList(millId, queryParams)

    // Extract brokers data and pagination
    const brokersData = useMemo(
        () => brokerResponse?.brokers || [],
        [brokerResponse?.brokers]
    )

    const pagination = useMemo(
        () => brokerResponse?.pagination,
        [brokerResponse?.pagination]
    )

    const contextValue: BrokerReportContextType = {
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        data: brokersData,
        isLoading,
        isError,
        pagination,
        queryParams,
        setQueryParams,
        millId,
    }

    return (
        <BrokerReportContext value={contextValue}>
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
