import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type NakkhiSales } from '../data/schema'

type NakkhiSalesDialogType = 'add' | 'edit' | 'delete'

type NakkhiSalesContextType = {
    open: NakkhiSalesDialogType | null
    setOpen: (str: NakkhiSalesDialogType | null) => void
    currentRow: NakkhiSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<NakkhiSales | null>>
}

const NakkhiSalesContext = React.createContext<NakkhiSalesContextType | null>(null)

export function NakkhiSalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<NakkhiSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<NakkhiSales | null>(null)

    return (
        <NakkhiSalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </NakkhiSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const nakkhiSales = () => {
    const context = React.useContext(NakkhiSalesContext)

    if (!context) {
        throw new Error('nakkhiSales has to be used within <NakkhiSalesContext>')
    }

    return context
}
