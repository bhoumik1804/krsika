import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockRice } from '../data/schema'

type StockRiceDialogType = 'add' | 'edit' | 'delete'

type StockRiceContextType = {
    open: StockRiceDialogType | null
    setOpen: (str: StockRiceDialogType | null) => void
    currentRow: StockRice | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockRice | null>>
}

const StockRiceContext = React.createContext<StockRiceContextType | null>(null)

export function StockRiceProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockRiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockRice | null>(null)

    return (
        <StockRiceContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockRiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockRice = () => {
    const context = React.useContext(StockRiceContext)

    if (!context) {
        throw new Error('stockRice has to be used within <StockRiceContext>')
    }

    return context
}
