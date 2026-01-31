import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockOverview } from '../data/schema'

type StockOverviewDialogType = 'add' | 'edit' | 'delete'

type StockOverviewContextType = {
    open: StockOverviewDialogType | null
    setOpen: (str: StockOverviewDialogType | null) => void
    currentRow: StockOverview | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockOverview | null>>
}

const StockOverviewContext = React.createContext<StockOverviewContextType | null>(null)

export function StockOverviewProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockOverviewDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockOverview | null>(null)

    return (
        <StockOverviewContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockOverviewContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockOverview = () => {
    const context = React.useContext(StockOverviewContext)

    if (!context) {
        throw new Error('stockOverview has to be used within <StockOverviewContext>')
    }

    return context
}
