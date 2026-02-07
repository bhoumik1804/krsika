import React, { useState, useMemo, ReactNode } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePartyList, type PartyQueryParams } from '../data/hooks'
import { type PartyReportData } from '../data/schema'

type PartyReportDialogType = 'add' | 'edit' | 'delete'

export interface PartyReportContextType {
    open: PartyReportDialogType | null
    setOpen: (str: PartyReportDialogType | null) => void
    currentRow: PartyReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PartyReportData | null>>
    // Data fetching
    data: PartyReportData[]
    isLoading: boolean
    isError: boolean
    pagination?: {
        page: number
        limit: number
        total: number
        pages: number
    }
    // Query params
    queryParams?: PartyQueryParams
    setQueryParams: (params: PartyQueryParams) => void
    // Mill ID
    millId: string
}

const PartyReportContext = React.createContext<PartyReportContextType | null>(
    null
)

interface PartyReportProviderProps {
    children: ReactNode
    millId: string
    initialQueryParams?: PartyQueryParams
}

export function PartyReportProvider({
    children,
    millId,
    initialQueryParams,
}: PartyReportProviderProps) {
    const [open, setOpen] = useDialogState<PartyReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PartyReportData | null>(null)
    const [queryParams, setQueryParams] = useState<PartyQueryParams>(
        initialQueryParams || { page: 1, limit: 10 }
    )

    // Fetch parties data
    const {
        data: partyResponse,
        isLoading,
        isError,
    } = usePartyList(millId, queryParams)

    // Extract parties data and pagination
    const partiesData = useMemo(
        () => partyResponse?.parties || [],
        [partyResponse?.parties]
    )

    const pagination = useMemo(
        () => partyResponse?.pagination,
        [partyResponse?.pagination]
    )

    const contextValue: PartyReportContextType = {
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        data: partiesData,
        isLoading,
        isError,
        pagination,
        queryParams,
        setQueryParams,
        millId,
    }

    return (
        <PartyReportContext value={contextValue}>{children}</PartyReportContext>
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
