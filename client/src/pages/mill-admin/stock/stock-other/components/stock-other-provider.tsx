import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockOther } from '../data/schema'

type StockOtherDialogType = 'add' | 'edit' | 'delete'

type StockOtherContextType = {
    open: StockOtherDialogType | null
    setOpen: (str: StockOtherDialogType | null) => void
    currentRow: StockOther | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockOther | null>>
}

const StockOtherContext = React.createContext<StockOtherContextType | null>(null)

export function StockOtherProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockOtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockOther | null>(null)

    return (
        <StockOtherContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockOtherContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockGunnyOther = () => {
    const context = React.useContext(StockOtherContext)

    if (!context) {
        throw new Error('stockGunnyOther has to be used within <StockOtherContext>')
    }

    return context
}
