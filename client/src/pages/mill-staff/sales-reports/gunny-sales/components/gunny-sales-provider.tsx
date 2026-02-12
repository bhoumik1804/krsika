import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type {
    GunnySalesListResponse,
    GunnySalesQueryParams,
    GunnySalesResponse,
} from '../data/types'

type GunnySalesDialogType = 'add' | 'edit' | 'delete'

type GunnySalesContextType = {
    open: GunnySalesDialogType | null
    setOpen: (str: GunnySalesDialogType | null) => void
    currentRow: GunnySalesResponse | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<GunnySalesResponse | null>
    >
    millId: string
    apiResponse: GunnySalesListResponse | undefined
    queryParams: GunnySalesQueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<GunnySalesQueryParams>>
    isLoading: boolean
    isError: boolean
}

const GunnySalesContext = React.createContext<GunnySalesContextType | null>(
    null
)

type GunnySalesProviderProps = {
    children: React.ReactNode
    millId: string
    apiResponse?: GunnySalesListResponse
    isLoading?: boolean
    isError?: boolean
}

export function GunnySalesProvider({
    children,
    millId,
    apiResponse,
    isLoading = false,
    isError = false,
}: GunnySalesProviderProps) {
    const [open, setOpen] = useDialogState<GunnySalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnySalesResponse | null>(
        null
    )
    const [queryParams, setQueryParams] = useState<GunnySalesQueryParams>({
        page: 1,
        limit: 10,
    })

    return (
        <GunnySalesContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                millId,
                apiResponse,
                queryParams,
                setQueryParams,
                isLoading,
                isError,
            }}
        >
            {children}
        </GunnySalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGunnySales = () => {
    const context = React.useContext(GunnySalesContext)

    if (!context) {
        throw new Error(
            'useGunnySales has to be used within <GunnySalesProvider>'
        )
    }

    return context
}
