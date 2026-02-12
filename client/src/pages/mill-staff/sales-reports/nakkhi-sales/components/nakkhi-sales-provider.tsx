import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type {
    NakkhiSalesListResponse,
    NakkhiSalesQueryParams,
    NakkhiSalesResponse,
} from '../data/types'

type NakkhiSalesDialogType = 'add' | 'edit' | 'delete'

type NakkhiSalesContextType = {
    open: NakkhiSalesDialogType | null
    setOpen: (str: NakkhiSalesDialogType | null) => void
    currentRow: NakkhiSalesResponse | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<NakkhiSalesResponse | null>
    >
    millId: string
    apiResponse: NakkhiSalesListResponse | undefined
    queryParams: NakkhiSalesQueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<NakkhiSalesQueryParams>>
    isLoading: boolean
    isError: boolean
}

const NakkhiSalesContext = React.createContext<NakkhiSalesContextType | null>(
    null
)

type NakkhiSalesProviderProps = {
    children: React.ReactNode
    millId: string
    apiResponse?: NakkhiSalesListResponse
    isLoading?: boolean
    isError?: boolean
}

export function NakkhiSalesProvider({
    children,
    millId,
    apiResponse,
    isLoading = false,
    isError = false,
}: NakkhiSalesProviderProps) {
    const [open, setOpen] = useDialogState<NakkhiSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<NakkhiSalesResponse | null>(
        null
    )
    const [queryParams, setQueryParams] = useState<NakkhiSalesQueryParams>({
        page: 1,
        limit: 10,
    })

    return (
        <NakkhiSalesContext
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
        </NakkhiSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNakkhiSales = () => {
    const context = React.useContext(NakkhiSalesContext)

    if (!context) {
        throw new Error(
            'useNakkhiSales has to be used within <NakkhiSalesProvider>'
        )
    }

    return context
}
