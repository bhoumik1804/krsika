import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type {
    KhandaSalesListResponse,
    KhandaSalesQueryParams,
    KhandaSalesResponse,
} from '../data/types'

type KhandaSalesDialogType = 'add' | 'edit' | 'delete'

type KhandaSalesContextType = {
    open: KhandaSalesDialogType | null
    setOpen: (str: KhandaSalesDialogType | null) => void
    currentRow: KhandaSalesResponse | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<KhandaSalesResponse | null>
    >
    millId: string
    apiResponse: KhandaSalesListResponse | undefined
    queryParams: KhandaSalesQueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<KhandaSalesQueryParams>>
    isLoading: boolean
    isError: boolean
}

const KhandaSalesContext = React.createContext<KhandaSalesContextType | null>(
    null
)

type KhandaSalesProviderProps = {
    children: React.ReactNode
    millId: string
    apiResponse?: KhandaSalesListResponse
    isLoading?: boolean
    isError?: boolean
}

export function KhandaSalesProvider({
    children,
    millId,
    apiResponse,
    isLoading = false,
    isError = false,
}: KhandaSalesProviderProps) {
    const [open, setOpen] = useDialogState<KhandaSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KhandaSalesResponse | null>(
        null
    )
    const [queryParams, setQueryParams] = useState<KhandaSalesQueryParams>({
        page: 1,
        limit: 10,
    })

    return (
        <KhandaSalesContext
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
        </KhandaSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useKhandaSales = () => {
    const context = React.useContext(KhandaSalesContext)

    if (!context) {
        throw new Error(
            'useKhandaSales has to be used within <KhandaSalesProvider>'
        )
    }

    return context
}
