import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherInward } from '../data/schema'

type OtherInwardDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type OtherInwardContextType = {
    open: OtherInwardDialogType | null
    setOpen: (str: OtherInwardDialogType | null) => void
    currentRow: OtherInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherInward | null>>
    data: OtherInward[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

const OtherInwardContext = React.createContext<OtherInwardContextType | null>(
    null
)

interface OtherInwardProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
    apiData?: OtherInward[]
    apiPagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    isLoading?: boolean
    isError?: boolean
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function OtherInwardProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
    apiData = [],
    apiPagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
    isLoading = false,
    isError = false,
}: OtherInwardProviderProps) {
    const [open, setOpen] = useDialogState<OtherInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherInward | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    // Sync URL params with internal state
    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [
        initialQueryParams.page,
        initialQueryParams.limit,
        initialQueryParams.search,
        initialQueryParams.sortBy,
        initialQueryParams.sortOrder,
    ])

    return (
        <OtherInwardContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data: apiData,
                isLoading,
                isError,
                millId,
                queryParams,
                setQueryParams,
                pagination: apiPagination,
            }}
        >
            {children}
        </OtherInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOtherInward = () => {
    const context = React.useContext(OtherInwardContext)

    if (!context) {
        throw new Error(
            'useOtherInward has to be used within <OtherInwardContext>'
        )
    }

    return context
}
