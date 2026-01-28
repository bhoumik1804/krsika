import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockByProducts } from '../data/schema'

type StockByProductsDialogType = 'add' | 'edit' | 'delete'

type StockByProductsContextType = {
    open: StockByProductsDialogType | null
    setOpen: (str: StockByProductsDialogType | null) => void
    currentRow: StockByProducts | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockByProducts | null>>
}

const StockByProductsContext = React.createContext<StockByProductsContextType | null>(null)

export function StockByProductsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockByProductsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockByProducts | null>(null)

    return (
        <StockByProductsContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockByProductsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockByProducts = () => {
    const context = React.useContext(StockByProductsContext)

    if (!context) {
        throw new Error('stockByProducts has to be used within <StockByProductsContext>')
    }

    return context
}
