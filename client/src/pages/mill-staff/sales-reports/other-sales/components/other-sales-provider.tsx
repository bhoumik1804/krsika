import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useOtherSalesList } from '../data/hooks'
import { type OtherSales } from '../data/schema'
import type { OtherSalesQueryParams } from '../data/types'

type OtherSalesDialogType = 'add' | 'edit' | 'delete'

type OtherSalesContextType = {
    open: OtherSalesDialogType | null
    setOpen: (str: OtherSalesDialogType | null) => void
    currentRow: OtherSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherSales | null>>
    data: OtherSales[]
    isLoading: boolean
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

const OtherSalesContext = React.createContext<OtherSalesContextType | null>(
    null
)

interface OtherSalesProviderProps {
    children: React.ReactNode
    millId: string
    queryParams: OtherSalesQueryParams
}

export function OtherSalesProvider({
    children,
    millId,
    queryParams,
}: OtherSalesProviderProps) {
    const [open, setOpen] = useDialogState<OtherSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherSales | null>(null)

    const { data: response, isLoading } = useOtherSalesList(millId, queryParams)

    const data = response?.sales ?? []
    const pagination = response?.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    }

    return (
        <OtherSalesContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                data,
                isLoading,
                pagination,
            }}
        >
            {children}
        </OtherSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOtherSales = () => {
    const context = React.useContext(OtherSalesContext)

    if (!context) {
        throw new Error(
            'useOtherSales has to be used within <OtherSalesProvider>'
        )
    }

    return context
}
