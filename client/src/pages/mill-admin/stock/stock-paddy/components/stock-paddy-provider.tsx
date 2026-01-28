import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockPaddy } from '../data/schema'

type StockPaddyDialogType = 'add' | 'edit' | 'delete'

type StockPaddyContextType = {
    open: StockPaddyDialogType | null
    setOpen: (str: StockPaddyDialogType | null) => void
    currentRow: StockPaddy | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockPaddy | null>>
}

const StockPaddyContext = React.createContext<StockPaddyContextType | null>(null)

export function StockPaddyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockPaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockPaddy | null>(null)

    return (
        <StockPaddyContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockPaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockPaddy = () => {
    const context = React.useContext(StockPaddyContext)

    if (!context) {
        throw new Error('stockPaddy has to be used within <StockPaddyContext>')
    }

    return context
}
